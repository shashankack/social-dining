import { useState, useEffect } from "react";
import api from '../lib/api';

// Fetch activities with optional currentStatus and count (limit)
export function useActivities({ currentStatus, count } = {}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (count) params.limit = count;
    api
      .get('/activities', { params })
      .then((res) => {
        let fetchedActivities = res.data.activities || [];
        if (currentStatus) {
          fetchedActivities = fetchedActivities.filter(activity => activity.currentStatus === currentStatus);
        }
        setActivities(fetchedActivities);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [currentStatus, count]);

  return { activities, setActivities, loading, error };
}

// Fetch details for a single activity by slug
export function useActivityDetails(slug) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    api
      .get(`/activities/${slug}`)
      .then((res) => {
        setActivity(res.data.activity || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return { activity, loading, error };
}
