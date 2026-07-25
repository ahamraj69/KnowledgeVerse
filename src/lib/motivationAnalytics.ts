import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Commits interactive engagement metrics down to motivation auditing collection trackers [INDEX].
 */
export async function logMotivationTelemetryEvent(userId: string, eventType: string, targetId: string): Promise<void> {
  try {
    await addDoc(collection(db, "motivationAnalytics"), {
      userId,
      eventType,
      targetId,
      timestamp: Date.now()
    });
  } catch (e) {
    console.log("Error writing engagement telemetry log block: ", e);
  }
}
