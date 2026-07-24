import React from "react";
import { StyleSheet, Text, View, DimensionValue } from "react-native";

interface AreaData { label: string; value: number }

export default function AreaChart({ data, title }: { data: AreaData[]; title: string }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartArea}>
        {data.map((item, index) => {
          // ✅ FIXED: Explicit DimensionValue type assignment removes compilation overloading errors
          const fillPct = `${Math.min((item.value / maxVal) * 100, 100)}%` as DimensionValue;
          return (
            <View key={index} style={styles.column}>
              <View style={[styles.fill, { height: fillPct }]} />
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
  // ✅ FIXED: Substituted shorthand pt with the fully qualified paddingTop type property name
  chartArea: { height: 100, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 4, paddingTop: 10 },
  column: { flex: 1, alignItems: "center", height: "100%", justifyContent: "flex-end" },
  fill: { width: "100%", backgroundColor: "rgba(16,185,129,0.2)", borderTopWidth: 2, borderTopColor: "#10B981" },
  label: { color: "#6B7280", fontSize: 9, marginTop: 6, fontWeight: "600" }
});
