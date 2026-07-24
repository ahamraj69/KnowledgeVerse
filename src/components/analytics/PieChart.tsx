import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ChartLegend from "./ChartLegend";

interface PieData { label: string; value: number; color: string }

export default function PieChart({ data, title }: { data: PieData[]; title: string }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;

  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.list}>
        {data.map((item, index) => {
          const pct = ((item.value / total) * 100).toFixed(0);
          return (
            <View key={index} style={styles.item}>
              <View style={styles.left}>
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.label}>{item.label}</Text>
              </View>
              <Text style={styles.val}>{pct}% ({item.value})</Text>
            </View>
          );
        })}
      </View>
      <ChartLegend items={data.map(d => ({ label: d.label, color: d.color }))} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: "#111827", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginBottom: 16 },
  title: { color: "white", fontSize: 14, fontWeight: "bold", marginBottom: 14 },
  list: { gap: 10 },
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  left: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { color: "#CBD5E1", fontSize: 13, fontWeight: "500" },
  val: { color: "white", fontSize: 13, fontWeight: "bold" }
});
