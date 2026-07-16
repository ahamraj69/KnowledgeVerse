import * as Clipboard from "expo-clipboard";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import { saveAssignment } from "@/services/assignmentHistoryService";

interface HistoryItem {
  subject: string;
  topic: string;
  assignment: string;
}

export default function AIAssignmentScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [assignmentType, setAssignmentType] = useState("Homework");
  const [loading, setLoading] = useState(false);
  const [assignment, setAssignment] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const generateAssignment = useCallback(async () => {
    const cleanSubject = subject.trim();
    const cleanTopic = topic.trim();
    const cleanClass = studentClass.trim();

    if (!cleanSubject || !cleanTopic || !cleanClass) {
      Alert.alert("Required Fields", "Please complete all field parameters before generating.");
      return;
    }

    if (!isConnected) {
      Alert.alert("Offline", "Please connect to the internet to trigger AI models.");
      return;
    }

    try {
      setLoading(true);
      setAssignment("");

      const combinedTopicString = `${cleanSubject} - ${cleanTopic} (Class ${cleanClass})`;

      const response = await fetch("http://localhost:5000/assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: combinedTopicString,
          type: assignmentType,
          difficulty: difficulty
        }),
      });

      const data = await response.json();

      if (data && data.result) {
        setAssignment(data.result);
        
        setHistory((prev) => [
          {
            subject: cleanSubject,
            topic: cleanTopic,
            assignment: data.result,
          },
          ...prev,
        ]);

        if (user?.uid) {
          await saveAssignment(user.uid, {
            topic: combinedTopicString,
            type: assignmentType,
            difficulty: difficulty,
            result: data.result,
          });
        }
      } else {
        throw new Error("Empty response");
      }

    } catch (err) {
      if (__DEV__) {
        console.log("AI Enhanced Assignment error:", err);
      }
      setAssignment("Unable to generate assignment.");
    } finally {
      setLoading(false);
    }
  }, [subject, topic, studentClass, difficulty, assignmentType, isConnected, user?.uid]);

  const copyAssignment = useCallback(async () => {
    if (!assignment) return;
    await Clipboard.setStringAsync(assignment);
    Alert.alert("Copied", "Assignment copied to clipboard.");
  }, [assignment]);

  const regenerateAssignment = useCallback(() => {
    generateAssignment();
  }, [generateAssignment]);

  // ✅ Step 3: Replaced Expo implementation with React Native core Share API
  const shareAssignment = useCallback(async () => {
    if (!assignment) return;
    try {
      await Share.share({
        message: assignment,
      });
    } catch {
      Alert.alert("Share", "Unable to share assignment.");
    }
  }, [assignment]);

  const renderedHistory = useMemo(() => {
    return history.map((item, index) => {
      const stableHistoryKey = `asgn-${index}-${item.subject.replace(/\s+/g, "-").toLowerCase()}`;
      return (
        <TouchableOpacity
          key={stableHistoryKey}
          style={styles.historyCard}
          onPress={() => setAssignment(item.assignment)}
          activeOpacity={0.75}
        >
          <Text style={styles.historySubject}>📚 {item.subject}</Text>
          <Text style={styles.historyTopic}>{item.topic}</Text>
        </TouchableOpacity>
      );
    });
  }, [history]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📝 AI Assignment Generator</Text>
      <Text style={styles.subtitle}>Generate professional assignments using AI.</Text>

      <TextInput
        style={styles.input}
        placeholder="Subject"
        placeholderTextColor="#9CA3AF"
        value={subject}
        onChangeText={setSubject}
        editable={!loading}
        maxLength={100}
      />

      <TextInput
        style={styles.input}
        placeholder="Topic"
        placeholderTextColor="#9CA3AF"
        value={topic}
        onChangeText={setTopic}
        editable={!loading}
        maxLength={100}
      />

      <TextInput
        style={styles.input}
        placeholder="Class (Example: 8)"
        placeholderTextColor="#9CA3AF"
        value={studentClass}
        onChangeText={setStudentClass}
        keyboardType="numeric"
        editable={!loading}
        maxLength={3}
      />

      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.row}>
        {["Easy", "Medium", "Hard"].map((item) => (
          <TouchableOpacity
            key={item}
            disabled={loading}
            style={[styles.choiceButton, difficulty === item && styles.selectedButton]}
            onPress={() => setDifficulty(item)}
          >
            <Text style={styles.choiceText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Assignment Type</Text>
      <View style={styles.row}>
        {["Homework", "Practice", "Exam"].map((item) => (
          <TouchableOpacity
            key={item}
            disabled={loading}
            style={[styles.choiceButton, assignmentType === item && styles.selectedButton]}
            onPress={() => setAssignmentType(item)}
          >
            <Text style={styles.choiceText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.generateButton, { opacity: loading ? 0.6 : 1 }]}
        onPress={generateAssignment}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Generate Assignment</Text>}
      </TouchableOpacity>

      {assignment !== "" && (
        <View style={styles.assignmentCard}>
          <View style={styles.buttonActionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={copyAssignment}>
              <Text style={styles.actionButtonText}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={shareAssignment}>
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.assignmentText}>{assignment}</Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.smallButton} onPress={regenerateAssignment}>
              <Text style={styles.smallButtonText}>🔄 Regenerate</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Previous Assignments</Text>
          {renderedHistory}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: "white", fontSize: 30, fontWeight: "bold", marginBottom: 6 },
  subtitle: { color: "#9CA3AF", marginBottom: 25, fontSize: 15 },
  input: { backgroundColor: "#111827", color: "white", padding: 15, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 16 },
  label: { color: "white", fontSize: 17, fontWeight: "bold", marginBottom: 10, marginTop: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  choiceButton: { flex: 1, backgroundColor: "#1F2937", marginHorizontal: 4, padding: 12, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  selectedButton: { backgroundColor: "#2563EB" },
  choiceText: { color: "white", fontWeight: "600" },
  generateButton: { backgroundColor: "#16A34A", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 15, minHeight: 54, justifyContent: "center" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 17 },
  assignmentCard: { backgroundColor: "#111827", marginTop: 25, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  assignmentText: { color: "white", fontSize: 16, lineHeight: 24, marginTop: 12 },
  buttonActionContainer: { flexDirection: "row", gap: 12, marginBottom: 15 },
  actionButton: { flex: 1, backgroundColor: "#2563EB", paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center", minHeight: 44 },
  actionButtonText: { color: "white", fontWeight: "bold", fontSize: 15 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  smallButton: { flex: 1, backgroundColor: "#1F2937", padding: 12, borderRadius: 10, alignItems: "center", marginHorizontal: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  smallButtonText: { color: "white", fontWeight: "bold" },
  historySection: { marginTop: 10 },
  historyTitle: { color: "white", fontSize: 22, fontWeight: "bold", marginTop: 30, marginBottom: 15 },
  historyCard: { backgroundColor: "#111827", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
historySubject: { color: "#60A5FA", fontWeight: "bold", fontSize: 16 },historyTopic: { color: "#D1D5DB", marginTop: 6, fontSize: 14 },});