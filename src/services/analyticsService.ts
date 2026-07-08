import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getCache, setCache } from "./cache";

export interface UserAnalytics {
  totalDownloads: number;
  totalAssignments: number;
  quizAttempts: number;
  averageScore: number;
  totalQuizScore: number;
}

export const getUserAnalytics = async (userId: string): Promise<UserAnalytics> => {
  const cacheKey = `analytics_${userId}`;
  const cached = getCache<UserAnalytics>(cacheKey);
  if (cached) return cached;

  const docRef = doc(db, "analytics", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const defaultData = { totalDownloads: 0, totalAssignments: 0, quizAttempts: 0, averageScore: 0, totalQuizScore: 0 };
    setCache(cacheKey, defaultData);
    return defaultData;
  }

  const data = docSnap.data();
  const result: UserAnalytics = {
    totalDownloads: data.totalDownloads || 0,
    totalAssignments: data.totalAssignments || 0,
    quizAttempts: data.quizAttempts || 0,
    averageScore: data.averageScore || 0,
    totalQuizScore: data.totalQuizScore || 0,
  };

  setCache(cacheKey, result);
  return result;
};
