import { StyleSheet, Text, View } from "react-native";

interface DashboardStatsProps {
  courses: number;
  streak: number;
  lessons: number;
}

export default function DashboardStats({ courses, streak, lessons }: DashboardStatsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.value}>{courses}</Text>
        <Text style={styles.label}>Courses</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>{streak}</Text>
        <Text style={styles.label}>Streak</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.value}>{lessons}</Text>
        <Text style={styles.label}>Lessons</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  value: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  label: {
    color: "#9CA3AF",
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },
});
