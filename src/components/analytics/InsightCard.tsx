import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function InsightCard({ insights }: { insights: string[] }) {
  return (
    <View style={styles.box}>
      <Text style={styles.heading}>💡 AUTOMATED TELEMETRY INSIGHTS</Text>
      {insights.map((insight, idx) => (
        <View key={idx} style={styles.row}>
          <Text style={styles.text}>{insight}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: "rgba(37,99,235,0.05)", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(37,99,235,0.2)", marginVertical: 14 },
  heading: { color: "#38BDF8", fontSize: 11, fontWeight: "800", letterSpacing: 0.5, marginBottom: 10 },
  row: { marginBottom: 8 },
  text: { color: "white", fontSize: 13, lineHeight: 20, fontWeight: "500" }
});
