import { StyleSheet, Text, View } from "react-native";

export default function CourseReviewTimeline({ status }: { status: "draft" | "pending" | "approved" | "rejected" }) {
  const isDraft = status === "draft";
  const isPending = status === "pending";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <View style={styles.box}>
      <Text style={styles.heading}>📋 APPROVAL LIFECYCLE PROGRESSION</Text>
      <Text style={styles.node}>✅ Draft Initialized</Text>
      <View style={styles.line} />
      <Text style={[styles.node, isDraft && styles.dim]}>{!isDraft ? "✅ Submitted for Review" : "⬜ Waiting for Submission"}</Text>
      <View style={styles.line} />
      <Text style={[styles.node, (isDraft || isPending) && styles.dim]}>
        {isApproved || isRejected ? "✅ Admin Evaluation Finished" : "🟡 Administrative Under Review"}
      </Text>
      <View style={styles.line} />
      <Text style={[styles.node, (isDraft || isPending) && styles.dim, isApproved && styles.approvedText, isRejected && styles.rejectedText]}>
        {isApproved ? "🟩 Course Published Live" : isRejected ? "🟥 Revision Feedback Requested" : "⬜ Decision Pending"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: "#111827", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginVertical: 12 },
  heading: { color: "#6B7280", fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12 },
  node: { color: "white", fontSize: 14, fontWeight: "600" },
  dim: { color: "#4B5563" },
  approvedText: { color: "#10B981" },
  rejectedText: { color: "#EF4444" },
  line: { width: 2, height: 14, backgroundColor: "#374151", marginLeft: 6, marginVertical: 4 }
});
