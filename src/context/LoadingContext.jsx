import { createContext, useState, useCallback, useContext } from "react";
import Loader from "../components/Loader";

const LoadingContext = createContext({
  loading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
      {loading && <Loader />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
