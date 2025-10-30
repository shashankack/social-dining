import { useState } from "react";
import api from "../lib/api";

// Hook to register a user as a club member
export function useRegisterClub() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const registerClub = async (clubId, data) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await api.post(`/clubs/${clubId}/register`, data);
      setResult(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { registerClub, loading, error, result };
}
