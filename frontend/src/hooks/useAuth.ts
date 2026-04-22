import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../utils/api';

/**
 * Custom hook for authentication state and operations
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login user with credentials
   */
  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (context?.setUser) {
        context.setUser(user);
      }
      
      return { success: true, user };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [context]);

  /**
   * Register new user
   */
  const register = useCallback(async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (context?.setUser) {
        context.setUser(user);
      }
      
      return { success: true, user };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [context]);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (context?.setUser) {
      context.setUser(null);
    }
    
    setError(null);
  }, [context]);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }, []);

  /**
   * Get current user from context
   */
  const getCurrentUser = useCallback(() => {
    return context?.user || null;
  }, [context]);

  /**
   * Get user role
   */
  const getUserRole = useCallback(() => {
    const user = getCurrentUser();
    return user?.role || null;
  }, [getCurrentUser]);

  /**
   * Check if user has admin role
   */
  const isAdmin = useCallback(() => {
    return getUserRole() === 'ROLE_ADMIN';
  }, [getUserRole]);

  return {
    user: context?.user || null,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getCurrentUser,
    getUserRole,
    isAdmin,
  };
};
