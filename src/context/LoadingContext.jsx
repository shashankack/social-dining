import { createContext, useState, useCallback, useContext } from "react";
import Loader from "../components/Loader";

const LoadingContext = createContext({
  loading: false,
  startLoading: () => {},
  stopLoading: () => {},
  withLoading: (fn, loadingKey) => fn(), // Add withLoading to context
});

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  // withLoading will wrap any async function and manage loading state
  const withLoading = useCallback(async (fn, loadingKey) => {
    try {
      startLoading();
      return await fn(); // Call the function
    } catch (err) {
      console.error(`Error during ${loadingKey}:`, err);
      throw err; // Propagate the error
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading, withLoading }}>
      {children}
      {loading && <Loader />} {/* Show loader when loading is true */}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
