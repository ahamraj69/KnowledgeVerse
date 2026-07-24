import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TeacherPerformanceRow } from "@/types/advancedAnalytics";

export default function TeacherLeaderboard({ data }: { data: TeacherPerformanceRow[] }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>🏆 INSTRUCTOR PERFORMANCE LEADERBOARD</Text>
      <View style={styles.header}>
        <Text style={[styles.headTxt, styles.flexName]}>Instructor Name</Text>
        <Text style={styles.headTxt}>Students</Text>
        <Text style={styles.headTxt}>Rating</Text>
      </View>
      {data.map((item, idx) => (
        <View key={item.teacherId || idx} style={styles.row}>
          <Text style={[styles.bodyTxt, styles.flexName]} numberOfLines={1}>
            {idx + 1}. {item.displayName}
          </Text>
          <Text style={styles.bodyTxt}>{item.studentsCount}</Text>
          <Text style={[styles.bodyTxt, styles.ratingTxt]}>⭐ {item.averageRating.toFixed(1)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: "#111827", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginBottom: 16 },
  title: { color: "white", fontSize: 13, fontWeight: "bold", marginBottom: 12 },
  header: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)", paddingBottom: 6, marginBottom: 8 },
  headTxt: { color: "#6B7280", fontSize: 11, fontWeight: "700", width: 60, textAlign: "right" },
  flexName: { flex: 1, textAlign: "left" },
  row: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.02)", alignItems: "center" },
  bodyTxt: { color: "white", fontSize: 13, fontWeight: "500", width: 60, textAlign: "right" },
  ratingTxt: { color: "#F59E0B" }
});
