import { useCallback } from 'react';

export interface AnalyticsEvent {
  event: string;
  category: 'achievement' | 'transaction' | 'login' | 'logout' | 'transfer' | 'deposit' | 'withdraw';
  timestamp: number;
  data?: Record<string, any>;
  userId?: number;
  sessionId: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  reward: number;
  unlockedAt: number;
}

export interface TransactionAnalytics {
  amount: number;
  type: string;
  category: string;
  timestamp: number;
  userId: number;
}

/**
 * Hook for tracking user analytics and achievements
 */
export const useAnalytics = () => {
  const sessionId = useCallback(() => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }, []);

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    // Send to analytics service
    const analyticsData = {
      ...event,
      sessionId,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      url: window.location.href
    };

    // Store in localStorage for offline tracking
    const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    storedEvents.push(analyticsData);
    localStorage.setItem('analytics_events', JSON.stringify(storedEvents));

    // Send to server when online
    if (navigator.onLine) {
      fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(analyticsData)
      }).catch(error => {
        console.error('Analytics tracking failed:', error);
      });
    }
  }, [sessionId]);

  const trackAchievement = useCallback((achievement: Achievement) => {
    trackEvent({
      event: 'achievement',
      category: 'achievement',
      data: {
        achievementId: achievement.id,
        achievementName: achievement.name,
        tier: achievement.tier,
        reward: achievement.reward
      }
    });
  }, [trackEvent]);

  const trackTransaction = useCallback((transaction: TransactionAnalytics) => {
    trackEvent({
      event: 'transaction',
      category: 'transaction',
      data: {
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category
      }
    });
  }, [trackEvent]);

  const trackUserAction = useCallback((action: string, data?: Record<string, any>) => {
    trackEvent({
      event: action,
      category: 'user',
      data
    });
  }, [trackEvent]);

  const getEvents = useCallback((category?: string) => {
    const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    return category 
      ? storedEvents.filter((event: AnalyticsEvent) => event.category === category)
      : storedEvents;
  }, []);

  const getAchievements = useCallback(() => {
    const achievementEvents = getEvents('achievement');
    return achievementEvents.map((event: AnalyticsEvent) => event.data as Achievement);
  }, [getEvents]);

  const getTransactionHistory = useCallback(() => {
    const transactionEvents = getEvents('transaction');
    return transactionEvents.map((event: AnalyticsEvent) => event.data as TransactionAnalytics);
  }, [getEvents]);

  const getSessionStats = useCallback(() => {
    const allEvents = getEvents();
    const sessionStart = Math.min(...allEvents.map(e => e.timestamp));
    
    const sessionEvents = allEvents.filter(event => 
      event.timestamp >= sessionStart && event.sessionId === sessionId
    );

    return {
      sessionId,
      startTime: sessionStart,
      duration: Date.now() - sessionStart,
      eventCount: sessionEvents.length,
      categories: {
        achievements: sessionEvents.filter(e => e.category === 'achievement').length,
        transactions: sessionEvents.filter(e => e.category === 'transaction').length,
        userActions: sessionEvents.filter(e => e.category === 'user').length
      }
    };
  }, [getEvents, sessionId]);

  const clearAnalytics = useCallback(() => {
    localStorage.removeItem('analytics_events');
  }, []);

  const exportAnalytics = useCallback(() => {
    const allEvents = getEvents();
    const dataStr = JSON.stringify(allEvents, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `rpgbank_analytics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [getEvents]);

  return {
    trackEvent,
    trackAchievement,
    trackTransaction,
    trackUserAction,
    getEvents,
    getAchievements,
    getTransactionHistory,
    getSessionStats,
    clearAnalytics,
    exportAnalytics
  };
};
