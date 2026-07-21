import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TeacherDashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listScrollContent}>
      <Text style={styles.sectionTitle}>Instructor Console</Text>
      
      <View style={styles.quickGrid}>
        <View style={styles.quickCard}>
          <Text style={styles.quickIcon}>?????</Text>
          <Text style={styles.statsValue}>1,250</Text>
          <Text style={styles.quickText}>Active Students</Text>
        </View>
        
        <View style={styles.quickCard}>
          <Text style={styles.quickIcon}>??</Text>
          <Text style={styles.statsValue}>18</Text>
          <Text style={styles.quickText}>Total Courses</Text>
        </View>

        <View style={styles.quickCard}>
          <Text style={styles.quickIcon}>??</Text>
          <Text style={styles.statsValue}>95</Text>
          <Text style={styles.quickText}>Published Lessons</Text>
        </View>

        <View style={styles.quickCard}>
          <Text style={styles.quickIcon}>?</Text>
          <Text style={styles.statsValue}>4.9</Text>
          <Text style={styles.quickText}>Course Rating</Text>
        </View>
      </View>

      <View style={styles.metaPaddingCard}>
        <Text style={styles.courseTitle}>?? Completion Velocity</Text>
        <Text style={styles.recommendTeacherText}>87% of enrolled students successfully finish syllabus milestones.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  listScrollContent: { padding: 16, paddingBottom: 40 },
  sectionTitle: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 15 },
  quickCard: { width: "48%", backgroundColor: "#111827", borderRadius: 18, paddingVertical: 22, alignItems: "center", marginBottom: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  quickIcon: { fontSize: 34 },
  statsValue: { color: "#FFFFFF", fontSize: 24, fontWeight: "bold", marginTop: 6 },
  quickText: { color: "#9CA3AF", fontWeight: "600", marginTop: 6, fontSize: 13 },
  metaPaddingCard: { backgroundColor: "#111827", padding: 18, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  courseTitle: { fontSize: 16, fontWeight: "bold", color: "white" },
  recommendTeacherText: { color: "#94A3B8", fontSize: 13, marginTop: 6 }
});
