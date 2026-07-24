import { StyleSheet, Text, View } from "react-native";

export default function AnalyticsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.grid}>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { color: "#38BDF8", fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, paddingLeft: 2 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" }
});
