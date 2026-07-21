import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export interface Enrollment {
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  enrolledAt: number;
}

/**
 * Creates a unique cross-reference enrollment log document inside Firestore [INDEX].
 */
export async function enrollCourse(
  userId: string,
  courseId: string
): Promise<void> {
  await setDoc(
    doc(db, "enrollments", `${userId}_${courseId}`),
    {
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      enrolledAt: Date.now(),
    }
  );
}

/**
 * Validates whether the specified user profile is actively enrolled in a target course [INDEX].
 */
export async function isEnrolled(
  userId: string,
  courseId: string
): Promise<boolean> {
  const snap = await getDoc(
    doc(db, "enrollments", `${userId}_${courseId}`)
  );
  return snap.exists();
}
