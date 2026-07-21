import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { db } from "../../../lib/firebase";
import { completeLesson } from "../../../lib/lessonProgress";
import { Lesson } from "../../../types/lesson";

export default function PdfLessonScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentUserId = "mock_user_101";

  useEffect(() => {
    async function fetchLessonData() {
      try {
        const docRef = doc(db, "lessons", String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLesson({ id: docSnap.id, ...docSnap.data() } as Lesson);
        }
      } catch (error) {
        console.error("Error accessing database engine snapshot: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLessonData();
  }, [id]);

  async function handleMarkComplete() {
    if (!lesson) return;
    setSubmitting(true);
    try {
      await completeLesson(currentUserId, lesson.courseId, lesson.id);
      router.back();
    } catch (error) {
      console.error("Database status update aborted: ", error);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loaderCenterContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.loaderCenterContainer}>
        <Text style={styles.emptyStateTitle}>Document Unavailable</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listScrollContent}>
      <Text style={styles.courseTitle}>{lesson.title}</Text>
      <Text style={styles.category}>DOCUMENT READER</Text>

      <View style={styles.pdfFrameContainer}>
        <Text style={styles.quickIcon}>📄</Text>
        <Text style={styles.documentMetaText}>External Resource Reference Link:</Text>
        <Text style={styles.linkUrlText} numberOfLines={1}>{lesson.content}</Text>
      </View>

      <Text style={styles.teacher}>{lesson.description}</Text>

      <Pressable 
        style={[styles.continueCard, submitting && { opacity: 0.7 }]} 
        onPress={handleMarkComplete}
        disabled={submitting}
      >
        <Text style={styles.progressTitle}>
          {submitting ? "Updating Progress..." : "✅ Complete Document"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  loaderCenterContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
  listScrollContent: { padding: 16, paddingBottom: 40 },
  courseTitle: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 6 },
  category: { color: "#38BDF8", fontSize: 14, fontWeight: "600", marginBottom: 20 },
  pdfFrameContainer: { backgroundColor: "#111827", padding: 20, borderRadius: 14, alignItems: "center", marginBottom: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" },
  quickIcon: { fontSize: 38, marginBottom: 10 },
  documentMetaText: { color: "#9CA3AF", fontSize: 13, marginBottom: 4 },
  linkUrlText: { color: "#60A5FA", fontSize: 14, textDecorationLine: "underline" },
  teacher: { color: "#D1D5DB", fontSize: 15, lineHeight: 24, marginBottom: 30 },
  continueCard: { backgroundColor: "#10B981", padding: 18, borderRadius: 14, alignItems: "center" },
  progressTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  emptyStateTitle: { color: "white", fontSize: 18, fontWeight: "bold" }
});
