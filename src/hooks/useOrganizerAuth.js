import { useState, useEffect } from 'react';
import api from '../lib/api';

export const useOrganizerAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem('organizerToken'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/organizer/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('organizerToken', token);
      setToken(token);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('organizerToken');
    setToken(null);
  };

  return { token, loading, error, login, logout, isAuthenticated: !!token };
};
