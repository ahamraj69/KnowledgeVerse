import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CelebrationBanner({ text }: { text: string }) {
  return (
    <View style={styles.banner}>
      <Text style={styles.txt}>🎉 {text.toUpperCase()}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  banner: { backgroundColor: "rgba(16,185,129,0.1)", padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "#10B981", marginVertical: 8, alignItems: "center" },
  txt: { color: "#10B981", fontSize: 12, fontWeight: "800", letterSpacing: 0.5 }
});
