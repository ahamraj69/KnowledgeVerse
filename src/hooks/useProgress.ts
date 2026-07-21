import { auth } from "@/lib/firebase";
import { getUserProgress } from "@/lib/progressService";
import { useCallback, useEffect, useState } from "react";
// ✅ Step 3: Imported the centralized global shared progress type model
import { UserProgress } from "@/types/progress";

/**
 * Custom Hook: Bridges active user authentication context data cleanly 
 * over to the expanded userProgress collection metrics.
 */
export function useProgress() {
  // ✅ Step 3: Switched state layout signature to use the shared type contract explicitly
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadProgressData = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setProgress(null);
        return;
      }

      const data = await getUserProgress(currentUser.uid);
      setProgress(data);
    } catch (e) {
      console.log("Progress service telemetry load exception:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  return {
    progress,
    loading,
    refresh: loadProgressData,
  };
}
