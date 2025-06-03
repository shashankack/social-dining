import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // still needed for cookie-based sessions
});

// ✅ Inject token from localStorage if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    // Only add Authorization header if token exists and isn't a placeholder
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
