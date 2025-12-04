// Session-based API cache
// Cache is cleared on page refresh

class ApiCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    // Default cache duration: 5 minutes
    this.defaultTTL = 5 * 60 * 1000;
  }

  /**
   * Generate a cache key from URL and params
   */
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    return `${url}${sortedParams ? "?" + sortedParams : ""}`;
  }

  /**
   * Check if cache entry is still valid
   */
  isValid(key, ttl = this.defaultTTL) {
    if (!this.cache.has(key)) return false;
    const timestamp = this.timestamps.get(key);
    return Date.now() - timestamp < ttl;
  }

  /**
   * Get cached data
   */
  get(key) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return null;
  }

  /**
   * Set cached data
   */
  set(key, data) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
  }

  /**
   * Clear specific cache entry
   */
  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  /**
   * Clear cache entries matching a pattern
   */
  clearPattern(pattern) {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.delete(key);
      }
    }
  }
}

// Export singleton instance
export const apiCache = new ApiCache();

/**
 * Wrapper for API requests with caching
 * @param {Function} apiCall - The axios API call function
 * @param {string} cacheKey - Unique cache key
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in milliseconds
 * @param {boolean} options.skipCache - Skip cache and fetch fresh data
 * @returns {Promise} - Promise resolving to API response data
 */
export async function cachedApiCall(
  apiCall,
  cacheKey,
  { ttl, skipCache = false } = {}
) {
  // Check if we should skip cache
  if (skipCache) {
    const response = await apiCall();
    apiCache.set(cacheKey, response.data);
    return response;
  }

  // Check if valid cached data exists
  if (apiCache.isValid(cacheKey, ttl)) {
    const cachedData = apiCache.get(cacheKey);

    // Return in same format as axios response
    return Promise.resolve({ data: cachedData });
  }

  // Fetch fresh data

  const response = await apiCall();
  apiCache.set(cacheKey, response.data);
  return response;
}
