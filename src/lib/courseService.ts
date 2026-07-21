import {
    addDoc,
    collection, // ✅ FIXED: Added missing Firestore update operation module
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc
} from "firebase/firestore";

import { Course } from "@/types/course";
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";

export type { Course } from "@/types/course";

export async function getCourses(): Promise<Course[]> {
  const q = query(collection(db, Collections.COURSES), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Course, "id">),
  }));
}

export async function getCourse(id: string): Promise<Course | null> {
  const docRef = doc(db, Collections.COURSES, id);
  const snap = await getDoc(docRef);

  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Course;
}

export async function createCourse(courseData: Omit<Course, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, Collections.COURSES), {
    ...courseData,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

// ✅ FIXED:Mpped the updateCourse signature function directly as expected by your teacher screens [INDEX]
export async function updateCourse(id: string, updates: Partial<Course>): Promise<void> {
  const docRef = doc(db, Collections.COURSES, id);
  await updateDoc(docRef, updates);
}

export async function deleteCourse(id: string): Promise<void> {
  const docRef = doc(db, Collections.COURSES, id);
  await deleteDoc(docRef);
}

export function subscribeCourses(callback: (courses: Course[]) => void): () => void {
  const q = query(collection(db, Collections.COURSES), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Course, "id">),
    }));
    callback(courses);
  });
}
