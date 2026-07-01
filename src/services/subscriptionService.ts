import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

/**
 * FIX: Use composite ID (important for access control)
 */
export const subscribeToCourse = async (courseId: string) => {
  const user = auth.currentUser;

  if (!user) throw new Error("Not logged in");

  return await setDoc(doc(db, "subscriptions", user.uid + "_" + courseId), {
    studentId: user.uid,
    courseId,
    status: "active",
    createdAt: new Date(),
  });
};