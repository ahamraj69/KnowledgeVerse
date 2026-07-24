import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RetentionDataPoint } from "@/types/advancedAnalytics";

export default function RetentionChart({ data }: { data: RetentionDataPoint[] }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>📉 COHORT STICKINESS & RE-ENGAGEMENT RETENTION MATRIX</Text>
      {data.map((item, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.dayLabel}>{item.day}</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${item.percentage}%` }]} />
          </View>
          <Text style={styles.valueText}>{item.percentage}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: "#111827", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginBottom: 16 },
  title: { color: "white", fontSize: 13, fontWeight: "bold", marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  dayLabel: { color: "#9CA3AF", fontSize: 12, width: 50, fontWeight: "600" },
  barTrack: { flex: 1, height: 8, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: "#A855F7", borderRadius: 4 },
  valueText: { color: "white", fontSize: 12, width: 35, textAlign: "right", fontWeight: "bold" }
});
