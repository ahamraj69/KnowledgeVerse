import { collection, getDocs, query, where } from "firebase/firestore"; // Assuming standard Firestore imports
import { getCache, setCache } from "./cache";
import { db } from "./firebaseConfig"; // Update path matching your project initialization setup

/**
 * Fetches course assignments with a standard 1-minute caching performance layer.
 */
export const getAssignments = async (courseId: string) => {
  const cacheKey = `assignments_${courseId}`;

  // Check the caching layer first
  const cached = getCache(cacheKey);
  if (cached) return cached;

  // Fallback to network or Firestore database server if cache missed/expired
  const q = query(
    collection(db, "assignments"),
    where("courseId", "==", courseId)
  );

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Save records to cache for subsequent execution requests
  setCache(cacheKey, data);

  return data;
};
