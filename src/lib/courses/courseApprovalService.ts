import { Course } from "@/types/course";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Collections } from "../firebaseCollections";

/**
 * Validates course draft requirements before letting the teacher submit it [INDEX].
 */
export async function validateCourseDraft(courseId: string): Promise<{ valid: boolean; reason?: string }> {
  const courseRef = doc(db, Collections.COURSES, courseId);
  const courseSnap = await getDoc(courseRef);
  
  if (!courseSnap.exists()) {
    return { valid: false, reason: "Course profile document not found." };
  }
  
  const data = courseSnap.data() as Course;
  if (!data.title?.trim()) return { valid: false, reason: "Course Title cannot remain blank." };
  if (!data.description?.trim()) return { valid: false, reason: "Description text summary is missing." };
  if (!data.category?.trim()) return { valid: false, reason: "Category configuration field is required." };
  if (!data.thumbnail?.trim()) return { valid: false, reason: "Course cover thumbnail asset is missing." };

  // Verify that the curriculum actually contains published lessons
  const lessonsSnap = await getDocs(collection(db, Collections.COURSES, courseId, Collections.LESSONS));
  if (lessonsSnap.empty || lessonsSnap.size < 1) {
    return { valid: false, reason: "Syllabus must contain at least 1 published lesson module." };
  }

  return { valid: true };
}

/**
 * ✅ Step 6 FIXED: Submits a course draft to the global admin evaluation queue [INDEX].
 */
export async function submitCourseForReview(courseId: string): Promise<void> {
  const courseRef = doc(db, Collections.COURSES, courseId);
  await updateDoc(courseRef, {
    status: "pending",
    submittedAt: Date.now(),
    updatedAt: Date.now()
  });
}
