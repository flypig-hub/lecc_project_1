import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  isSlow: boolean;
  lastChecked: number;
  retryCount: number;
}

/**
 * Hook for monitoring network status and handling offline scenarios
 */
export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlow: false,
    lastChecked: Date.now(),
    retryCount: 0
  });

  const checkConnectionSpeed = useCallback(async () => {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const isSlow = responseTime > 2000; // 2 seconds threshold
      
      setNetworkStatus(prev => ({
        ...prev,
        isSlow,
        lastChecked: Date.now()
      }));
      
      return { isOnline: true, isSlow, responseTime };
    } catch (error) {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        lastChecked: Date.now(),
        retryCount: prev.retryCount + 1
      }));
      return { isOnline: false, isSlow: true, error };
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: true,
        lastChecked: Date.now(),
        retryCount: 0
      }));
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        lastChecked: Date.now(),
        retryCount: prev.retryCount + 1
      }));
    };

    const handleConnectionChange = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine,
        lastChecked: Date.now()
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Monitor connection changes
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);

    // Initial connection speed check
    checkConnectionSpeed();

    // Periodic connection checks
    const interval = setInterval(checkConnectionSpeed, 30000); // Every 30 seconds

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, [checkConnectionSpeed]);

  const retryConnection = useCallback(async () => {
    setNetworkStatus(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1
    }));
    
    try {
      await checkConnectionSpeed();
    } catch (error) {
      console.error('Network retry failed:', error);
    }
  }, [checkConnectionSpeed]);

  return {
    ...networkStatus,
    retryConnection,
    checkConnectionSpeed
  };
};
