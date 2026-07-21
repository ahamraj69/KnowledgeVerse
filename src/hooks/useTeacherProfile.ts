import { getTeacherProfile } from "@/lib/user/teacherService";
import { TeacherProfile } from "@/types/teacher";
import { useCallback, useEffect, useState } from "react";

/**
 * ✅ Step 3: Handles background educator updates dynamically [INDEX].
 */
export default function useTeacherProfile(uid: string) {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadTeacherData = useCallback(async () => {
    if (!uid) return;
    try {
      setLoading(true);
      const data = await getTeacherProfile(uid);
      setTeacher(data);
    } catch (e) {
      console.log("Error loading teacher profile metrics:", e);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadTeacherData();
  }, [loadTeacherData]);

  return {
    teacher,
    loading,
    refresh: loadTeacherData,
  };
}
