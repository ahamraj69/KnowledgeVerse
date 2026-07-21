import { VerificationStatus } from "@/types/verification";
import { StyleSheet, Text, View } from "react-native";

export default function StatusBadge({ status }: { status: VerificationStatus }) {
  const isPending = status === "pending";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <View style={[
      styles.badge,
      isPending && styles.pending,
      isApproved && styles.approved,
      isRejected && styles.rejected
    ]}>
      <Text style={[
        styles.text,
        isPending && styles.pText,
        isApproved && styles.aText,
        isRejected && styles.rText
      ]}>{status.toUpperCase()}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: "#1F2937" },
  pending: { backgroundColor: "rgba(245,158,11,0.12)" },
  approved: { backgroundColor: "rgba(16,185,129,0.12)" },
  rejected: { backgroundColor: "rgba(239,68,68,0.12)" },
  text: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3, color: "#9CA3AF" },
  pText: { color: "#F59E0B" },
  aText: { color: "#10B981" },
  rText: { color: "#EF4444" }
});
