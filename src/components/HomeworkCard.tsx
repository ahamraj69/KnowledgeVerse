import { HomeworkExplanation } from "@/lib/homeworkService";
import { StyleSheet, Text, View } from "react-native";

export default function HomeworkCard({ result }: { result: HomeworkExplanation }) {
  return (
    <View style={styles.card}>
      <Text style={styles.problemLabel}>📝 PROBLEM: {result.problem}</Text>
      
      {result.steps.map((step, idx) => (
        <Text key={idx} style={styles.stepText}>• {step}</Text>
      ))}

      <View style={styles.answerBadge}>
        <Text style={styles.answerText}>🎯 FINAL TARGET: {result.finalAnswer}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 14, marginVertical: 8, borderWidth: 1, borderColor: "rgba(56,189,248,0.2)" },
  problemLabel: { color: "white", fontSize: 16, fontWeight: "bold", marginBottom: 12 },
  stepText: { color: "#CBD5E1", fontSize: 14, lineHeight: 22, marginBottom: 8, paddingLeft: 4 },
  answerBadge: { backgroundColor: "rgba(16,185,129,0.1)", padding: 10, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: "rgba(16,185,129,0.3)" },
  answerText: { color: "#34D399", fontWeight: "bold", fontSize: 14 }
});
