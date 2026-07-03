// 🧠 Simple In-Memory Cache
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * Stores data in the memory cache with a fresh timestamp.
 */
export const setCache = (key: string, data: any): void => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

/**
 * Retrieves data from the memory cache if it exists and hasn't expired.
 * @param ttl Time-to-live in milliseconds (defaults to 60000ms / 1 minute)
 */
export const getCache = (key: string, ttl = 60000): any | null => {
  const item = cache.get(key);

  if (!item) return null;

  const isExpired = Date.now() - item.timestamp > ttl;

  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return item.data;
};

/**
 * Manually invalidates or clears a specific cache key when records change.
 */
export const deleteCache = (key: string): void => {
  cache.delete(key);
};
