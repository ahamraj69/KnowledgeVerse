import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc, // ✅ Step 1: Added firestore modification module
} from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";

import { auth, db } from "@/lib/firebase";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  role: string;
  createdAt?: any;
  lastLogin?: any;
  streak?: number;
  progress?: number;
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Wrapped inside useCallback to eliminate re-mounting latency issues across layouts
  const loadProfile = useCallback(async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", currentUser.uid);
      const snapshot = await getDoc(userRef);

      // ✅ Step 2: Records login telemetry timestamps and hydrates application state smoothly
      if (snapshot.exists()) {
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
        });

        const updated = await getDoc(userRef);
        setProfile(updated.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          uid: currentUser.uid,
          name: currentUser.displayName || "Student",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
          role: "student",
          streak: 0,
          progress: 0,
        };

        await setDoc(userRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });

        setProfile(newProfile);
      }
    } catch (error) {
      console.log("Profile data mapping hydration exception caught:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    reload: loadProfile,
  };
}
