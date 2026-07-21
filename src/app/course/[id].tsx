import React, { useEffect, useState, useCallback } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Image } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CourseData {
  id: string;
  title: string;
  teacher: string;
  description: string;
  category: string;
  thumbnail?: string;
}

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCourseDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const docRef = doc(db, "courses", String(id));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCourse({ id: docSnap.id, ...docSnap.data() } as CourseData);
      }
    } catch (error) {
      console.error("Error reading structural metadata metrics: ", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const handleStartCourse = useCallback(() => {
    if (!course) return;
    router.push(`/course/${course.id}/lessons` as any);
  }, [router, course]);

  if (loading) {
    return (
      <View style={styles.loaderCenterContainer}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.loaderCenterContainer}>
        <Text style={styles.placeholderText}>Course Index Not Located</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listScrollContent}>
      {course.thumbnail ? (
        <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <Text style={styles.placeholderText}>📚</Text>
        </View>
      )}

      <Text style={styles.category}>{course.category.toUpperCase()}</Text>
      <Text style={styles.courseTitle}>{course.title}</Text>
      <Text style={styles.teacher}>Instructed by {course.teacher}</Text>

      <View style={styles.metaPaddingCard}>
        <Text style={styles.sectionTitle}>Course Syllabus Information</Text>
        <Text style={styles.descriptionText}>
          {course.description || "No foundational syllabus summary documentation provided for this reference asset matrix configuration block."}
        </Text>
      </View>

      {/* ✅ Direct Entry Pathway: Substituted Paywall / Buy buttons with open access action hook */}
      <Pressable style={styles.featureCard} onPress={handleStartCourse}>
        <Text style={styles.featureCourse}>🚀 Start Learning Now</Text>
        <Text style={styles.featureSubtitle}>This path provides uninhibited 100% open access to educational matrices</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  loaderCenterContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
  listScrollContent: { padding: 16, paddingBottom: 40 },
  thumbnail: { width: "100%", height: 200, borderRadius: 16, marginBottom: 16 },
  thumbnailPlaceholder: { backgroundColor: "#111827", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  placeholderText: { color: "white", fontSize: 16, fontWeight: "bold" },
  category: { color: "#38BDF8", fontSize: 13, fontWeight: "700", marginBottom: 6 },
  courseTitle: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 4 },
  teacher: { color: "#9CA3AF", fontSize: 14, fontWeight: "500", marginBottom: 20 },
  metaPaddingCard: { backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  sectionTitle: { color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  descriptionText: { color: "#D1D5DB", fontSize: 14, lineHeight: 22 },
  featureCard: { backgroundColor: "#2563EB", padding: 20, borderRadius: 16, alignItems: "center" },
  featureCourse: { color: "white", fontSize: 18, fontWeight: "bold" },
  featureSubtitle: { color: "#DBEAFE", marginTop: 4, fontSize: 12, textAlign: "center" }
});
