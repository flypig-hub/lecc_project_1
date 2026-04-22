import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import '../styles/AdminDashboard.css';

interface AdminStats {
  totalUsers: number;
  totalAccounts: number;
  totalBalance: string;
  todayTransactions: number;
  activeUsers: number;
  date: string;
}

interface TransactionData {
  date: string;
  transactionCount: number;
  totalAmount: number;
}

interface ServerStatus {
  status: 'UP' | 'DOWN';
  responseTime: number;
  lastChecked: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [chartData, setChartData] = useState<TransactionData[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    status: 'UP',
    responseTime: 0,
    lastChecked: new Date().toLocaleString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchChartData();
    checkServerStatus();
    
    const interval = setInterval(() => {
      checkServerStatus();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        setError('Failed to fetch admin statistics');
      }
    } catch (err) {
      setError('Error fetching statistics');
    }
  };

  const fetchChartData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/transactions/chart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setChartData(data);
      } else {
        setError('Failed to fetch chart data');
      }
    } catch (err) {
      setError('Error fetching chart data');
    } finally {
      setLoading(false);
    }
  };

  const checkServerStatus = async () => {
    try {
      const startTime = Date.now();
      const response = await fetch('/actuator/health');
      const endTime = Date.now();
      
      setServerStatus({
        status: response.ok ? 'UP' : 'DOWN',
        responseTime: endTime - startTime,
        lastChecked: new Date().toLocaleString()
      });
    } catch (err) {
      setServerStatus({
        status: 'DOWN',
        responseTime: 0,
        lastChecked: new Date().toLocaleString()
      });
    }
  };

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="error-container">
          <h2>⚠️ Error Loading Admin Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading Admin Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🏰 RPG Bank Admin Dashboard</h1>
        <div className="server-status">
          <span className={`status-indicator ${serverStatus.status.toLowerCase()}`}>
            {serverStatus.status === 'UP' ? '🟢' : '🔴'}
          </span>
          <span>Server: {serverStatus.status}</span>
          <span>Response: {serverStatus.responseTime}ms</span>
          <span>Last: {serverStatus.lastChecked}</span>
        </div>
      </header>

      <main className="admin-main">
        {/* Statistics Cards */}
        <section className="stats-section">
          <h2>📊 System Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>👥 Total Users</h3>
              <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>💳 Total Accounts</h3>
              <p className="stat-number">{stats.totalAccounts.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>💰 Total Balance</h3>
              <p className="stat-number">₩{parseFloat(stats.totalBalance).toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>📈 Today's Transactions</h3>
              <p className="stat-number">{stats.todayTransactions.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>🎮 Active Users (7d)</h3>
              <p className="stat-number">{stats.activeUsers.toLocaleString()}</p>
            </div>
          </div>
        </section>

        {/* Transaction Chart */}
        <section className="chart-section">
          <h2>📈 7-Day Transaction Volume</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="transactionCount" 
                  fill="#8b5cf6" 
                  name="Transactions"
                />
                <Bar 
                  yAxisId="right"
                  dataKey="totalAmount" 
                  fill="#10b981" 
                  name="Total Amount (₩)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
