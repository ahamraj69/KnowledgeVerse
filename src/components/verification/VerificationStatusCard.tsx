import { VerificationStatus } from "@/types/verification";
import { StyleSheet, Text, View } from "react-native";

export default function VerificationStatusCard({ status }: { status: VerificationStatus }) {
  const config = {
    pending: { bg: "rgba(245,158,11,0.1)", label: "🟡 Pending Review", txt: "#F59E0B" },
    approved: { bg: "rgba(16,185,129,0.1)", label: "🟢 Approved", txt: "#10B981" },
    rejected: { bg: "rgba(239,68,68,0.1)", label: "🔴 Rejected", txt: "#EF4444" },
    needs_more_info: { bg: "rgba(56,189,248,0.1)", label: "🟠 Needs More Information", txt: "#38BDF8" }
  };

  const active = config[status] || config.pending;

  return (
    <View style={[styles.card, { backgroundColor: active.bg, borderColor: active.txt }]}>
      <Text style={[styles.text, { color: active.txt }]}>{active.label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 12, alignItems: "center", borderWidth: 1, marginVertical: 8 },
  text: { fontSize: 15, fontWeight: "bold" }
});
