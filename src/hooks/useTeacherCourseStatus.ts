import { getTeacherCourses } from "@/lib/courses/teacherCourseStatusService";
import { auth } from "@/lib/firebase";
import { Course } from "@/types/course";
import { useCallback, useEffect, useState } from "react";

export function useTeacherCourseStatus() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = auth.currentUser?.uid || "";

  const loadStatusPortalData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getTeacherCourses(userId);
      setCourses(data);
    } catch (e) {
      console.log("Error hydrating teacher course status tracking list: ", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadStatusPortalData();
  }, [loadStatusPortalData]);

  return {
    courses,
    loading,
    refresh: loadStatusPortalData
  };
}
