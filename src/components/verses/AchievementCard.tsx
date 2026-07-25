import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "@/types/badge";

export default function AchievementCard({ badge, unlocked }: { badge: Badge; unlocked: boolean }) {
  return (
    <View style={[styles.card, !unlocked && styles.lockedCard]}>
      <Text style={[styles.icon, !unlocked && styles.lockedIcon]}>{badge.icon}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{badge.name}</Text>
        <Text style={styles.desc}>{badge.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#111827", padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", gap: 14 },
  lockedCard: { opacity: 0.4, backgroundColor: "rgba(17,24,39,0.5)", borderStyle: "dashed" },
  icon: { fontSize: 28 },
  lockedIcon: { grayscale: 1 } as any,
  info: { flex: 1 },
  name: { color: "white", fontSize: 14, fontWeight: "bold" },
  desc: { color: "#6B7280", fontSize: 12, marginTop: 2 }
});
