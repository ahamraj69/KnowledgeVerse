import { StyleSheet, Text, View } from "react-native";

export default function VerifiedBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>✔️ VERIFIED TEACHER</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "rgba(16,185,129,0.12)",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
    alignSelf: "flex-start",
  },
  text: {
    color: "#10B981",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
});
