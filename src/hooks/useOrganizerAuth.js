import { useState, useEffect } from 'react';
import { httpClient } from '../lib/http';

export const useOrganizerAuth = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('organizerToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.post('/organizer/login', { email, password });
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
