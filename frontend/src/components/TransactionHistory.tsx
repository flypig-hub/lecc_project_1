import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Transaction {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER_SENT' | 'TRANSFER_RECEIVED' | 'INTEREST';
  amount: number;
  transactionDate: string;
  description: string;
  fromAccountId?: number;
  toAccountId?: number;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/bank/transactions');
        setTransactions(response.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_RECEIVED':
      case 'INTEREST':
        return 'text-green-400';
      case 'WITHDRAW':
      case 'TRANSFER_SENT':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return '+'; // Gold coins coming in
      case 'WITHDRAW':
        return '-'; // Gold coins going out
      case 'TRANSFER_SENT':
        return '>'; // Sending gold
      case 'TRANSFER_RECEIVED':
        return '<'; // Receiving gold
      case 'INTEREST':
        return '*'; // Interest magic
      default:
        return '?';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">ADVENTURE LOG</h2>
        <div className="text-center text-yellow-300">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-2"></div>
          <p>Loading adventure log...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">ADVENTURE LOG</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center text-yellow-300 py-8">
          <p className="text-lg">No adventures recorded yet</p>
          <p className="text-sm mt-2">Start your journey to see your adventure log!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-black border-2 border-yellow-600 rounded p-3 flex items-center justify-between hover:border-yellow-400 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className={`text-2xl font-bold ${getTransactionColor(transaction.type)}`}>
                  {getTransactionIcon(transaction.type)}
                </span>
                <div>
                  <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type.replace('_', ' ')}
                  </p>
                  <p className="text-yellow-300 text-sm">
                    {transaction.description || 'No description'}
                  </p>
                  <p className="text-yellow-500 text-xs">
                    {formatDate(transaction.transactionDate)}
                  </p>
                </div>
              </div>
              <div className={`text-xl font-bold ${getTransactionColor(transaction.type)}`}>
                {transaction.type === 'DEPOSIT' || 
                 transaction.type === 'TRANSFER_RECEIVED' || 
                 transaction.type === 'INTEREST' ? '+' : '-'}
                {transaction.amount.toFixed(2)} GOLD
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-yellow-500 text-sm animate-pulse">
          Adventure log updates automatically
        </p>
      </div>
    </div>
  );
};

export default TransactionHistory;
