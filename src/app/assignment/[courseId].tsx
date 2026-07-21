import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AssignmentCard from "../../components/AssignmentCard";
import { useAuth } from "../../context/AuthContext";

import {
  Assignment,
  getAssignments,
} from "@/lib/assignmentService";

export default function AssignmentScreen() {
  const { courseId } = useLocalSearchParams<{
    courseId: string;
  }>();

  const { user } = useAuth();

  const [assignments, setAssignments] = useState<
    Assignment[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !courseId) return;

    loadAssignments();
  }, [user, courseId]);

  const loadAssignments = async () => {
    try {
      setLoading(true);

      const data = await getAssignments(courseId);

      setAssignments(data);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  const openAssignment = (
    assignment: Assignment
  ) => {
    router.push({
      pathname: "/assignment/submit",
      params: {
        assignmentId: assignment.id,
        courseId,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loading}>
          Loading Assignments...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        📚 Assignments
      </Text>

      {assignments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>
            📭
          </Text>

          <Text style={styles.emptyTitle}>
            No Assignments
          </Text>

          <Text style={styles.emptySubtitle}>
            This course has no assignments yet.
          </Text>
        </View>
      ) : (
        assignments.map((item) => (
          <AssignmentCard
            key={item.id}
            assignment={item}
            onOpen={openAssignment}
          />
        ))
      )}
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
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyEmoji: {
    fontSize: 60,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
  },

  emptySubtitle: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    fontSize: 15,
  },
});