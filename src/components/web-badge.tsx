import { StyleSheet, Text, View } from "react-native";

interface WebBadgeProps {
  label: string;
}

export default function WebBadge({ label }: WebBadgeProps) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  text: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
