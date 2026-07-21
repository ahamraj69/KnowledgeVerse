import { StyleSheet, Text, View } from "react-native";
import { Report } from "@/types/report";
import ReportStatusBadge from "./ReportStatusBadge";

export default function ReportCard({ report }: { report: Report }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>Type: {report.targetType.toUpperCase()}</Text>
        <ReportStatusBadge status={report.status} />
      </View>
      <Text style={styles.reason}>Reason: {report.reason}</Text>
      {report.description ? <Text style={styles.desc}>{report.description}</Text> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: { color: "white", fontSize: 15, fontWeight: "bold" },
  reason: { color: "#F59E0B", fontSize: 13, fontWeight: "600" },
  desc: { color: "#9CA3AF", fontSize: 13, marginTop: 6, lineHeight: 18 }
});
