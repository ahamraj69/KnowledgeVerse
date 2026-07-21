import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ApprovalCommentBox from "@/components/courseApproval/ApprovalCommentBox";
import { approveCourse, rejectCourse } from "@/lib/courses/courseReviewService";
import { auth, db } from "@/lib/firebase";
import { Collections } from "@/lib/firebaseCollections";
import { Theme } from "@/theme/theme";
import { Course } from "@/types/course";
import { Lesson } from "@/types/lesson";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminCourseReviewDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const courseSnap = await getDoc(doc(db, Collections.COURSES, id));
        if (courseSnap.exists()) {
          setCourse({ id: courseSnap.id, ...courseSnap.data() } as Course);
        }

        // ✅ Step 5: Pull sub-collection lesson nodes for thorough inspection prior to approval [INDEX]
        const lessonsQuery = query(collection(db, Collections.COURSES, id, Collections.LESSONS), orderBy("order", "asc"));
        const lessonsSnap = await getDocs(lessonsQuery);
        setLessons(lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() } as Lesson)));
      } catch (e) {
        console.log("Error loading full verification bundle:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleDecision = useCallback(async (action: "approve" | "reject") => {
    if (!course || !id) return;
    const adminUid = auth.currentUser?.uid || "admin_node";

    try {
      setProcessing(true);
      if (action === "approve") {
        await approveCourse(id, adminUid);
        Alert.alert("Course Approved 🟩", "The curriculum is now activated and live across student index layers.");
      } else {
        if (!comment.trim()) {
          Alert.alert("Missing Feedback", "Please write a concise review comment outlining the necessary correction parameters.");
          setProcessing(false);
          return;
        }
        await rejectCourse(id, adminUid, comment.trim());
        Alert.alert("Submission Rejected 🟥", "Draft returned to the instructor paired with revision feedback guidelines.");
      }
      router.back();
    } catch (err) {
      Alert.alert("Operation Aborted", "Could not commit state changes to remote datasets.");
    } finally {
      setProcessing(false);
    }
  }, [course, id, comment, router]);

  if (loading || !course) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Inspect Curriculum Package</Text>
          <Text style={styles.subtitle}>Subject Category Focus: {course.category}</Text>

          <View style={styles.sheet}>
            <Text style={styles.label}>COURSE HEADING TITLE</Text>
            <Text style={styles.val}>{course.title}</Text>

            <Text style={styles.label}>CURRICULUM ABSTRACT OBJECTIVES</Text>
            <Text style={styles.desc}>{course.description}</Text>
          </View>

          {/* ✅ Step 5: Iterative Sub-collection Syllabus Lesson Node Preview Modules */}
          <Text style={styles.sectionHeading}>📖 Syllabus Lessons Content ({lessons.length})</Text>
          {lessons.map((lesson) => (
            <View key={lesson.id} style={styles.lessonRowCard}>
              <Text style={styles.lessonTitleText}>🔹 Module {lesson.order}: {lesson.title}</Text>
              <Text style={styles.lessonMetaText}>Type Parameters: {lesson.type.toUpperCase()} • Duration: {lesson.duration}</Text>
            </View>
          ))}

          {/* Comment input remark fields */}
          <ApprovalCommentBox value={comment} onChange={setComment} />

          {/* Interactive Button Toggles Layout */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.btn, styles.appBtn]} onPress={() => handleDecision("approve")} disabled={processing}>
              <Text style={styles.btnText}>Approve & Publish</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.rejBtn]} onPress={() => handleDecision("reject")} disabled={processing}>
              <Text style={styles.btnText}>Reject Package</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 50 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#6B7280", fontSize: 13, marginTop: 4, marginBottom: 20 },
  sheet: { backgroundColor: "#111827", padding: 16, borderRadius: 14, gap: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  label: { color: "#6B7280", fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  val: { color: "white", fontSize: 17, fontWeight: "bold" },
  desc: { color: "#CBD5E1", fontSize: 14, lineHeight: 22 },
  sectionHeading: { color: "white", fontSize: 15, fontWeight: "700", marginTop: 24, marginBottom: 12 },
  lessonRowCard: { backgroundColor: "#1F2937", padding: 12, borderRadius: 10, marginBottom: 8 },
  lessonTitleText: { color: "white", fontSize: 14, fontWeight: "600" },
  lessonMetaText: { color: "#9CA3AF", fontSize: 12, marginTop: 4 },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  appBtn: { backgroundColor: "#10B981" },
  rejBtn: { backgroundColor: "#EF4444" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 14 }
});
