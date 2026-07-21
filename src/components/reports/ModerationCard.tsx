import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Report } from "@/types/report";
import ReportStatusBadge from "./ReportStatusBadge";

interface ModerationCardProps {
  report: Report;
  onView: () => void;
}

export default function ModerationCard({ report, onView }: ModerationCardProps) {
  const dateLabel = new Date(report.createdAt).toLocaleDateString();

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>🚩 TARGET: {report.targetType.toUpperCase()}</Text>
        <Text style={styles.reason}>Reason: {report.reason}</Text>
        <Text style={styles.meta}>By: {report.reporterId.substring(0, 6)} • {dateLabel}</Text>
      </View>
      <View style={styles.right}>
        <ReportStatusBadge status={report.status} />
        <TouchableOpacity style={styles.viewBtn} onPress={onView} activeOpacity={0.8}>
          <Text style={styles.btnText}>Review</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", backgroundColor: "#111827", padding: 16, borderRadius: 16, marginBottom: 12, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  left: { flex: 1, paddingRight: 12 },
  title: { color: "white", fontSize: 15, fontWeight: "bold" },
  reason: { color: "#EF4444", fontSize: 13, marginTop: 4, fontWeight: "600" },
  meta: { color: "#6B7280", fontSize: 11, marginTop: 4 },
  right: { alignItems: "flex-end", gap: 10 },
  viewBtn: { backgroundColor: "#2563EB", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  btnText: { color: "white", fontSize: 13, fontWeight: "bold" }
});
