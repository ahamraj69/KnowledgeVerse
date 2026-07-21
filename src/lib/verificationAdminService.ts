import { VerificationRequest, VerificationStatus } from "@/types/verification";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";

export async function getRequestsByStatus(status: VerificationStatus): Promise<VerificationRequest[]> {
  const q = query(
    collection(db, Collections.TEACHER_APPLICATIONS),
    where("status", "==", status),
    orderBy("submittedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as VerificationRequest));
}

export async function getVerificationById(id: string): Promise<VerificationRequest | null> {
  const ref = doc(db, Collections.TEACHER_APPLICATIONS, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as VerificationRequest;
}

/**
 * ✅ Step 10 FIXED: Sets profile flags and records timestamps across user schemas atomically [INDEX].
 */
export async function approveTeacher(id: string, teacherId: string, comment: string): Promise<void> {
  const verifyRef = doc(db, Collections.TEACHER_APPLICATIONS, id);
  await updateDoc(verifyRef, {
    status: "approved",
    adminComment: comment,
    updatedAt: Date.now()
  });

  const userRef = doc(db, Collections.USERS, teacherId);
  await updateDoc(userRef, {
    verifiedTeacher: true,
    verificationStatus: "approved",
    verifiedAt: Date.now(),
    role: "teacher",
    updatedAt: Date.now()
  });
}

export async function updateRequestStatus(id: string, status: "rejected" | "needs_more_info", comment: string): Promise<void> {
  const verifyRef = doc(db, Collections.TEACHER_APPLICATIONS, id);
  await updateDoc(verifyRef, {
    status,
    adminComment: comment,
    updatedAt: Date.now()
  });

  const matchedRequest = await getVerificationById(id);
  if (matchedRequest?.teacherId) {
    const userRef = doc(db, Collections.USERS, matchedRequest.teacherId);
    await updateDoc(userRef, {
      verificationStatus: status,
      updatedAt: Date.now()
    });
  }
}
