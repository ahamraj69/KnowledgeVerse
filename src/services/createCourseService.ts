import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

interface CreateCourseData {
  title: string;
  description: string;
  thumbnail: string;
  teacherId: string;
}

/**
 * Commits a brand new course record into the global database instance.
 * Automatically handles default lifecycle status maps and execution epoch timestamps.
 */
export const createCourse = async (courseData: CreateCourseData): Promise<string> => {
  const { title, description, thumbnail, teacherId } = courseData;

  // ✅ Step 2: Added structural status control fields and execution epoch timestamps
  const docRef = await addDoc(collection(db, "courses"), {
    title,
    description,
    thumbnail,
    teacherId,
    status: "draft", // Every course initializes safely in isolation mode
    createdAt: Date.now(),
  });

  return docRef.id;
};
