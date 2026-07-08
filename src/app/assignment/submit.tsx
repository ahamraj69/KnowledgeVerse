import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { submitAssignment } from "../../services/assignmentService";
import { Theme } from "../../theme/theme";

export default function AssignmentSubmitScreen() {
  const { assignmentId, courseId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const cleanAnswer = answer.trim();

    // Secondary local fallback context gate verification
    if (!user?.uid) {
      Alert.alert("Authorization Error", "Active user context profile required to complete task uploads.");
      return;
    }

    if (!cleanAnswer) {
      Alert.alert("Blank Input", "Please provide a solution description text string or resource link reference URL.");
      return;
    }

    try {
      // ✅ Phase 22.8: Sets true to lock button execution context thread immediately
      setLoading(true);
      
      await submitAssignment(user.uid, {
        assignmentId: assignmentId as string,
        courseId: courseId as string,
        answerText: cleanAnswer,
      });

      Alert.alert("Success", "Assignment submitted successfully! 🎉");
      router.back();
    } catch (e) {
      // ✅ Phase 22.7: Prevent stack trace leakage down into the alert prompt window fields
      console.log("Assignment processing transaction block error caught:", e);
      Alert.alert("Submission Blocked", "An unexpected transmission error occurred. Please verify connectivity parameters and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={[Theme.text, styles.title]}>📄 Submit Assignment</Text>
      <Text style={[Theme.muted, styles.subtitle]}>Provide your task answer link or code text repository block details below.</Text>

      <TextInput
        placeholder="Type your submission details or asset reference URL here..."
        placeholderTextColor="#9CA3AF"
        value={answer}
        onChangeText={setAnswer}
        multiline
        numberOfLines={6}
        editable={!loading}
        style={styles.input}
      />

      {/* ✅ Phase 22.8: Form control changes color state configuration dynamically on load freeze */}
      <TouchableOpacity
        disabled={loading}
        onPress={handleSubmit}
        style={[styles.btn, { backgroundColor: loading ? "#1F2937" : "#2563EB", opacity: loading ? 0.6 : 1 }]}
      >
        <Text style={styles.btnText}>{loading ? "Transmitting Solution..." : "Upload Submission"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 15, marginTop: 4, marginBottom: 25 },
  input: {
    backgroundColor: "#111827",
    color: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    minHeight: 150,
    textAlignVertical: "top",
    fontSize: 16,
    marginBottom: 20,
  },
  btn: { padding: 16, borderRadius: 12, alignItems: "center" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
