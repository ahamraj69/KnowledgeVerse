import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <View style={styles.container}>
      {items.map((item, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 10, justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { color: "#9CA3AF", fontSize: 12, fontWeight: "500" }
});
