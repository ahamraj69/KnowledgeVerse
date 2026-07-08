import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { clearCache, getCache, setCache } from "./cache";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const cacheKey = `profile_${userId}`;
  const cached = getCache<UserProfile>(cacheKey);
  if (cached) return cached;

  const docSnap = await getDoc(doc(db, "users", userId));
  if (!docSnap.exists()) return null;

  const profile = docSnap.data() as UserProfile;
  setCache(cacheKey, profile);
  return profile;
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
  await updateDoc(doc(db, "users", userId), data);
  clearCache(`profile_${userId}`);
};
