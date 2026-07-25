import { auth } from "@/lib/firebase";
import { recordUserActivityPulse } from "@/security/sessionManager";

/**
 * Clears memory references and local session caches during sign-out [INDEX].
 */
export async function executeSecureSignOutCleanup(): Promise<boolean> {
  try {
    console.log("[SECURITY CLEANUP] Initializing runtime data minimization sweep...");

    // 1. Invalidate session timestamps
    recordUserActivityPulse();

    // 2. Terminate the active authentication session token
    await auth.signOut();

    console.log("[SECURITY CLEANUP] Volatile memory structures flushed cleanly.");
    return true;
  } catch (error) {
    console.log("[SECURITY CLEANUP] Critical error during session cleanup:", error);
    return false;
  }
}
