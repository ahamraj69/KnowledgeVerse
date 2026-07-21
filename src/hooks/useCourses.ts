import { subscribeCourses } from "@/lib/courseService";
import { Course } from "@/types/course";
import { useEffect, useState } from "react";

/**
 * ✅ Step 5: High-performance real-time course hydration state observer hook [INDEX].
 */
export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeCourses((data) => {
      setCourses(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return {
    courses,
    loading,
  };
}
