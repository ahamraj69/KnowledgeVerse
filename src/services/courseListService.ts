import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";

// ✅ Step 3: Upgraded schema tracking configuration layer with strict status limits
export interface CourseServiceType {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: "draft" | "published";
}

/**
 * Fetches all courses from the master collection layer
 */
export const getCourses = async (): Promise<CourseServiceType[]> => {
  const coursesRef = collection(db, "courses");
  const q = query(coursesRef);

  const snapshot = await getDocs(q);

  // ✅ Step 4: Map full document entries with explicit lifecycle parameter fallbacks
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "Untitled Course",
      description: data.description || "No description provided.",
      thumbnail: data.thumbnail || undefined,
      status: data.status || "draft", // Gracefully defaults to draft if missing from historical entries
    };
  });
};
