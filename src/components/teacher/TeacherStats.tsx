import { StyleSheet, Text, View } from "react-native";

interface TeacherStatsProps {
  students: number;
  courses: number;
  lessons: number;
  rating: number;
}

export default function TeacherStats({ students, courses, lessons, rating }: TeacherStatsProps) {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.card}>
        <Text style={styles.value}>👨‍Grad {students}</Text>
        <Text style={styles.label}>Students</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>📚 {courses}</Text>
        <Text style={styles.label}>Courses</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>🎥 {lessons}</Text>
        <Text style={styles.label}>Lessons</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>⭐ {rating.toFixed(1)}</Text>
        <Text style={styles.label}>Rating</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between", marginBottom: 16 },
  card: { flex: 1, minWidth: "45%", backgroundColor: "#111827", padding: 14, borderRadius: 14, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  value: { color: "white", fontSize: 18, fontWeight: "bold" },
  label: { color: "#6B7280", fontSize: 12, marginTop: 4, fontWeight: "600", textTransform: "uppercase" }
});
