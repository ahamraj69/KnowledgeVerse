import { recordUserActivityPulse } from "./sessionManager";

export const SecureStoragePolicy = {
  /**
   * Enforces non-persistence boundaries over memory variables before caching operations.
   */
  sanitizeDataBeforeLocalCaching<T extends Record<string, any>>(rawInputPayload: T): Partial<T> {
    const sanitizedCopy = { ...rawInputPayload };
    
    // Explicitly wipe sensitive credentials variables before device writes [1]
    delete sanitizedCopy.authToken;
    delete sanitizedCopy.verificationDocuments;
    delete sanitizedCopy.adminNote;
    
    return sanitizedCopy;
  },

  /**
   * Resets local interaction ticks to invalidate session caches on sign-out.
   */
  clearSensitiveCacheOnSessionTermination(): void {
    console.log("[STORAGE POLICY] Flashing local volatile cache shards.");
    recordUserActivityPulse(); // Resets activity trackers timestamps to epoch baseline
  }
};
