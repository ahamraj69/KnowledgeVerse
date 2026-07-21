import { StyleSheet, Text, View } from "react-native";
import { ModerationRecord } from "@/types/moderation";

export default function ModerationHistoryCard({ record }: { record: ModerationRecord }) {
  const dateLabel = new Date(record.createdAt).toLocaleDateString();
  const expirationLabel = record.expiresAt ? ` • Expires: ${new Date(record.expiresAt).toLocaleDateString()}` : "";

  return (
    <View style={[styles.card, record.action === "ban" && styles.banStyle, record.action === "suspension" && styles.suspensionStyle]}>
      <View style={styles.headerRow}>
        <Text style={styles.actionText}>🛡️ {record.action.toUpperCase()}</Text>
        <Text style={styles.dateText}>{dateLabel}{expirationLabel}</Text>
      </View>
      <Text style={styles.reasonText}>Reason: {record.reason}</Text>
      <Text style={styles.adminText}>Admin Executor: {record.adminId.substring(0, 8)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#111827", padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  banStyle: { borderColor: "rgba(239,68,68,0.35)", backgroundColor: "rgba(239,68,68,0.02)" },
  suspensionStyle: { borderColor: "rgba(245,158,11,0.35)", backgroundColor: "rgba(245,158,11,0.02)" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  actionText: { color: "white", fontSize: 13, fontWeight: "800", letterSpacing: 0.3 },
  dateText: { color: "#6B7280", fontSize: 11, fontWeight: "500" },
  reasonText: { color: "#CBD5E1", fontSize: 14, marginTop: 6, fontWeight: "500" },
  adminText: { color: "#4B5563", fontSize: 11, marginTop: 4, fontWeight: "600" }
});
