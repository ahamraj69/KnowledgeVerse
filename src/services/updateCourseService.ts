import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Updates a course document in Firestore with new metadata configurations.
 * 
 * @returns {Promise<boolean>} Resolves to true after a successful database synchronization.
 */
export async function updateCourse(
  courseId: string,
  title: string,
  description: string,
  price: number,
  thumbnail: string
): Promise<boolean> {
  const docRef = doc(db, "courses", courseId);

  await updateDoc(docRef, {
    title,
    description,
    price,
    thumbnail,
    updatedAt: serverTimestamp(),
  });

  return true;
}
