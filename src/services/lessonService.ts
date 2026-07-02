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
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl: string;
}

export const createLesson = async (
  lesson: Lesson
) => {
  await addDoc(collection(db, "lessons"), {
    ...lesson,
    createdAt: serverTimestamp(),
  });
};

export const getLessons = async (
  courseId: string
) => {
  const q = query(
    collection(db, "lessons"),
    where("courseId", "==", courseId),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};