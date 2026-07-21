import { Course } from "@/types/course";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CourseStatusBadge from "./CourseStatusBadge";

export default function TeacherCourseStatusCard({ course, onPress }: { course: Course; onPress: () => void }) {
  const updatedDate = course.submittedAt ? new Date(course.submittedAt).toLocaleDateString() : new Date(course.createdAt).toLocaleDateString();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.left}>
        <Text style={styles.title} numberOfLines={1}>{course.title}</Text>
        <Text style={styles.meta}>Category: {course.category} • Updated: {updatedDate}</Text>
      </View>
      <CourseStatusBadge status={course.status} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  left: { flex: 1, paddingRight: 12 },
  title: { color: "white", fontSize: 16, fontWeight: "bold" },
  meta: { color: "#9CA3AF", fontSize: 13, marginTop: 4 }
});
