import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  studentName: string;
  courseName: string;
  completedAt: any;
}

export async function generateCertificate(
  userId: string,
  courseId: string,
  studentName: string,
  courseName: string
) {
  const id = `${userId}_${courseId}`;

  await setDoc(
    doc(db, "certificates", id),
    {
      id,
      userId,
      courseId,
      studentName,
      courseName,
      completedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return id;
}

export async function getCertificate(
  userId: string,
  courseId: string
) {
  const id = `${userId}_${courseId}`;

  const snapshot = await getDoc(
    doc(db, "certificates", id)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as Certificate;
}