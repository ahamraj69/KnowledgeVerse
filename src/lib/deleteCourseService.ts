import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { db } from "../lib/firebase";

/**
 * Cascade-deletes a course document along with all its nested lesson documents.
 * 
 * @param courseId The unique identifier of the target course collection document.
 */
export const deleteCourse = async (
  courseId: string
): Promise<void> => {
  // ✅ Step 1: Scan and delete all lessons nested under this course first
  const lessonsRef = collection(
    db,
    "courses",
    courseId,
    "lessons"
  );

  const lessonSnapshot = await getDocs(
    lessonsRef
  );

  // Execute chunked lesson document deletions concurrently
  await Promise.all(
    lessonSnapshot.docs.map((lesson) =>
      deleteDoc(lesson.ref)
    )
  );

  // ✅ Step 1: Delete the parent course document node safely
  await deleteDoc(
    doc(db, "courses", courseId)
  );
};
