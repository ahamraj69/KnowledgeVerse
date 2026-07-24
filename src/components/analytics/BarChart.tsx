import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BarData { label: string; value: number; color?: string }

export default function BarChart({ data, title }: { data: BarData[]; title: string }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.main}>
        {data.map((item, i) => {
          const pct = Math.min((item.value / maxVal) * 100, 100);
          return (
            <View key={i} style={styles.row}>
              <Text style={styles.lbl} numberOfLines={1}>{item.label}</Text>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${pct}%`, backgroundColor: item.color || "#2563EB" }]} />
              </View>
              <Text style={styles.val}>{item.value}</Text>
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
  main: { gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  lbl: { color: "#9CA3AF", fontSize: 12, width: 75, fontWeight: "500" },
  track: { flex: 1, height: 10, backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 5, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 5 },
  val: { color: "white", fontSize: 12, width: 25, textAlign: "right", fontWeight: "bold" }
});
