import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Collections } from "@/lib/firebaseCollections";
import { logSecurityEventTransaction } from "./auditLogger";

export interface BruteForceStatus {
  isLocked: boolean;
  lockoutTimeRemainingSeconds: number;
  requiresPasswordReset: boolean;
}

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

/**
 * Tracks failed authentication cycles against a dedicated tracking document [INDEX].
 */
export async function processFailedLoginAttemptTracker(email: string): Promise<BruteForceStatus> {
  const sanitizedEmailKey = email.trim().toLowerCase().replace(/[.#$[\]]/g, "_");
  const trackingDocRef = doc(db, "security_brute_force_guards", sanitizedEmailKey);
  const now = Date.now();

  const snap = await getDoc(trackingDocRef);
  
  if (!snap.exists()) {
    await setDoc(trackingDocRef, {
      attemptsCount: 1,
      lockedUntil: 0,
      updatedAt: now
    });
    return { isLocked: false, lockoutTimeRemainingSeconds: 0, requiresPasswordReset: false };
  }

  const data = snap.data();

  // Check active lockout state
  if (data.lockedUntil > now) {
    return {
      isLocked: true,
      lockoutTimeRemainingSeconds: Math.round((data.lockedUntil - now) / 1000),
      requiresPasswordReset: data.attemptsCount >= 10
    };
  }

  const updatedAttempts = data.attemptsCount + 1;
  let lockedUntil = 0;
  let requiresPasswordReset = false;

  if (updatedAttempts >= 10) {
    lockedUntil = now + FIFTEEN_MINUTES_MS * 4; // Long lockout boundary
    requiresPasswordReset = true;
    await logSecurityEventTransaction("anonymous_session", "AUTH_PASSWORD_ATTEMPTS_EXCEEDED", { email });
  } else if (updatedAttempts >= 5) {
    lockedUntil = now + FIFTEEN_MINUTES_MS; // Standard 15-Minute Penalty Lockout [INDEX]
    await logSecurityEventTransaction("anonymous_session", "AUTH_PASSWORD_ATTEMPTS_EXCEEDED", { email });
  }

  await updateDoc(trackingDocRef, {
    attemptsCount: increment(1),
    lockedUntil,
    updatedAt: now
  });

  return {
    isLocked: lockedUntil > now,
    lockoutTimeRemainingSeconds: lockedUntil > now ? Math.round((lockedUntil - now) / 1000) : 0,
    requiresPasswordReset
  };
}

/**
 * Flushes failure tracking fields immediately upon a successful sign-in handshake [INDEX].
 */
export async function clearBruteForceTracker(email: string): Promise<void> {
  const sanitizedEmailKey = email.trim().toLowerCase().replace(/[.#$[\]]/g, "_");
  const trackingDocRef = doc(db, "security_brute_force_guards", sanitizedEmailKey);
  await setDoc(trackingDocRef, { attemptsCount: 0, lockedUntil: 0, updatedAt: Date.now() }, { merge: true });
}
