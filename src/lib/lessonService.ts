import {
    addDoc // ✅ FIXED: Added missing Firestore write operation module
    ,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query
} from "firebase/firestore";

import { Lesson } from "@/types/lesson";
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";

// ✅ FIXED: Exporting addLesson matching our centralized structure [INDEX]
export async function addLesson(courseId: string, lessonData: Omit<Lesson, "id">): Promise<string> {
  const ref = await addDoc(collection(db, Collections.COURSES, courseId, Collections.LESSONS), lessonData);
  return ref.id;
}

export async function getLessons(courseId: string): Promise<Lesson[]> {
  const q = query(
    collection(db, Collections.COURSES, courseId, Collections.LESSONS),
    orderBy("order", "asc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Lesson, "id">),
  }));
}

export async function getLesson(courseId: string, lessonId: string): Promise<Lesson | null> {
  const docRef = doc(db, Collections.COURSES, courseId, Collections.LESSONS, lessonId);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Lesson;
}

export function subscribeLessons(
  courseId: string,
  callback: (lessons: Lesson[]) => void
): () => void {
  const q = query(
    collection(db, Collections.COURSES, courseId, Collections.LESSONS),
    orderBy("order", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const lessons = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Lesson, "id">),
    }));
    callback(lessons);
  });
}
