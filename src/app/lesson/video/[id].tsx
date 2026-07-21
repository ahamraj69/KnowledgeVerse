import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { db } from "../../../lib/firebase";
import { completeLesson } from "../../../lib/lessonProgress";
import { Lesson } from "../../../types/lesson";

export default function VideoLessonScreen() {
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
        console.error("Error loading video lesson snapshot: ", error);
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
      console.error("Failed to update execution progress: ", error);
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
        <Text style={styles.emptyStateTitle}>Lesson Not Found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listScrollContent}>
      <View style={styles.videoPlayerCanvas}>
        <Text style={styles.quickIcon}>🎥</Text>
        <Text style={styles.placeholderText}>Streaming Media Canvas</Text>
        <Text style={styles.meta}>{lesson.duration}</Text>
      </View>

      <Text style={styles.courseTitle}>{lesson.title}</Text>
      <Text style={styles.category}>{lesson.type.toUpperCase()}</Text>
      <Text style={styles.teacher}>{lesson.description}</Text>

      <Pressable 
        style={[styles.continueCard, submitting && { opacity: 0.7 }]} 
        onPress={handleMarkComplete}
        disabled={submitting}
      >
        <Text style={styles.progressTitle}>
          {submitting ? "Saving Status..." : "✅ Mark Lesson Complete"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  loaderCenterContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
  listScrollContent: { padding: 16, paddingBottom: 40 },
  videoPlayerCanvas: { width: "100%", height: 210, backgroundColor: "#111827", borderRadius: 16, justifyContent: "center", alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  quickIcon: { fontSize: 42, marginBottom: 8 },
  placeholderText: { color: "white", fontSize: 16, fontWeight: "bold" },
  meta: { marginTop: 6, color: "#9CA3AF", fontSize: 13 },
  courseTitle: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 6 },
  category: { color: "#38BDF8", fontSize: 14, fontWeight: "600", marginBottom: 12 },
  teacher: { color: "#9CA3AF", fontSize: 15, lineHeight: 22, marginBottom: 30 },
  continueCard: { backgroundColor: "#2563EB", padding: 18, borderRadius: 14, alignItems: "center" },
  progressTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  emptyStateTitle: { color: "white", fontSize: 18, fontWeight: "bold" }
});
