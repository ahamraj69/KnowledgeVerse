import { StyleSheet, Text, View } from "react-native";

export default function StatsCard({ label, value }: { label: string; value: string | number; }) {
  return (
    <View style={styles.card}>
      <Text style={styles.val}>{value}</Text>
      <Text style={styles.lbl}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: "28%", backgroundColor: "#111827", padding: 14, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  val: { color: "white", fontSize: 20, fontWeight: "bold" },
  lbl: { color: "#6B7280", fontSize: 11, marginTop: 4, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.3 }
});
