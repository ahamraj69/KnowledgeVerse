import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";

import { db } from "./firebase";
// ✅ Step 2: Imported the global shared progress type model directly
import { UserProgress } from "@/types/progress";

/**
 * Atomic tracking write commits calculation metrics cleanly to Firestore.
 */
export async function updateCourseProgress(
  userId: string,
  courseId: string,
  currentLessonId: string,
  completedLessons: string[],
  totalLessons: number
): Promise<void> {
  const total = totalLessons > 0 ? totalLessons : 1;
  const progressPercent = Math.round((completedLessons.length / total) * 100);

  await setDoc(
    doc(db, "userProgress", `${userId}_${courseId}`),
    {
      userId,
      courseId,
      currentLessonId,
      completedLessons,
      progress: progressPercent,
      updatedAt: Date.now(),
    }
  );
}

/**
 * Extracts student progression metadata snapshots based on key document lookups.
 */
export async function getCourseProgress(
  userId: string,
  courseId: string
): Promise<any> {
  const snap = await getDoc(
    doc(db, "userProgress", `${userId}_${courseId}`)
  );

  if (!snap.exists()) return null;
  return snap.data();
}

/**
 * ✅ Step 2: Main baseline progress function mapped precisely as requested
 */
export async function getUserProgress(
  userId: string
): Promise<UserProgress | null> {
  const snap = await getDoc(
    doc(db, "userProgress", userId)
  );

  if (!snap.exists()) return null;

  return snap.data() as UserProgress;
}
