import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ReportReasonCard({ reason, selected, onSelect }: { reason: string; selected: boolean; onSelect: () => void }) {
  return (
    <TouchableOpacity style={[styles.card, selected && styles.active]} onPress={onSelect} activeOpacity={0.85}>
      <Text style={[styles.text, selected && styles.activeText]}>{reason}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: { padding: 14, backgroundColor: "#111827", borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  active: { backgroundColor: "rgba(239,68,68,0.1)", borderColor: "#EF4444" },
  text: { color: "#9CA3AF", fontSize: 14, fontWeight: "500" },
  activeText: { color: "white", fontWeight: "bold" }
});
