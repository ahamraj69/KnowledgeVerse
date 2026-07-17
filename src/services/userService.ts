import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  bio?: string;
  role: "student" | "teacher" | "admin";
}

/**
 * Commits or patches a user profile document inside the centralized users Firestore index [INDEX].
 */
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  await setDoc(doc(db, "users", profile.uid), profile, { merge: true });
};

/**
 * Extracts explicit user metadata information safely out of the cloud datastore rows [INDEX].
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) return null;

  return snap.data() as UserProfile;
};

/**
 * ✅ Step 1: Submits asynchronous partial document state object modifications natively
 */
export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  await setDoc(doc(db, "users", uid), data, { merge: true });
};
