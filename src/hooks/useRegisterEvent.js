import { useState } from "react";
import api from "../lib/api";
import { apiCache } from "../lib/apiCache";

export function useRegisterEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const registerEvent = async (activitySlug, formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post(`/activities/${activitySlug}/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        ticketCount: formData.ticketCount || 1,
      });

      // Clear activities cache after successful registration
      // This ensures fresh data is fetched on next request
      apiCache.clearPattern('/activities');

      setResult(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Registration failed";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return { registerEvent, loading, error, result };
}
