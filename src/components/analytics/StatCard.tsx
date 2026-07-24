import { StyleSheet, Text, View } from "react-native";

export default function StatCard({ label, value, tint = "#2563EB" }: { label: string; value: string | number; tint?: string }) {
  return (
    <View style={styles.card}>
      <View style={[styles.indicator, { backgroundColor: tint }]} />
      <Text style={styles.val}>{value}</Text>
      <Text style={styles.lbl} numberOfLines={1}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { flex: 1, minWidth: "47%", backgroundColor: "#111827", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", position: "relative", overflow: "hidden" },
  indicator: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4 },
  val: { color: "white", fontSize: 22, fontWeight: "bold" },
  lbl: { color: "#6B7280", fontSize: 12, marginTop: 4, fontWeight: "600", textTransform: "uppercase" }
});
