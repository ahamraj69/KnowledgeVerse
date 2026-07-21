import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Lesson } from "../../../types/lesson";
import { completeLesson } from "../../../lib/lessonProgress";

export default function TextLessonScreen() {
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
        console.error("Error reading lesson data text streams: ", error);
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
      console.error("Progress persistence sync crashed: ", error);
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
        <Text style={styles.emptyStateTitle}>Text Resource Missing</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listScrollContent}>
      <Text style={styles.category}>READING LESSON</Text>
      <Text style={styles.courseTitle}>{lesson.title}</Text>
      <Text style={styles.meta}>Estimated Time: {lesson.duration}</Text>
      
      <View style={styles.dividerLine} />

      <View style={styles.articleBodyContainer}>
        <Text style={styles.articleMarkdownBody}>
          {lesson.content || "No structural content written for this module block structure layer."}
        </Text>
      </View>

      <Pressable 
        style={[styles.continueCard, submitting && { opacity: 0.7 }]} 
        onPress={handleMarkComplete}
        disabled={submitting}
      >
        <Text style={styles.progressTitle}>
          {submitting ? "Finishing..." : "📖 Mark Article Read"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  loaderCenterContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
  listScrollContent: { padding: 20, paddingBottom: 40 },
  category: { color: "#38BDF8", fontSize: 13, fontWeight: "700", letterSpacing: 1, marginBottom: 4 },
  courseTitle: { fontSize: 26, fontWeight: "bold", color: "white", marginBottom: 8 },
  meta: { color: "#9CA3AF", fontSize: 14, fontWeight: "500" },
  dividerLine: { height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginVertical: 18 },
  articleBodyContainer: { marginBottom: 36 },
  articleMarkdownBody: { color: "#E5E7EB", fontSize: 16, lineHeight: 26, fontWeight: "400" },
  continueCard: { backgroundColor: "#4F46E5", padding: 18, borderRadius: 14, alignItems: "center" },
  progressTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  emptyStateTitle: { color: "white", fontSize: 18, fontWeight: "bold" }
});
