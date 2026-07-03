import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";

import { db } from "../lib/firebase";

export interface RecentlyViewedCourse {
  userId: string;
  courseId: string;
  updatedAt?: any;
}

export async function saveRecentlyViewed(
  userId: string,
  courseId: string
) {
  await setDoc(
    doc(
      db,
      "users",
      userId,
      "recentCourses",
      courseId
    ),
    {
      userId,
      courseId,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function getRecentlyViewed(
  userId: string
) {
  const q = query(
    collection(
      db,
      "users",
      userId,
      "recentCourses"
    ),
    orderBy("updatedAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}