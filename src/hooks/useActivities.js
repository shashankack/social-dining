import { useState, useEffect } from "react";
import api from "../lib/api";
import { cachedApiCall, apiCache } from "../lib/apiCache";

// Fetch activities with optional currentStatus and count (limit)
export function useActivities({ currentStatus, count, sortBy, order, fields } = {}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create stable reference for fields
  const fieldsKey = Array.isArray(fields) ? fields.join(',') : '';

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (count) params.limit = count;
    if (currentStatus) params.status = currentStatus;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    
    // Support fields param for filtering fields in API response
    if (fieldsKey) {
      params.fields = fieldsKey;
    }

    // Include all params in cache key to prevent incorrect cached results
    const cacheKey = apiCache.generateKey("/activities", params);

    cachedApiCall(
      () => api.get("/activities", { params }),
      cacheKey,
      { ttl: 5 * 60 * 1000 } // 5 minutes cache
    )
      .then((res) => {
        let fetchedActivities = res.data.activities || [];
        setActivities(fetchedActivities);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [currentStatus, count, sortBy, order, fieldsKey]);

  return { activities, setActivities, loading, error };
}

// Fetch details for a single activity by slug, with optional fields param
// NO CACHING for individual event details - always fetch fresh data
export function useActivityDetails(slug, fields) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create stable reference for fields
  const fieldsKey = Array.isArray(fields) ? fields.join(',') : '';

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const params = {};
    if (fieldsKey) {
      params.fields = fieldsKey;
    }

    // Always fetch fresh data for individual event details (no caching)
    api
      .get(`/activities/${slug}`, { params })
      .then((res) => {
        setActivity(res.data.activity || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching activity details:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch activity details";
        setError(errorMessage);
        setLoading(false);
      });
  }, [slug, fieldsKey]);

  return { activity, loading, error };
}
