import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface CourseProgress {
  completedLessons: string[];
  lastLessonId: string;
}

export async function getProgress(
  userId: string,
  courseId: string
): Promise<CourseProgress> {
  const ref = doc(
    db,
    "progress",
    `${userId}_${courseId}`
  );

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return {
      completedLessons: [],
      lastLessonId: "",
    };
  }

  return snap.data() as CourseProgress;
}

export async function completeLesson(
  userId: string,
  courseId: string,
  lessonId: string
) {
  const progress = await getProgress(
    userId,
    courseId
  );

  if (
    !progress.completedLessons.includes(
      lessonId
    )
  ) {
    progress.completedLessons.push(
      lessonId
    );
  }

  progress.lastLessonId = lessonId;

  await setDoc(
    doc(
      db,
      "progress",
      `${userId}_${courseId}`
    ),
    progress
  );
}

export function progressPercent(
  completed: number,
  total: number
) {
  if (total === 0) return 0;

  return Math.round(
    (completed / total) * 100
  );
}