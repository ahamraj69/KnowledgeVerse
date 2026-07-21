import { getLessons } from "@/lib/lessonService";
import { Lesson } from "@/types/lesson";
import { useEffect, useState } from "react";

/**
 * ✅ Step 6: Fetches lessons arrays on demand when course targets shift context safely [INDEX].
 */
export function useLessons(courseId: string) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadSyllabusLessons() {
      try {
        setLoading(true);
        const data = await getLessons(courseId);
        setLessons(data);
      } catch (e) {
        console.log("Error inside custom useLessons hydration pipeline loop:", e);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) {
      loadSyllabusLessons();
    }
  }, [courseId]);

  return {
    lessons,
    loading,
  };
}
