import CachedImage from "@/components/CachedImage";
import { useAuth } from "@/context/AuthContext";
import { addBookmark } from "@/services/bookmarkService";
import {
    CourseServiceType,
    getCourses,
} from "@/services/courseListService";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, Alert, ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseServiceType | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const courses = await getCourses();
      const found = courses.find((item) => item.id === id);

      if (found) {
        setCourse(found);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user || !course) {
      Alert.alert(
        "Login Required",
        "Please login first."
      );
      return;
    }

    try {
      await addBookmark(user.uid, {
        courseId: course.id,
        lessonId: course.id,
        lessonTitle: course.title,
      });

      Alert.alert(
        "Success",
        "Course bookmarked successfully."
      );
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Unable to save bookmark."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading course...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Banner */}
      <CachedImage
        uri={
          course?.thumbnail ||
          "https://placehold.co"
        }
        width="100%"
        height={200}
        borderRadius={18}
      />

      {/* Title */}
      <Text style={styles.title}>
        {course?.title || "Course"}
      </Text>

      <Text style={styles.teacher}>
        👨‍🏫 KnowledgeVerse
      </Text>

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.stat}>
          ⭐ New Course
        </Text>

        <Text style={styles.stat}>
          📖 Learning Course
        </Text>

        <Text style={styles.stat}>
          ⏱ 8 hrs
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.sectionTitle}>
        Description
      </Text>

      <Text style={styles.description}>
        {course?.description || "No description available."}
      </Text>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push(`/quiz/${course?.id}` as any)}
        >
          <Text style={styles.primaryText}>▶ Start Learning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBookmark}
        >
          <Text style={styles.secondaryText}>🔖 Bookmark</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            console.log("Wishlist:", course?.id);
          }}
        >
          <Text style={styles.secondaryText}>❤️ Wishlist</Text>
        </TouchableOpacity>
      </View>

      {/* Lessons */}
      <Text style={styles.sectionTitle}>
        Lessons
      </Text>

      <View style={styles.lesson}>
        <Text style={styles.lessonText}>
          📖 Lesson 1
        </Text>
      </View>

      <View style={styles.lesson}>
        <Text style={styles.lessonText}>
          📖 Lesson 2
        </Text>
      </View>

      <View style={styles.lesson}>
        <Text style={styles.lessonText}>
          📖 Lesson 3
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B1220",
  },
  loadingText: {
    color: "white",
    marginTop: 15,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
  },
  teacher: {
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  stat: {
    color: "#FACC15",
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 20,
  },
  description: {
    color: "#D1D5DB",
    lineHeight: 24,
  },
  actions: {
    marginTop: 24,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  lesson: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  lessonText: {
    color: "white",
    fontSize: 16,
  },
});
