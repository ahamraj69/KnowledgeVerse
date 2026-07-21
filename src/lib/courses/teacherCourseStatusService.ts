import { Course } from "@/types/course";
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { Collections } from "../firebaseCollections";

/**
 * Fetches all courses published or drafted by a specific instructor [INDEX].
 */
export async function getTeacherCourses(teacherId: string): Promise<Course[]> {
  const q = query(
    collection(db, Collections.COURSES),
    where("teacherId", "==", teacherId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
}

/**
 * ✅ Step 9 FIXED: Resubmits a rejected course structure back to the pending queue [INDEX].
 */
export async function executeCourseResubmission(courseId: string): Promise<void> {
  const ref = doc(db, Collections.COURSES, courseId);
  await updateDoc(ref, {
    status: "pending",
    reviewComment: "",
    submittedAt: Date.now(),
    updatedAt: Date.now()
  });
}
