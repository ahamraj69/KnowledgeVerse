import { StudyTask } from "@/lib/studyPlannerService";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function StudyPlanCard({ task, onToggle }: { task: StudyTask; onToggle: () => void }) {
  return (
    <View style={[styles.card, task.done && styles.doneCard]}>
      <View style={styles.flexCol}>
        <Text style={styles.dayText}>📅 DAY {task.dayNumber} TASK</Text>
        <Text style={styles.subjectText}>{task.subject} Syllabus Sync</Text>
        <Text style={styles.timeText}>⏱️ Duration Allocation: {task.durationMinutes} Mins</Text>
      </View>
      <Pressable style={[styles.checkbox, task.done && styles.checkedBox]} onPress={onToggle}>
        {task.done && <Text style={styles.checkIcon}>✓</Text>}
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#111827", padding: 16, borderRadius: 14, marginVertical: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)" },
  doneCard: { opacity: 0.6, borderColor: "rgba(16,185,129,0.3)" },
  flexCol: { flex: 1 },
  dayText: { color: "#6366F1", fontSize: 11, fontWeight: "700" },
  subjectText: { color: "white", fontSize: 16, fontWeight: "bold", marginTop: 2 },
  timeText: { color: "#6B7280", fontSize: 12, marginTop: 4 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: "#4B5563", justifyContent: "center", alignItems: "center" },
  checkedBox: { backgroundColor: "#10B981", borderColor: "#10B981" },
  checkIcon: { color: "white", fontSize: 12, fontWeight: "bold" }
});
