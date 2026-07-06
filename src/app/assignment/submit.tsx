import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import {
  submitAssignment,
} from "../../services/assignmentService";

import { useAuth } from "../../context/AuthContext";

export default function AssignmentSubmit() {
  const { assignmentId, courseId } = useLocalSearchParams();
  const { user } = useAuth();

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    if (!answer.trim()) {
      Alert.alert("Error", "Please write your answer");
      return;
    }

    try {
      setLoading(true);

      // ✅ FIX: Realigned parameters perfectly to fit your structural 3-argument signature mapping sequence 
      await submitAssignment(
        assignmentId as string, // 1. assignmentId
        user.uid,               // 2. userId
        answer.trim()           // 3. fileUrl / content answer text
      );

      Alert.alert(
        "Success",
        "Assignment submitted successfully!"
      );

      router.back();
    } catch (e) {
      console.log(e);
      Alert.alert(
        "Error",
        "Failed to submit assignment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        ✍️ Submit Assignment
      </Text>

      <TextInput
        placeholder="Write your answer here..."
        placeholderTextColor="#9CA3AF"
        multiline
        value={answer}
        onChangeText={setAnswer}
        style={{
          backgroundColor: "#1F2937",
          color: "white",
          padding: 15,
          borderRadius: 12,
          height: 200,
          textAlignVertical: "top",
        }}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: "#2563EB",
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 20,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            🚀 Submit
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
