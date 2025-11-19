import { useState, useEffect } from "react";
import api from "../lib/api";

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
    // Support fields param for filtering fields in API response
    if (arguments[0] && Array.isArray(arguments[0].fields) && arguments[0].fields.length > 0) {
      params.fields = arguments[0].fields.join(',');
    }
    api
      .get("/activities", { params })
      .then((res) => {
        let fetchedActivities = res.data.activities || [];
        if (currentStatus) {
          fetchedActivities = fetchedActivities.filter(
            (activity) => activity.currentStatus === currentStatus
          );
        }
        setActivities(fetchedActivities);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [currentStatus, count, arguments[0]?.fields?.join(',')]);

  return { activities, setActivities, loading, error };
}

// Fetch details for a single activity by slug, with optional fields param
export function useActivityDetails(slug, fields) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const params = {};
    if (Array.isArray(fields) && fields.length > 0) {
      params.fields = fields.join(',');
    }

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
  }, [slug, Array.isArray(fields) ? fields.join(',') : '']);

  return { activity, loading, error };
}
