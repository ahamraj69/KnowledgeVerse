import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Collections } from "../firebaseCollections";
import { TeacherPerformanceRow } from "@/types/advancedAnalytics";

export async function fetchTeacherLeaderboard(): Promise<TeacherPerformanceRow[]> {
  const querySnapshot = await getDocs(collection(db, Collections.TEACHER_PROFILES));
  const leaderboard: TeacherPerformanceRow[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      teacherId: doc.id,
      displayName: data.displayName || "Educator Shard",
      coursesCount: data.courses || 0,
      studentsCount: data.students || 0,
      averageRating: data.rating || 0,
      completionRate: data.completionRate || 85,
      certificatesIssued: data.certificates || Math.round((data.students || 0) * 0.12)
    };
  });

  return leaderboard.sort((a, b) => b.studentsCount - a.studentsCount).slice(0, 10);
}
