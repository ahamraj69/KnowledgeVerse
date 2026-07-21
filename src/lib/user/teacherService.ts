import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";

import { TeacherProfile } from "@/types/teacher";
import { db } from "../firebase";
import { Collections } from "../firebaseCollections";

/**
 * ✅ Step 2: Fetches a target teacher data card from cloud instances [INDEX].
 */
export async function getTeacherProfile(uid: string): Promise<TeacherProfile | null> {
  const ref = doc(db, Collections.TEACHER_PROFILES, uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;
  return snap.data() as TeacherProfile;
}

/**
 * ✅ Step 2: Sets up a fresh teacher record manifest [INDEX].
 */
export async function createTeacherProfile(profile: TeacherProfile): Promise<void> {
  await setDoc(doc(db, Collections.TEACHER_PROFILES, profile.uid), profile);
}

/**
 * ✅ Step 2: Modifies biological attributes or teaching analytics [INDEX].
 */
export async function updateTeacherProfile(uid: string, data: Partial<TeacherProfile>): Promise<void> {
  const ref = doc(db, Collections.TEACHER_PROFILES, uid);
  await updateDoc(ref, {
    ...data,
    updatedAt: Date.now(),
  });
}
