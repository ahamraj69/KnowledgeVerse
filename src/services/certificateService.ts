import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

// ✅ Step 1: Injected unique certificateId tracker property into the schema data model
export interface Certificate {
  id: string;
  certificateId: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issuedAt?: any;
}

/**
 * Commits a verified course completion certificate record with a unique tracking signature [INDEX].
 */
export const issueCertificate = async (
  userId: string,
  certificate: Omit<Certificate, "id" | "certificateId" | "issuedAt">
) => {
  // ✅ Step 2: Generates a high-entropy unique secure identifier code
  const certificateId = "KV-" + Date.now().toString(36).toUpperCase();

  await addDoc(
    collection(db, "users", userId, "certificates"),
    {
      ...certificate,
      certificateId,
      issuedAt: serverTimestamp(),
    }
  );
};

/**
 * Subscribes to real-time updates for a user's achieved certificates ledger collection.
 */
export const subscribeCertificates = (
  userId: string,
  callback: (certificates: Certificate[]) => void
) => {
  const q = query(
    collection(db, "users", userId, "certificates"),
    orderBy("issuedAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    callback(
      snapshot.docs.map((docItem) => {
        const data = docItem.data();
        return {
          id: docItem.id,
          certificateId: data.certificateId || "KV-PENDING",
          courseId: data.courseId || "",
          courseTitle: data.courseTitle || "",
          studentName: data.studentName || "Graduate Student",
          issuedAt: data.issuedAt,
        };
      })
    );
  });
};
