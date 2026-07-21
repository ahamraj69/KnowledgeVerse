import { StyleSheet, Text, View } from "react-native";

interface StatusCardProps {
  status: "draft" | "pending" | "approved" | "rejected";
  comment?: string;
}

export default function PublishStatusCard({ status, comment }: StatusCardProps) {
  const themes = {
    draft: { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.1)", text: "#9CA3AF", hint: "Work in Progress. Complete all details before submitting." },
    pending: { bg: "rgba(245,158,11,0.08)", border: "#F59E0B", text: "#F59E0B", hint: "🟡 Pending Review. Waiting for administrator validation." },
    approved: { bg: "rgba(16,185,129,0.08)", border: "#10B981", text: "#10B981", hint: "🟩 Approved. This course is live and visible to students." },
    rejected: { bg: "rgba(239,68,68,0.08)", border: "#EF4444", text: "#EF4444", hint: "🟥 Revision Required. Please examine the feedback below." }
  };

  const active = themes[status] || themes.draft;

  return (
    <View style={[styles.card, { backgroundColor: active.bg, borderColor: active.border }]}>
      <Text style={[styles.hintText, { color: active.text }]}>{active.hint}</Text>
      {status === "rejected" && comment && (
        <View style={styles.commentBox}>
          <Text style={styles.commentLabel}>FEEDBACK REMARKS:</Text>
          <Text style={styles.commentText}>{comment}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 14, borderWidth: 1, marginVertical: 12 },
  hintText: { fontSize: 13, fontWeight: "700", letterSpacing: 0.2 },
  commentBox: { marginTop: 12, borderTopWidth: 1, borderTopColor: "rgba(239,68,68,0.15)", paddingTop: 10 },
  commentLabel: { color: "#6B7280", fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },
  commentText: { color: "#CBD5E1", fontSize: 13, marginTop: 4, lineHeight: 18 }
});
