import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";

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

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "Untitled Course",
      description: data.description || "No description provided.",
      thumbnail: data.thumbnail || undefined,
      status: data.status || "draft",
    };
  });
};

/**
 * ✅ FETCHES A SINGLE COURSE: Targets an explicit course document profile by ID
 */
export const getCourse = async (courseId: string): Promise<CourseServiceType | null> => {
  const docRef = doc(db, "courses", courseId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title || "Untitled Course",
    description: data.description || "No description provided.",
    thumbnail: data.thumbnail || undefined,
    status: data.status || "draft",
  };
};
