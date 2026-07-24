import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { Collections } from "../firebaseCollections";
import { AdvancedCourseMetricRow } from "@/types/advancedAnalytics";

export async function fetchPopularCoursesMetrics(): Promise<AdvancedCourseMetricRow[]> {
  const querySnapshot = await getDocs(collection(db, Collections.COURSES));
  const courses: AdvancedCourseMetricRow[] = querySnapshot.docs.map(doc => {
    const data = doc.data();
    const enrollments = data.students || 0;
    const completions = Math.round(enrollments * (parseFloat(data.completionRate || "75") / 100));
    return {
      courseId: doc.id,
      title: data.title || "Curriculum Unit",
      category: data.category || "General",
      enrollments,
      completions,
      completionRate: data.completionRate || 75,
      averageProgress: data.averageProgress || 68,
      trend: enrollments > 50 ? "trending" : "stable"
    };
  });

  return courses.sort((a, b) => b.enrollments - a.enrollments).slice(0, 10);
}
