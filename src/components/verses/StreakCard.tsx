import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StreakCardProps {
  streak: number;
  encouragement: string;
}

export default function StreakCard({ streak, encouragement }: StreakCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <View>
          <Text style={styles.value}>{streak} Day Learning Streak</Text>
          <Text style={styles.sub}>{encouragement}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "rgba(245,158,11,0.04)", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(245,158,11,0.2)", marginBottom: 14 },
  left: { flexDirection: "row", alignItems: "center", gap: 14 },
  fireEmoji: { fontSize: 32 },
  value: { color: "white", fontSize: 16, fontWeight: "bold" },
  sub: { color: "#D1D5DB", fontSize: 12, marginTop: 2, lineHeight: 18, paddingRight: 24, fontWeight: "500" }
});
