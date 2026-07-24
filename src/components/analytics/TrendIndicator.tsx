import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TrendIndicator({ change, isPositive }: { change: number; isPositive: boolean }) {
  const color = isPositive ? "#10B981" : "#EF4444";
  const icon = isPositive ? "↑" : "↓";

  return (
    <View style={[styles.box, { backgroundColor: `${color}15`, borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{icon} {Math.abs(change)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, borderWidth: 1, alignSelf: "flex-start" },
  text: { fontSize: 11, fontWeight: "800", letterSpacing: 0.2 }
});
