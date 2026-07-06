import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import ReviewCard from "../../../components/ReviewCard";
import {
    getCourseReviews,
    Review, // ✅ FIX: Aligned interface types to match the exported 'Review' signature strictly
} from "../../../services/reviewService";

export default function CourseReviews() {
  const { courseId } = useLocalSearchParams<{
    courseId: string;
  }>();

  const [reviews, setReviews] = useState<Review[]>([]); // ✅ FIX: Swapped CourseReview[] with type-safe Review[]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      loadReviews();
    } else {
      setLoading(false);
    }
  }, [courseId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getCourseReviews(courseId as string);
      setReviews(data);
    } catch (e) {
      console.log("Error loading full reviews feed roster panel:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />
        <Text style={styles.loading}>
          Loading Reviews...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={reviews}
      keyExtractor={(item) => item.id || Math.random().toString()}
      ListHeaderComponent={() => (
        <>
          <Text style={styles.title}>
            ⭐ Course Reviews
          </Text>

          <Text style={styles.subtitle}>
            Student feedback and ratings
          </Text>
        </>
      )}
      renderItem={({ item }) => (
        <ReviewCard review={item} />
      )}
      ListEmptyComponent={() => (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>
            ⭐
          </Text>

          <Text style={styles.emptyTitle}>
            No Reviews Yet
          </Text>

          <Text style={styles.emptySub}>
            Be the first to review this course.
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B1220",
  },
  loading: {
    color: "white",
    marginTop: 12,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#9CA3AF",
    marginBottom: 25,
    marginTop: 5,
  },
  empty: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyEmoji: {
    fontSize: 60,
  },
  emptyTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },
  emptySub: {
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
});
