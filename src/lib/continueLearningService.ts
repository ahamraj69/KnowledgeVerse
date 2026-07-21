import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase"; // ✅ FIX: Points to src/lib/firebase

export interface ContinueLearning {
  userId: string;
  courseId: string;
  lessonId: string;
  updatedAt?: any;
}

export async function saveContinueLearning(
  userId: string,
  courseId: string,
  lessonId: string
) {
  await setDoc(
    doc(
      db,
      "continueLearning",
      `${userId}_${courseId}`
    ),
    {
      userId,
      courseId,
      lessonId,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function getContinueLearning(
  userId: string,
  courseId: string
) {
  const snap = await getDoc(
    doc(
      db,
      "continueLearning",
      `${userId}_${courseId}`
    )
  );

  if (!snap.exists()) {
    return null;
  }

  return snap.data() as ContinueLearning;
}
