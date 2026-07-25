import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Platform } from "react-native";

export type PrivacyAuditableAction =
  | "PRIVACY_POLICY_ACCEPTED"
  | "TERMS_AND_CONDITIONS_ACCEPTED"
  | "USER_CONSENT_UPDATED"
  | "PORTABILITY_DATA_EXPORT_REQUESTED"
  | "CASCADE_ACCOUNT_DELETION_TRIGGERED"
  | "PRIVACY_PREFERENCES_MUTATED";

/**
 * Logs unalterable privacy compliance items directly to secure databases [INDEX].
 */
export async function logPrivacyComplianceEvent(userId: string, action: PrivacyAuditableAction, status: "SUCCESS" | "FAILED"): Promise<void> {
  try {
    await addDoc(collection(db, "privacyAuditLogs"), {
      timestamp: Date.now(),
      userId: userId || "anonymous_session",
      action,
      status,
      devicePlatform: Platform.OS,
      appVersion: "1.7.0"
    });
    console.log(`[PRIVACY AUDIT] Event ${action} successfully logged.`);
  } catch (error) {
    console.log("[PRIVACY ERROR] Failed to write compliance log entry: ", error);
  }
}
