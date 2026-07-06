import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Updates a course document's lifecycle status flag to published inside Firestore.
 * 
 * @param courseId The unique identifier of the target course collection document.
 */
export const publishCourse = async (
  courseId: string
): Promise<void> => {
  await updateDoc(doc(db, "courses", courseId), {
    status: "published",
  });
};
