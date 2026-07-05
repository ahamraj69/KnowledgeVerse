import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { sendMessage } from "../../services/aiService";

interface HistoryItem {
  subject: string;
  goal: string;
  plan: string;
}

export default function StudyPlannerScreen() {
  const [subject, setSubject] = useState("");
  const [goal, setGoal] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  // ✅ Part 5: Add a new state tracker for session logs
  const [history, setHistory] = useState<HistoryItem[]>([]);

  /**
   * Orchestrates the planner generation by piping state strings into the AI service
   */
  const generatePlan = async () => {
    if (!subject || !goal || !hours) {
      setPlan("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setPlan("");

      const prompt = `
Create a personalized study plan.

Subject: ${subject}
Goal: ${goal}
Study Hours Per Day: ${hours}

Return:
- Daily schedule
- Weekly milestones
- Revision strategy
- Tips for success
`;

      const reply = await sendMessage(prompt);
      setPlan(reply);

      // ✅ Part 5: Save every generated plan safely to tracking memory array
      setHistory((prev) => [
        {
          subject: subject.trim(),
          goal: goal.trim(),
          plan: reply,
        },
        ...prev,
      ]);
    } catch (error) {
      console.log(error);
      setPlan("Unable to generate study plan.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Copies the active plan result to the system clipboard buffer
   */
  const copyPlan = async () => {
    if (!plan) return;

    await Clipboard.setStringAsync(plan);
    Alert.alert("Copied", "Study plan copied to clipboard.");
  };

  /**
   * Re-runs the generator pipeline using existing input criteria
   */
  const regeneratePlan = async () => {
    await generatePlan();
  };

  /**
   * Resets all visual form inputs and clears generated output cache
   */
  const clearPlanner = () => {
    setSubject("");
    setGoal("");
    setHours("");
    setPlan("");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>📅 AI Study Planner</Text>
      <Text style={styles.subtitle}>
        Let AI create your personalized study schedule.
      </Text>

      {/* Input Form Fields */}
      <TextInput
        placeholder="Subject (e.g., Data Structures, Physics)"
        placeholderTextColor="#9CA3AF"
        value={subject}
        onChangeText={setSubject}
        style={styles.input}
      />

      <TextInput
        placeholder="Goal (e.g., Pass Exam, Build an App)"
        placeholderTextColor="#9CA3AF"
        value={goal}
        onChangeText={setGoal}
        style={styles.input}
      />

      <TextInput
        placeholder="Hours per Day"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={hours}
        onChangeText={hoursText => setHours(hoursText)}
        style={styles.input}
      />

      {/* Primary Generation Button */}
      <TouchableOpacity
        style={[styles.button, { opacity: loading ? 0.7 : 1 }]}
        disabled={loading}
        onPress={generatePlan}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Generate Study Plan</Text>
        )}
      </TouchableOpacity>

      {/* Generation Result Section */}
      {plan !== "" && (
        <View style={styles.resultCard}>
          <Text style={styles.result}>{plan}</Text>

          {/* Action Row Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.smallButton} onPress={copyPlan}>
              <Text style={styles.smallButtonText}>📋 Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallButton} onPress={regeneratePlan}>
              <Text style={styles.smallButtonText}>🔄 Regenerate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallButton} onPress={clearPlanner}>
              <Text style={styles.smallButtonText}>🗑 Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ✅ Part 5: History Attempt Card Selection Feed Component */}
      {history.length > 0 && (
        <>
          <Text style={styles.historyTitle}>Previous Study Plans</Text>

          {history.map((item, index) => (
            <View key={index} style={styles.historyCard}>
              <Text style={styles.historySubject}>📚 {item.subject}</Text>
              <Text style={styles.historyGoal}>🎯 {item.goal}</Text>
              
              {/* Optional preview limits to keep card sizes safe */}
              <Text style={styles.historyPlan} numberOfLines={3}>
                {item.plan}
              </Text>

              <TouchableOpacity
                style={styles.historyButton}
                onPress={() => setPlan(item.plan)}
              >
                <Text style={styles.historyButtonText}>View Again</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
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
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 25,
    fontSize: 15,
  },
  input: {
    backgroundColor: "#111827",
    color: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  resultCard: {
    backgroundColor: "#111827",
    marginTop: 25,
    padding: 18,
    borderRadius: 14,
  },
  result: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  smallButton: {
    flex: 1,
    backgroundColor: "#1F2937",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  smallButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  // ✅ Part 5: Central History Layout Styling Mappings Added
  historyTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 15,
  },
  historyCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
  },
  historySubject: {
    color: "#60A5FA",
    fontWeight: "bold",
    fontSize: 16,
  },
  historyGoal: {
    color: "#FACC15",
    marginTop: 6,
    marginBottom: 10,
    fontSize: 15,
  },
  historyPlan: {
    color: "#E5E7EB",
    lineHeight: 22,
  },
  historyButton: {
    marginTop: 15,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  historyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
