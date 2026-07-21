import { VerificationStatus } from "@/types/verification";
import { StyleSheet, Text, View } from "react-native";

export default function VerificationTimeline({ status }: { status: VerificationStatus }) {
  const step1 = "✅ Submitted";
  const step2 = "✅ File Upload Verified";
  const step3 = status === "approved" || status === "rejected" || status === "needs_more_info" ? "✅ Reviewed" : "🟡 Under Review";
  const step4 = status === "approved" ? "🟩 Completed" : status === "rejected" ? "🟥 Rejected" : status === "needs_more_info" ? "🟧 Info Requested" : "⬜ Decision Pending";

  return (
    <View style={styles.box}>
      <Text style={styles.heading}>📋 APPLICATION STATUS TIMELINE</Text>
      <View style={styles.row}><Text style={styles.node}>{step1}</Text></View>
      <View style={styles.line} />
      <View style={styles.row}><Text style={styles.node}>{step2}</Text></View>
      <View style={styles.line} />
      <View style={styles.row}><Text style={styles.node}>{step3}</Text></View>
      <View style={styles.line} />
      <View style={styles.row}><Text style={styles.node}>{step4}</Text></View>
    </View>
  );
}
const styles = StyleSheet.create({
  box: { backgroundColor: "#111827", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginVertical: 12 },
  heading: { color: "#6B7280", fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12 },
  row: { paddingLeft: 6 },
  node: { color: "white", fontSize: 14, fontWeight: "600" },
  line: { width: 2, height: 16, backgroundColor: "#374151", marginLeft: 14, marginVertical: 4 }
});
