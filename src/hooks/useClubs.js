import { useState, useEffect } from "react";
import api from "../lib/api";
import { cachedApiCall, apiCache } from "../lib/apiCache";

// Fetch clubs (optionally by organizer, or add params if needed)
export function useClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const cacheKey = apiCache.generateKey("/clubs");

    cachedApiCall(
      () => api.get("/clubs"),
      cacheKey,
      { ttl: 10 * 60 * 1000 } // 10 minutes cache for clubs
    )
      .then((res) => {
        setClubs(res.data.clubs || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { clubs, setClubs, loading, error };
}

// Fetch details for a single club by slug
export function useClubDetails(slug) {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    const cacheKey = apiCache.generateKey(`/clubs/${slug}`);

    cachedApiCall(
      () => api.get(`/clubs/${slug}`),
      cacheKey,
      { ttl: 10 * 60 * 1000 } // 10 minutes cache for club details
    )
      .then((res) => {
        setClub(res.data.club || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return { club, loading, error };
}
