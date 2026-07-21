import { StyleSheet, Text, View } from "react-native";
import CourseStatusBadge from "./CourseStatusBadge";

export default function SubmissionHistoryCard({ date, status, comment }: { date: number; status: any; comment?: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.date}>{new Date(date).toLocaleDateString()}</Text>
        <CourseStatusBadge status={status} />
      </View>
      {comment ? <Text style={styles.comment}>Remark: {comment}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#111827", padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  date: { color: "white", fontSize: 14, fontWeight: "600" },
  comment: { color: "#9CA3AF", fontSize: 13, marginTop: 4 }
});
