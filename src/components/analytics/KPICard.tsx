import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { KPITrendData } from "@/types/executiveAnalytics";
import TrendIndicator from "./TrendIndicator";

interface KPICardProps {
  label: string;
  kpi: KPITrendData;
}

export default function KPICard({ label, kpi }: KPICardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{kpi.currentValue}</Text>
        <TrendIndicator change={kpi.percentageChange} isPositive={kpi.isPositiveTrend} />
      </View>
      <Text style={styles.prevText}>Previous cycle base entry: {kpi.previousValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", backgroundColor: "#111827", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", gap: 6, position: "relative" },
  label: { color: "#6B7280", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.3 },
  valueRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  value: { color: "white", fontSize: 20, fontWeight: "bold" },
  prevText: { color: "#4B5563", fontSize: 10, fontWeight: "500", marginTop: 2 }
});
