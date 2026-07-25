import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Verse } from "@/types/verse";
import { BrandColors } from "@/theme/colors";

export default function DailyVerseCard({ verse }: { verse: Verse }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.badge}>🌟 VERSE OF THE DAY</Text>
        <Text style={styles.category}>#{verse.category.toUpperCase()}</Text>
      </View>
      <Text style={styles.message}>"{verse.message}"</Text>
      <Text style={styles.author}>— {verse.author || "KnowledgeVerse"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#111827", padding: 18, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: "#38BDF8", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginBottom: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  badge: { color: "#38BDF8", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  category: { color: "#6B7280", fontSize: 10, fontWeight: "700" },
  message: { color: "#E2E8F0", fontSize: 15, lineHeight: 22, fontWeight: "600", fontStyle: "italic" },
  author: { color: "#6B7280", fontSize: 12, textAlign: "right", marginTop: 8, fontWeight: "600" }
});
