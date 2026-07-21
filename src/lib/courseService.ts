import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from "./firebase";
import { Course } from "@/types/course";
import { Collections } from "./firebaseCollections";

export type { Course } from "@/types/course";

/**
 * ✅ Step 1 & 4 FIXED: Queries and filters ONLY approved live curriculum tracks [INDEX].
 */
export async function getCourses(): Promise<Course[]> {
  const q = query(
    collection(db, Collections.COURSES),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );
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

export async function createCourse(courseData: Omit<Course, "id" | "createdAt" | "status">): Promise<string> {
  const ref = await addDoc(collection(db, Collections.COURSES), {
    ...courseData,
    status: "draft", // Defaults fresh initializations directly to local draft states
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  return ref.id;
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<void> {
  const docRef = doc(db, Collections.COURSES, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Date.now()
  });
}

export async function deleteCourse(id: string): Promise<void> {
  const docRef = doc(db, Collections.COURSES, id);
  await deleteDoc(docRef);
}

/**
 * ✅ Step 1 & 4 FIXED: Provides real-time websocket synchronization streams over approved nodes [INDEX].
 */
export function subscribeCourses(callback: (courses: Course[]) => void): () => void {
  const q = query(
    collection(db, Collections.COURSES),
    where("status", "==", "approved"),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Course, "id">),
    }));
    callback(courses);
  });
}

/**
 * ✅ Step 5 FIXED: Evaluates if a given approved timestamp index drops within a 7-day offset block [INDEX].
 */
export function isRecentlyApproved(approvedAtTimestamp?: number): boolean {
  if (!approvedAtTimestamp) return false;
  const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - approvedAtTimestamp <= sevenDaysInMilliseconds;
}
