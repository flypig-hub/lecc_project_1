import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  createdAt: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_IN' | 'TRANSFER_OUT';
  description: string;
  transactionDate: string;
  fromAccount?: string;
  toAccount?: string;
}

export interface BankState {
  accounts: Account[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for bank operations and state management
 */
export const useBank = () => {
  const [state, setState] = useState<BankState>({
    accounts: [],
    transactions: [],
    loading: false,
    error: null,
  });

  /**
   * Fetch user accounts
   */
  const fetchAccounts = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await api.get('/bank/accounts');
      setState(prev => ({
        ...prev,
        accounts: response.data,
        loading: false,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch accounts',
      }));
    }
  }, []);

  /**
   * Create new account
   */
  const createAccount = useCallback(async (initialBalance: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await api.post('/bank/accounts', { initialBalance });
      await fetchAccounts(); // Refresh accounts list
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to create account',
      }));
    }
  }, []);

  /**
   * Deposit to account
   */
  const deposit = useCallback(async (accountId: number, amount: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await api.post(`/bank/accounts/${accountId}/deposit`, { amount });
      await fetchAccounts(); // Refresh accounts
      await fetchTransactions(); // Refresh transactions
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Deposit failed',
      }));
    }
  }, []);

  /**
   * Withdraw from account
   */
  const withdraw = useCallback(async (accountId: number, amount: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await api.post(`/bank/accounts/${accountId}/withdraw`, { amount });
      await fetchAccounts(); // Refresh accounts
      await fetchTransactions(); // Refresh transactions
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Withdrawal failed',
      }));
    }
  }, []);

  /**
   * Transfer between accounts
   */
  const transfer = useCallback(async (fromAccountId: number, toAccountNumber: string, amount: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await api.post('/bank/transfer', {
        fromAccountId,
        toAccountNumber,
        amount,
      });
      await fetchAccounts(); // Refresh accounts
      await fetchTransactions(); // Refresh transactions
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Transfer failed',
      }));
    }
  }, []);

  /**
   * Fetch transactions
   */
  const fetchTransactions = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await api.get('/bank/transactions');
      setState(prev => ({
        ...prev,
        transactions: response.data,
        loading: false,
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Failed to fetch transactions',
      }));
    }
  }, []);

  /**
   * Calculate total balance across all accounts
   */
  const getTotalBalance = useCallback(() => {
    return state.accounts.reduce((total, account) => total + account.balance, 0);
  }, [state.accounts]);

  /**
   * Get account by ID
   */
  const getAccountById = useCallback((accountId: number) => {
    return state.accounts.find(account => account.id === accountId);
  }, [state.accounts]);

  /**
   * Get recent transactions (last 10)
   */
  const getRecentTransactions = useCallback(() => {
    return state.transactions
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 10);
  }, [state.transactions]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  return {
    ...state,
    fetchAccounts,
    createAccount,
    deposit,
    withdraw,
    transfer,
    fetchTransactions,
    getTotalBalance,
    getAccountById,
    getRecentTransactions,
    clearError,
  };
};
