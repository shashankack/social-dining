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
      let errorMessage = "Registration failed";
      
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 500) {
        // Check if it's a duplicate key error
        const errorText = err.response?.data?.message || err.message || "";
        if (errorText.includes("duplicate key") || errorText.includes("already exists")) {
          if (errorText.includes("phone")) {
            errorMessage = "This phone number is already registered. Please use a different number or log in.";
          } else if (errorText.includes("email")) {
            errorMessage = "This email is already registered. Please use a different email or log in.";
          } else {
            errorMessage = "This account already exists. Please use different details.";
          }
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  return { registerEvent, loading, error, result };
}
