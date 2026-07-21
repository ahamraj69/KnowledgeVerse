import { collection, getDocs, doc, setDoc, query, where, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getCache, setCache, clearCache } from "./cache";

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate?: string;
  totalPoints?: number;
}

const getAssignmentsCacheKey = (courseId: string) => `assignments_course_${courseId}`;

export const getAssignmentsByCourse = async (courseId: string): Promise<Assignment[]> => {
  const cacheKey = getAssignmentsCacheKey(courseId);
  const cached = getCache<Assignment[]>(cacheKey);
  if (cached) return cached;

  const snapshot = await getDocs(query(collection(db, "assignments"), where("courseId", "==", courseId)));
  const assignments = snapshot.docs.map((docItem) => ({
    id: docItem.id,
    courseId: docItem.data().courseId,
    title: docItem.data().title || "Untitled Assignment",
    description: docItem.data().description || "No description provided.",
  }));

  setCache(cacheKey, assignments);
  return assignments;
};

// ✅ ADDED ALIAS EXPORTS FOR SCREEN COMPATIBILITY
export const getAssignments = getAssignmentsByCourse;

export const submitAssignment = async (userId: string, data: any): Promise<void> => {
  await addDoc(collection(db, "submissions"), {
    userId,
    ...data,
    submittedAt: Date.now()
  });
};
