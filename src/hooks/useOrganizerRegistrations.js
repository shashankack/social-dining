import { useState, useEffect } from 'react';
import api from '../lib/api';

export const useOrganizerRegistrations = (token) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRegistrations = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/organizer/registrations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch registrations';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [token]);

  return { data, loading, error, refetch: fetchRegistrations };
};
