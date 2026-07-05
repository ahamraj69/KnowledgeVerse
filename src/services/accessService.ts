import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase"; // ✅ FIX: Points to src/lib/firebase

export const hasAccess = async (courseId: string) => {
  const user = auth.currentUser;
  if (!user) return false;

  const snap = await getDoc(doc(db, "subscriptions", user.uid + "_" + courseId));

  return snap.exists();
};
