import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  // ✅ Part 4 Added: Course metric trackers
  enrolledCourses?: number;
  completedCourses?: number;
  joinedAt?: any;
}

export async function getStudents(): Promise<Student[]> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "student")
  );

  const snapshot = await getDocs(q);

  // ✅ Part 4 Added: Enhanced data transformation mapping with safe fallbacks
  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name || "Unknown Student",
      email: data.email || "No Email",
      role: data.role || "student",
      enrolledCourses: data.enrolledCourses || 0,
      completedCourses: data.completedCourses || 0,
      joinedAt: data.joinedAt || null,
    };
  });
}
