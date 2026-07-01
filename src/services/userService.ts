import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";

// 👤 Create user profile in Firestore
export const createUserProfile = async (role: "student" | "teacher") => {
  const user = auth.currentUser;
  if (!user) return;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    role,
    plan: "free",
    createdAt: Timestamp.now(),
  });
};

// 📥 Get user profile
export const getUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const snap = await getDoc(doc(db, "users", user.uid));

  return snap.exists() ? snap.data() : null;
};