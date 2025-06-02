import { createContext, useContext, useEffect, useState } from "react";

const EventsCacheContext = createContext();

export const EventsCacheProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem("events");
    if (cached) {
      setEvents(JSON.parse(cached));
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (hasLoaded && events.length > 0) {
      sessionStorage.setItem("events", JSON.stringify(events));
    }
  }, [events, hasLoaded]);

  return (
    <EventsCacheContext.Provider
      value={{ events, setEvents, hasLoaded, setHasLoaded }}
    >
      {children}
    </EventsCacheContext.Provider>
  );
};

export const useEventsCache = () => useContext(EventsCacheContext);
