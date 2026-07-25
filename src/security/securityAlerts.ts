import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SecurityEvent } from "./securityConstants";

export type SecurityAlertSeverity = "low" | "medium" | "high" | "critical";

export interface SystemSecurityAlert {
  id: string;
  event: SecurityEvent;
  severity: SecurityAlertSeverity;
  timestamp: number;
  description: string;
  requiresReview: boolean;
}

/**
 * Creates prioritized alerts inside database collections to instantly flag systemic threats [INDEX].
 */
export async function dispatchSecurityAlertSignal(
  event: SecurityEvent,
  severity: SecurityAlertSeverity,
  description: string
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "systemSecurityAlerts"), {
      event,
      severity,
      timestamp: Date.now(),
      description,
      requiresReview: true
    });
    return docRef.id;
  } catch (e) {
    console.log("Error dispatching critical alert container: ", e);
    return null;
  }
}
