import React from "react";
import { StyleSheet, Text, View, DimensionValue } from "react-native";

interface DataPoint { label: string; value: number }

export default function LineChart({ data, title }: { data: DataPoint[]; title: string }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartArea}>
        {data.map((item, index) => {
          // ✅ FIXED: Added inline string template type assertion to pass validation rules smoothly
          const barHeight = `${Math.min((item.value / maxVal) * 100, 100)}%` as DimensionValue;
          return (
            <View key={index} style={styles.column}>
              <View style={styles.track}>
                <View style={[styles.fill, { height: barHeight }]} />
              </View>
              <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: "#111827", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginBottom: 16 },
  title: { color: "white", fontSize: 14, fontWeight: "bold", marginBottom: 14 },
  chartArea: { height: 120, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 8, paddingTop: 10 },
  column: { flex: 1, alignItems: "center", height: "100%" },
  track: { flex: 1, width: 4, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 2, justifyContent: "flex-end", position: "relative" },
  fill: { width: "100%", backgroundColor: "#38BDF8", borderRadius: 2 },
  label: { color: "#6B7280", fontSize: 10, marginTop: 6, fontWeight: "600" }
});
