import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Collections } from "@/lib/firebaseCollections";
import { executeCourseResubmission } from "@/lib/courses/teacherCourseStatusService";
import CourseReviewTimeline from "@/components/courseApproval/CourseReviewTimeline";
import ReviewCommentCard from "@/components/courseApproval/ReviewCommentCard";
import ResubmitCourseButton from "@/components/courseApproval/ResubmitCourseButton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Course } from "@/types/course";
import { Theme } from "@/theme/theme";

export default function CourseStatusDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const syncTargetStatus = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const snap = await getDoc(doc(db, Collections.COURSES, id));
      if (snap.exists()) {
        setCourse({ id: snap.id, ...snap.data() } as Course);
      }
    } catch (e) {
      console.log("Error fetching target status parameter maps:", e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    syncTargetStatus();
  }, [syncTargetStatus]);

  const handleResubmitAction = useCallback(async () => {
    if (!id) return;
    try {
      setProcessing(true);
      // ✅ Step 8 & 9 FIXED: Advances status transaction fields seamlessly using the core service layer [INDEX]
      await executeCourseResubmission(id);
      Alert.alert("Success 🎉", "Course re-submitted successfully to the review queue.");
      router.replace("/teacher/course-status" as any);
    } catch (err) {
      Alert.alert("Error", "Could not complete resubmission execution loop.");
    } finally {
      setProcessing(false);
    }
  }, [id, router]);

  if (loading || !course) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  const allowResubmit = course.status === "rejected";

  return (
    <ProtectedRoute allow={["teacher", "admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>◀ Back to Status Portal</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.categoryBadge}>📖 Category Track: {course.category}</Text>

          {/* Render Timeline & Remarks Components */}
          <CourseReviewTimeline status={course.status} />
          <ReviewCommentCard comment={course.reviewComment} />

          {/* ✅ Step 7 & 8: Conditional Resubmit Button Rendering Activation */}
          {allowResubmit && (
            <ResubmitCourseButton onPress={handleResubmitAction} />
          )}

        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.05)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginBottom: 16, marginTop: 10 },
  backBtnText: { color: "#38BDF8", fontSize: 13, fontWeight: "600" },
  title: { color: "white", fontSize: 22, fontWeight: "bold" },
  categoryBadge: { color: "#6B7280", fontSize: 13, fontWeight: "600", marginTop: 4, textTransform: "uppercase" }
});
