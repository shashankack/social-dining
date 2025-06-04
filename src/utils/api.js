import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // If you're still using cookies for other things
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Or wherever you store the token
    if (token) {
      // Set Authorization header if token exists
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
