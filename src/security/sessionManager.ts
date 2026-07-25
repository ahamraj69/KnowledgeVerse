import { auth } from "@/lib/firebase";
import { SecurityConstants } from "./securityConstants";

let lastInteractionTimestamp = Date.now();

/**
 * Updates the interaction clock monitor with active device coordinate parameters [INDEX].
 */
export function recordUserActivityPulse(): void {
  lastInteractionTimestamp = Date.now();
}

/**
 * Evaluates inactivity intervals to trigger secure sign-out operations if necessary [INDEX].
 */
export function checkSessionInactivityTimeout(): boolean {
  const currentMoment = Date.now();
  const inactiveDuration = currentMoment - lastInteractionTimestamp;

  if (inactiveDuration > SecurityConstants.SESSION_TIMEOUT_MS) {
    console.log("[SECURITY GUARD] Session exceeded inactivity timeout boundaries. Triggering cleanup...");
    terminateSessionSecurely();
    return true;
  }

  return false;
}

/**
 * Clears credential state caches and signs the user out safely [INDEX].
 */
export async function terminateSessionSecurely(): Promise<void> {
  try {
    recordUserActivityPulse();
    await auth.signOut();
    console.log("[SECURITY GUARD] Persistent local credential caches cleared cleanly.");
  } catch (error) {
    console.log("Error finalizing secure logout transaction loop: ", error);
  }
}
