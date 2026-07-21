import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import CourseCard from "@/components/CourseCard";
import { getCourses } from "@/lib/courseService";
import { Theme } from "@/theme/theme";
import { Course } from "@/types/course";

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Core background dataset fetch loop orchestration
  const loadCatalogData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (e) {
      console.log("Syllabus catalog database sync failure:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogData();
  }, [loadCatalogData]);

  // Navigate to explicit dynamic route directory parameter hooks cleanly
  const handleSelectCourse = useCallback((id: string) => {
    router.push({
      pathname: "/course/[id]",
      params: { id }
    } as any);
  }, []);

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={[Theme.screen, styles.viewportWrapper]}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onRefresh={loadCatalogData}
        refreshing={loading}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>📚 Live Courses</Text>
            <Text style={styles.subtitle}>
              Browse through specialized technical academic tracks powered by AI models.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => handleSelectCourse(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active curriculum layers indexed yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: {
    backgroundColor: "#0B1220",
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 15,
  },
});
