import { useCallback } from "react";
import { fetchEvents, fetchEventById } from "../services/eventService";
import { useEventsCache } from "../context/EventsCacheContext";
import { useLoading } from "../context/LoadingContext";

export const useEvents = () => {
  const { events, setEvents, getEventById } = useEventsCache();
  const { withLoading } = useLoading();

  // Fetch all events
  const getAllEvents = useCallback(async () => {
    try {
      return await withLoading(async () => {
        const freshEvents = await fetchEvents();
        setEvents(freshEvents);
        return freshEvents;
      }, "events-fetch");
    } catch (error) {
      console.error("Failed to fetch events:", error);
      throw error; // Throw to allow UI to catch and handle it
    }
  }, [setEvents, withLoading]);

  // Fetch a single event by ID
  const getSingleEvent = useCallback(
    async (id) => {
      try {
        return await withLoading(async () => {
          // First check if the event is cached
          const cachedEvent = getEventById(id);
          if (cachedEvent) return cachedEvent;

          // Fetch from API if not cached
          const event = await fetchEventById(id);

          // Update cache with the new event if necessary
          setEvents((prev) => {
            const exists = prev.some((e) => e.id === id);
            return exists ? prev : [...prev, event];
          });

          return event;
        }, `event-fetch-${id}`);
      } catch (error) {
        console.error(`Failed to fetch event ${id}:`, error);
        throw error; // Ensure error is thrown to handle in the UI
      }
    },
    [getEventById, setEvents, withLoading]
  );

  // Refresh events by re-fetching all events
  const refreshEvents = useCallback(async () => {
    return getAllEvents();
  }, [getAllEvents]);

  // Return necessary data and methods
  return {
    events,
    getAllEvents,
    getSingleEvent,
    refreshEvents,
    isLoading: useLoading().isLoading,
  };
};
