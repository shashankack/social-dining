import { useState } from "react";
import api from "../lib/api";

export function useMarkAttendance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const markAttendance = async (token, registrationId) => {
    if (!token) {
      throw new Error("Missing organizer token");
    }

    if (!registrationId) {
      throw new Error("Missing registration ID");
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.patch(
        `/organizer/registrations/${registrationId}/attendance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setResult(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to mark attendance";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { markAttendance, loading, error, result };
}
