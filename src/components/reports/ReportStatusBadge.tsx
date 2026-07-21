import { StyleSheet, Text, View } from "react-native";
import { ReportStatus } from "@/types/report";

export default function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const maps = {
    pending: { bg: "rgba(245,158,11,0.12)", txt: "#F59E0B", label: "🟡 PENDING" },
    resolved: { bg: "rgba(16,185,129,0.12)", txt: "#10B981", label: "🟢 RESOLVED" },
    dismissed: { bg: "rgba(255,255,255,0.05)", txt: "#9CA3AF", label: "⚪ DISMISSED" }
  };
  const active = maps[status] || maps.pending;

  return (
    <View style={[styles.badge, { backgroundColor: active.bg, borderColor: active.txt }]}>
      <Text style={[styles.text, { color: active.txt }]}>{active.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, alignSelf: "flex-start" },
  text: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 }
});
