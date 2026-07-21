import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Course } from "@/types/course";
import CourseStatusBadge from "./CourseStatusBadge";

interface ApprovalCardProps {
  course: Course;
  onView: () => void;
}

export default function CourseApprovalCard({ course, onView }: ApprovalCardProps) {
  const dateLabel = course.submittedAt ? new Date(course.submittedAt).toLocaleDateString() : "N/A";

  return (
    <View style={styles.card}>
      {course.thumbnail ? (
        <Image source={{ uri: course.thumbnail }} style={styles.thumb} />
      ) : (
        <View style={styles.thumbPlaceholder}><Text style={styles.placeholderText}>📖</Text></View>
      )}
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{course.title}</Text>
        <Text style={styles.teacher}>Teacher ID: {course.teacherId}</Text>
        <Text style={styles.meta}>Submitted: {dateLabel} • {course.category}</Text>
        <View style={styles.badgeRow}>
          <CourseStatusBadge status={course.status} />
        </View>
      </View>

      <TouchableOpacity style={styles.viewBtn} onPress={onView} activeOpacity={0.8}>
        <Text style={styles.btnText}>Review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", backgroundColor: "#111827", padding: 14, borderRadius: 16, marginBottom: 12, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  thumb: { width: 64, height: 64, borderRadius: 10, marginRight: 14 },
  thumbPlaceholder: { width: 64, height: 64, borderRadius: 10, backgroundColor: "#1F2937", justifyContent: "center", alignItems: "center", marginRight: 14 },
  placeholderText: { fontSize: 24 },
  info: { flex: 1, paddingRight: 8 },
  title: { color: "white", fontSize: 16, fontWeight: "bold" },
  teacher: { color: "#9CA3AF", fontSize: 13, marginTop: 2 },
  meta: { color: "#6B7280", fontSize: 11, marginTop: 4 },
  badgeRow: { marginTop: 6 },
  viewBtn: { backgroundColor: "#2563EB", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  btnText: { color: "white", fontSize: 13, fontWeight: "bold" }
});
