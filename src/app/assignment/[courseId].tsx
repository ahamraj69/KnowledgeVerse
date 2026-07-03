import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import AssignmentCard from "../../components/AssignmentCard";
import { useAuth } from "../../context/AuthContext";

import {
  Assignment,
  getAssignments,
} from "../../services/assignmentService";

export default function AssignmentScreen() {
  const { courseId } = useLocalSearchParams();
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

      const data = await getAssignments(
        courseId as string
      );

      setAssignments(data);
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Failed to load assignments"
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
        courseId: courseId,
      },
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#2563EB" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Loading Assignments...
        </Text>
      </View>
    );
  }
  return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "#0B1220",
    }}
    contentContainerStyle={{
      padding: 20,
      paddingBottom: 40,
    }}
  >
    <Text
      style={{
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
      }}
    >
      📚 Assignments
    </Text>

    {assignments.length === 0 ? (
      <View
        style={{
          marginTop: 80,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 60 }}>
          📭
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          No Assignments
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginTop: 8,
            textAlign: "center",
            fontSize: 15,
          }}
        >
          This course has no assignments yet
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