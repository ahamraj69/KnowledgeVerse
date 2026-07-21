import { submitCourseForReview, validateCourseDraft } from "@/lib/courses/courseApprovalService";
import { db } from "@/lib/firebase";
import { Collections } from "@/lib/firebaseCollections";
import { Course } from "@/types/course";
import { doc, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

export function useCourseApproval(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(doc(db, Collections.COURSES, courseId), (snap) => {
      if (snap.exists()) {
        setCourse({ id: snap.id, ...snap.data() } as Course);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [courseId]);

  const handleReviewSubmission = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    if (!courseId) return { success: false, error: "Missing required identifier context." };
    
    try {
      setSubmitting(true);
      const validation = await validateCourseDraft(courseId);
      
      if (!validation.valid) {
        return { success: false, error: validation.reason };
      }

      await submitCourseForReview(courseId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Workflow transaction failed." };
    } finally {
      setSubmitting(false);
    }
  }, [courseId]);

  return {
    course,
    loading,
    submitting,
    submitForReview: handleReviewSubmission
  };
}
