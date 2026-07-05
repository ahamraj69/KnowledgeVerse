import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase"; // ✅ FIX: Points to src/lib/firebase
import { getCache, setCache } from "./cache";

export const getAssignments = async (courseId: string) => {
  const cacheKey = `assignments_${courseId}`;

  const cached = getCache(cacheKey);
  if (cached) return cached;

  const q = query(
    collection(db, "assignments"),
    where("courseId", "==", courseId)
  );

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setCache(cacheKey, data);

  return data;
};
