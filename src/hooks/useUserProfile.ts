import { auth } from "@/lib/firebase";
import { createUserProfile, getUserProfile, updateLearningStats } from "@/lib/user/profileService";
import { UserProfile } from "@/types/profile";
import { useCallback, useEffect, useState } from "react";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Synchronize asynchronous cross-reference analytics data parameters first
      await updateLearningStats(currentUser.uid);
      
      let fetched = await getUserProfile(currentUser.uid);
      if (!fetched) {
        fetched = await createUserProfile(
          currentUser.uid, 
          currentUser.email || "", 
          currentUser.displayName || "Student"
        );
      }
      setProfile(fetched);
    } catch (err: any) {
      setError(err?.message || "Profile synchronization failure indices caught.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return {
    profile,
    loading,
    error,
    refreshProfile,
  };
}
