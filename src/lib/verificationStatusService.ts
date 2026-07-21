import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
// ✅ FIXED: Corrected local imports to point perfectly within the same folder space
import { VerificationRequest, VerificationStatus } from "@/types/verification";
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";

/**
 * Extracts a teacher's verification request.
 */
export async function fetchVerificationStatus(teacherId: string): Promise<VerificationRequest | null> {
  const requestId = `${teacherId}_verify`;
  const ref = doc(db, Collections.TEACHER_APPLICATIONS, requestId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as VerificationRequest;
}

/**
 * Resubmits verification, resetting status to pending and clearing comments.
 */
export async function executeResubmission(
  requestId: string,
  updates: Partial<Omit<VerificationRequest, "id" | "teacherId" | "submittedAt">>
): Promise<void> {
  const ref = doc(db, Collections.TEACHER_APPLICATIONS, requestId);
  await updateDoc(ref, {
    ...updates,
    status: "pending" as VerificationStatus,
    adminComment: "",
    updatedAt: Date.now()
  });
}

/**
 * Pulls the historical list of verification logs.
 */
export async function fetchVerificationHistory(teacherId: string): Promise<any[]> {
  const q = query(
    collection(db, Collections.TEACHER_APPLICATIONS),
    where("teacherId", "==", teacherId),
    orderBy("updatedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
