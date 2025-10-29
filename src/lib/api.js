import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    // Add other default headers here if needed
  },
});

// Helper: fallback handler for failed/timed out requests
async function fallbackRequest(error) {
  // Timeout or network error
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    // Optionally, you can trigger a refresh token logic here if you use auth
    // For now, try a single retry after a short delay
    await new Promise(res => setTimeout(res, 1000));
    try {
      return await api.request(error.config);
    } catch (retryError) {
      // Still failed, propagate
      return Promise.reject(retryError);
    }
  }
  // Other errors: propagate
  return Promise.reject(error);
}

// Attach response interceptor for fallback
api.interceptors.response.use(
  response => response,
  fallbackRequest
);

export default api;
