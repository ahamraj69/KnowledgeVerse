import { RevisionSummary } from "@/lib/revisionService";
import { StyleSheet, Text, View } from "react-native";

export default function RevisionCard({ summary }: { result?: any; summary: RevisionSummary }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎓 LAST-MINUTE REVISION: {summary.topic}</Text>
      <Text style={styles.desc}>{summary.definition}</Text>
      {summary.formula && <Text style={styles.formulaText}>🧪 FORMULA: {summary.formula}</Text>}
      <Text style={styles.subLabel}>Core Operational Phases:</Text>
      {summary.processSteps.map((step, idx) => (
        <Text key={idx} style={styles.text}>• {step}</Text>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: "#111827", padding: 18, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", marginVertical: 10 },
  title: { color: "#38BDF8", fontSize: 15, fontWeight: "bold" },
  desc: { color: "#CBD5E1", fontSize: 14, marginTop: 8, lineHeight: 22 },
  formulaText: { color: "#FBBF24", fontSize: 14, fontWeight: "700", padding: 8, backgroundColor: "rgba(245,158,11,0.06)", borderRadius: 6, marginVertical: 10, overflow: "hidden" },
  subLabel: { color: "white", fontSize: 13, fontWeight: "700", marginTop: 12, textTransform: "uppercase" },
  text: { color: "#9CA3AF", fontSize: 13, marginTop: 4, lineHeight: 18 }
});
