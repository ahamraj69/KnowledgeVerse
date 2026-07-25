import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Platform } from "react-native";
import { SecurityEvent } from "./securityConstants";

export interface ComprehensiveAuditRow {
  timestamp: number;
  userId: string;
  event: SecurityEvent;
  platform: string;
  appVersion: string;
  contextPayload?: Record<string, any>;
}

/**
 * Writes un-editable audit logs to track crucial administrative changes [INDEX].
 */
export async function logSecurityEventTransaction(
  userId: string, 
  event: SecurityEvent, 
  metadata?: Record<string, any>
): Promise<void> {
  try {
    const payload: ComprehensiveAuditRow = {
      timestamp: Date.now(),
      userId: userId || "anonymous_session",
      event,
      platform: Platform.OS,
      appVersion: "1.7.0",
      ...(metadata && { contextPayload: metadata })
    };

    // Immutability is enforced at the database level via write-only firewalls [INDEX]
    await addDoc(collection(db, "securityAuditLogs"), payload);
    console.log(`[AUDIT TRAIL LOGGED] Event Type: ${event} successfully processed.`);
  } catch (error) {
    console.log("CRITICAL SECURITY GLITCH: Audit write loop aborted: ", error);
  }
}
