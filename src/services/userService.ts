import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type UserRole = "student" | "teacher" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const createUserProfile = async (
  uid: string,
  name: string,
  email: string,
  role: UserRole = "student"
) => {
  await setDoc(doc(db, "users", uid), {
    uid,
    name,
    email,
    role,
    photoURL: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid: string) => {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) return null;

  return snapshot.data() as UserProfile;
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};