import { auth } from "@/lib/firebase";

/**
 * Verifies that the current user context holds a valid Firebase Authentication token [INDEX].
 */
export function isUserAuthenticated(): boolean {
  return auth.currentUser !== null;
}

/**
 * Checks if the user session has a confirmed email address where required [INDEX].
 */
export function isUserEmailVerified(): boolean {
  const user = auth.currentUser;
  if (!user) return false;
  return user.emailVerified;
}
