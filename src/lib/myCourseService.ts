import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";

export const getMyCourses = async () => {
  const user = auth.currentUser;

  if (!user) return [];

  const q = query(
    collection(db, "courses"),
    where("teacherId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};