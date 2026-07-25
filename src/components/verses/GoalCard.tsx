import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DailyStudyGoal } from "@/types/verse";

export default function GoalCard({ goals }: { goals: DailyStudyGoal }) {
  const checklistItems = [
    { label: `Complete ${goals.lessonsTarget} Lesson`, done: goals.lessonsCompleted >= goals.lessonsTarget },
    { label: `Solve ${goals.quizzesTarget} Practice Quiz`, done: goals.quizzesCompleted >= goals.quizzesTarget },
    { label: `Ask AI Tutor ${goals.aiQuestionsTarget} Inquiries`, done: goals.aiQuestionsCompleted >= goals.aiQuestionsTarget },
    { label: `Maintain Focus for ${goals.studyMinutesTarget} Minutes`, done: Math.round(goals.studyMinutesCompleted) >= goals.studyMinutesTarget }
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>🎯 TODAY'S ACADEMIC TARGETS</Text>
      <View style={styles.list}>
        {checklistItems.map((item, idx) => (
          <View key={idx} style={styles.row}>
            <Text style={[styles.checkbox, item.done && styles.checkboxActive]}>
              {item.done ? "✅" : "⬜"}
            </Text>
            <Text style={[styles.label, item.done && styles.labelDone]}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginBottom: 14 },
  title: { color: "#A855F7", fontSize: 11, fontWeight: "800", letterSpacing: 0.5, marginBottom: 12 },
  list: { gap: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: { fontSize: 14 },
  checkboxActive: { opacity: 1 },
  label: { color: "#CBD5E1", fontSize: 14, fontWeight: "500" },
  labelDone: { color: "#4B5563", textDecorationLine: "line-through" }
});
