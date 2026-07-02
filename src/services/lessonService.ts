import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface Lesson {
  id?: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl: string;
  createdAt?: any;
}

export async function createLesson(
  lesson: Lesson
) {
  await addDoc(
    collection(db, "lessons"),
    {
      courseId: lesson.courseId,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl,
      pdfUrl: lesson.pdfUrl,
      createdAt: serverTimestamp(),
    }
  );
}

export async function getLessons(
  courseId: string
) {
  const q = query(
    collection(db, "lessons"),
    where("courseId", "==", courseId),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Lesson),
  }));
}