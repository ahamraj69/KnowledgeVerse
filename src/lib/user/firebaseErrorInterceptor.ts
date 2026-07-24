/**
 * Catches raw database/auth exceptions and parses safe user labels [INDEX].
 */
export function interceptFirebaseExceptionMessage(error: any): string {
  if (!error) return "An unexpected transaction loop fault occurred.";
  
  const code = error?.code || "";
  console.log(`[FIREBASE FAULT INTERCEPTED] Code Shard: ${code} - Message: ${error?.message}`);

  switch (code) {
    // Authentication Specific Fault Blocks
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid credential parameter pairing. Check your email or secret key input strings.";
    case "auth/email-already-in-use":
      return "This email address is already bound to another profile record layout.";
    case "auth/network-request-failed":
      return "No internet connection detected. Check your device wireless hardware settings.";
      
    // Firestore Collection Firewall Fault Blocks
    case "permission-denied":
      return "Administrative Access Denied. Your security role level cannot edit this index path.";
    case "unavailable":
      return "The cloud storage server is temporarily offline. Changes will synchronize upon reconnection.";
      
    default:
      return error?.message || "Database transaction aborted. Please try again.";
  }
}
