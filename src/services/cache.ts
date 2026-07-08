type CacheItem<T> = {
  data: T;
  timestamp: number;
};

const cache = new Map<string, CacheItem<any>>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCache<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;

  const expired = Date.now() - item.timestamp > CACHE_DURATION;
  if (expired) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
