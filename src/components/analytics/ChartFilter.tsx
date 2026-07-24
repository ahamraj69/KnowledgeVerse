import React from "react";
import { StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";

export type TimePeriod = "today" | "7days" | "30days" | "90days" | "year" | "all";

interface FilterProps {
  selected: TimePeriod;
  onSelect: (period: TimePeriod) => void;
}

const periods: { key: TimePeriod; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7days", label: "7 Days" },
  { key: "30days", label: "30 Days" },
  { key: "90days", label: "90 Days" },
  { key: "year", label: "This Year" },
  { key: "all", label: "All Time" }
];

export default function ChartFilter({ selected, onSelect }: FilterProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.content}>
      {periods.map((p) => {
        const isActive = selected === p.key;
        return (
          <TouchableOpacity key={p.key} style={[styles.btn, isActive && styles.activeBtn]} onPress={() => onSelect(p.key)} activeOpacity={0.75}>
            <Text style={[styles.text, isActive && styles.activeText]}>{p.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginVertical: 12, maxHeight: 40 },
  content: { gap: 8, paddingHorizontal: 2 },
  btn: { paddingVertical: 6, paddingHorizontal: 14, backgroundColor: "#111827", borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  activeBtn: { backgroundColor: "rgba(56,189,248,0.12)", borderColor: "#38BDF8" },
  text: { color: "#6B7280", fontSize: 13, fontWeight: "600" },
  activeText: { color: "#38BDF8", fontWeight: "700" }
});
