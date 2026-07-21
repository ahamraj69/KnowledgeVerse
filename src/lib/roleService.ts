import { db } from "@/lib/firebase";
import { Collections } from "@/lib/firebaseCollections";
import { UserRole } from "@/types/role";
import { doc, getDoc, updateDoc } from "firebase/firestore";

/**
 * Retrieves the authorization level assigned to the specified user document [INDEX].
 */
export async function getUserRole(uid: string): Promise<UserRole> {
  const snap = await getDoc(doc(db, Collections.USERS, uid));

  if (!snap.exists()) {
    return "student";
  }

  return (snap.data().role as UserRole) ?? "student";
}

/**
 * Commits a structural authorization level change down to the user directory [INDEX].
 */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, Collections.USERS, uid), {
    role,
    updatedAt: Date.now(),
  });
}
