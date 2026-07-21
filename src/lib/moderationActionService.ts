import { collection, doc, addDoc, getDocs, updateDoc, query, where, orderBy, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";
import { ModerationRecord, ModerationAction } from "@/types/moderation";

/**
 * ✅ Step 4, 5 & 6 FIXED: Commits structural moderation enforcements and user state syncs [INDEX].
 */
export async function executeModerationAction(
  userId: string,
  action: ModerationAction,
  reason: string,
  adminId: string,
  durationDays?: number
): Promise<string> {
  const createdAt = Date.now();
  let expiresAt: number | undefined;

  if (action === "suspension" && durationDays) {
    expiresAt = createdAt + durationDays * 24 * 60 * 60 * 1000;
  }

  const payload: Omit<ModerationRecord, "id"> = {
    userId,
    action,
    reason,
    adminId,
    createdAt,
    ...(expiresAt && { expiresAt })
  };

  // 1. Log enforcement index history trace [INDEX]
  const docRef = await addDoc(collection(db, "moderation"), payload);

  // 2. Adjust user object indicators for state validation locks [INDEX]
  const userRef = doc(db, Collections.USERS, userId);
  const userUpdatePayload: any = {
    updatedAt: Date.now(),
    accountStatus: action === "ban" ? "banned" : action === "suspension" ? "suspended" : "active"
  };
  if (expiresAt) {
    userUpdatePayload.suspensionExpiresAt = expiresAt;
  }
  await updateDoc(userRef, userUpdatePayload);

  // 3. ✅ Step 7 FIXED: Automatic target user alert notification dispatch [INDEX]
  let messageTitle = "⚠️ Account Warning Issued";
  let messageBody = `Your account has received an official warning. Reason: ${reason}`;

  if (action === "suspension") {
    messageTitle = "🚫 Account Suspended";
    messageBody = `Your account has been suspended for ${durationDays} days. Reason: ${reason}`;
  } else if (action === "ban") {
    messageTitle = "🔒 Permanent Ban Implemented";
    messageBody = `Your account has been permanently banned. Reason: ${reason}`;
  }

  await addDoc(collection(db, Collections.NOTIFICATIONS), {
    userId,
    title: messageTitle,
    message: messageBody,
    createdAt: Date.now()
  });

  return docRef.id;
}

/**
 * Extracts a complete list of historical moderation enforcements for a specific target user [INDEX].
 */
export async function getUserModerationHistory(userId: string): Promise<ModerationRecord[]> {
  const q = query(
    collection(db, "moderation"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ModerationRecord));
}

/**
 * ✅ Step 9 FIXED: Gathers multi-collection telemetry indices to determine escalation vectors [INDEX].
 */
export async function assessRepeatOffenderMetrics(userId: string): Promise<{
  warnings: number;
  suspensions: number;
  suggestedAction?: ModerationAction;
}> {
  const history = await getUserModerationHistory(userId);
  const warnings = history.filter(r => r.action === "warning").length;
  const suspensions = history.filter(r => r.action === "suspension").length;

  let suggestedAction: ModerationAction | undefined;
  if (warnings >= 3 && suspensions < 2) {
    suggestedAction = "suspension";
  } else if (suspensions >= 2) {
    suggestedAction = "ban";
  }

  return { warnings, suspensions, suggestedAction };
}
