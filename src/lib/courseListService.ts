import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getCache, setCache } from "./cache"; // ✅ Phase 16 Cache Imports

export interface CourseServiceType {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  status: "draft" | "published";
}

const COURSES_CACHE_KEY = "courses_master_list";

/**
 * Fetches all courses from the master collection layer with caching.
 */
export const getCourses = async (): Promise<CourseServiceType[]> => {
  const cached = getCache<CourseServiceType[]>(COURSES_CACHE_KEY);
  if (cached) return cached;

  const coursesRef = collection(db, "courses");
  const q = query(coursesRef);
  const snapshot = await getDocs(q);

  const courses = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "Untitled Course",
      description: data.description || "No description provided.",
      thumbnail: data.thumbnail || undefined,
      status: data.status || "draft",
    };
  });

  setCache(COURSES_CACHE_KEY, courses);
  return courses;
};

/**
 * Fetches a single specific course document profile by ID with caching.
 */
export const getCourse = async (courseId: string): Promise<CourseServiceType | null> => {
  const cacheKey = `course_single_${courseId}`;
  const cached = getCache<CourseServiceType>(cacheKey);
  if (cached) return cached;

  const docRef = doc(db, "courses", courseId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  const course = {
    id: docSnap.id,
    title: data.title || "Untitled Course",
    description: data.description || "No description provided.",
    thumbnail: data.thumbnail || undefined,
    status: data.status || "draft",
  };

  setCache(cacheKey, course);
  return course;
};
