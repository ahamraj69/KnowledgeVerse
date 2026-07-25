import { logSecurityEventTransaction } from "./auditLogger";

interface ActionThrottleTracker {
  timestamps: number[];
  isThrottled: boolean;
  throttledUntil: number;
}

const slidingWindowCacheMap: Record<string, ActionThrottleTracker> = {};
const MAXIMUM_REQUESTS_PER_WINDOW = 10; 
const RETENTION_WINDOW_MS = 60 * 1000; // 1-minute tracking window

/**
 * Slides a tracking window over operations to prevent API flooding and script injections [INDEX].
 */
export function enforceActionRateLimitThrottle(userId: string, actionCategory: string): { allowed: boolean; remainingThrottledTimeMs: number } {
  const trackerKey = `${userId}_${actionCategory}`;
  const now = Date.now();

  if (!slidingWindowCacheMap[trackerKey]) {
    slidingWindowCacheMap[trackerKey] = { timestamps: [], isThrottled: false, throttledUntil: 0 };
  }

  const tracker = slidingWindowCacheMap[trackerKey];

  if (tracker.throttledUntil > now) {
    return { allowed: false, remainingThrottledTimeMs: tracker.throttledUntil - now };
  }

  // Filter out expired timestamps
  tracker.timestamps = tracker.timestamps.filter(ts => now - ts < RETENTION_WINDOW_MS);

  if (tracker.timestamps.length >= MAXIMUM_REQUESTS_PER_WINDOW) {
    tracker.throttledUntil = now + 30 * 1000; // 30-second throttle penalty window [INDEX]
    tracker.isThrottled = true;
    logSecurityEventTransaction(userId, "ROUTE_UNAUTHORIZED_ACCESS", { actionCategory, reason: "Rate limit threshold breached." });
    return { allowed: false, remainingThrottledTimeMs: 30 * 1000 };
  }

  tracker.timestamps.push(now);
  return { allowed: true, remainingThrottledTimeMs: 0 };
}
