import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import LessonCard from "@/components/LessonCard";
import { auth } from "@/lib/firebase";
import { getCompletedLessonIds } from "@/lib/lessonProgress";
import { getLessons } from "@/lib/lessonService";
import { Lesson } from "@/types/lesson";

export default function LessonsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = auth.currentUser?.uid || "guest_user_node";

  const loadScreenData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const lessonsData = await getLessons(String(id));
      const completedList = await getCompletedLessonIds(currentUserId, String(id));
      
      setLessons(lessonsData as Lesson[]);
      setCompletedIds(completedList);
    } catch (e) {
      console.error("Critical execution breakdown mapping modules: ", e);
    } finally {
      setLoading(false);
    }
  }, [id, currentUserId]);

  useEffect(() => {
    loadScreenData();
  }, [loadScreenData]);

  const handleNavigation = useCallback((lesson: Lesson) => {
    if (lesson.type === "video") {
      router.push(`/lesson/video/${lesson.id}` as any);
    } else if (lesson.type === "pdf") {
      router.push(`/lesson/pdf/${lesson.id}` as any);
    } else if (lesson.type === "text") {
      router.push(`/lesson/text/${lesson.id}` as any);
    } else {
      console.warn(`Routing logic block unhandled for type parameter: ${lesson.type}`);
    }
  }, [router]);

  // ✅ Part 3.4: Resumption workflow parsing the next sequential incomplete module
  const handleContinueLearning = useCallback(() => {
    const nextIncomplete = lessons.find(lesson => !completedIds.includes(lesson.id));
    if (nextIncomplete) {
      handleNavigation(nextIncomplete);
    } else if (lessons.length > 0) {
      handleNavigation(lessons[0]);
    }
  }, [lessons, completedIds, handleNavigation]);

  if (loading) {
    return (
      <View style={styles.loaderCenterContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  // ✅ Part 3.4: Math calculations parsing the total percentage progress data values
  const completionPercentage = lessons.length > 0 
    ? Math.round((completedIds.length / lessons.length) * 100) 
    : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listScrollContent}>
      
      {/* ✅ Part 3.4: Progress Dashboard Layer */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>YOUR PROGRESSION</Text>
        <Text style={styles.statsValue}>{completionPercentage}%</Text>
        <Text style={styles.statsSubtitle}>
          {completedIds.length} of {lessons.length} Modules Completed
        </Text>
      </View>

      {/* ✅ Part 3.4: Auto-Resume Target Callout Box */}
      {lessons.length > 0 && (
        <Pressable style={styles.featureCard} onPress={handleContinueLearning}>
          <Text style={styles.featureTitle}>CONTINUE JOURNEY</Text>
          <Text style={styles.featureCourse}>Resume Last Lesson</Text>
          <Text style={styles.featureSubtitle}>Click to automatically parse pending content matrices</Text>
        </Pressable>
      )}

      <Text style={styles.sectionTitle}>Course Syllabus</Text>

      {lessons.length === 0 ? (
        <View style={styles.innerEmptyState}>
          <Text style={styles.emptyStateTitle}>Syllabus Pending</Text>
          <Text style={styles.emptyStateSub}>No lectures or assets published yet inside this directory block.</Text>
        </View>
      ) : (
        lessons.map((lesson) => {
          const isFinished = completedIds.includes(lesson.id);
          return (
            <View key={lesson.id} style={styles.wrapperPositionRelative}>
              <LessonCard
                lesson={lesson}
                onPress={() => handleNavigation(lesson)}
              />
              {isFinished && (
                <View style={styles.badgeAbsoluteContainer}>
                  <Text style={styles.badgeTextText}>COMPLETED</Text>
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  loaderCenterContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
  listScrollContent: { padding: 16, paddingBottom: 40 },
  statsCard: { backgroundColor: "#111827", borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  statsTitle: { color: "#9CA3AF", fontSize: 12, fontWeight: "600", letterSpacing: 0.5 },
  statsValue: { color: "#FFFFFF", fontSize: 32, fontWeight: "bold", marginTop: 4 },
  statsSubtitle: { color: "#6B7280", marginTop: 6, fontSize: 13 },
  featureCard: { backgroundColor: "#1E1B4B", padding: 18, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: "rgba(99,102,241,0.25)" },
  featureTitle: { color: "#6366F1", fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  featureCourse: { color: "white", fontSize: 18, fontWeight: "bold", marginTop: 4 },
  featureSubtitle: { color: "#94A3B8", marginTop: 4, fontSize: 12 },
  sectionTitle: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 14 },
  wrapperPositionRelative: { position: "relative" },
  badgeAbsoluteContainer: { position: "absolute", top: 14, right: 14, backgroundColor: "rgba(16,185,129,0.15)", borderWidth: 1, borderColor: "rgba(16,185,129,0.3)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeTextText: { color: "#34D399", fontSize: 10, fontWeight: "700" },
  innerEmptyState: { padding: 30, alignItems: "center", marginTop: 40 },
  emptyStateTitle: { color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  emptyStateSub: { color: "#9CA3AF", fontSize: 14, textAlign: "center" }
});
