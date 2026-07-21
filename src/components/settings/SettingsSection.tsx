import { StyleSheet, Text, View } from "react-native";

export default function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  section: { marginBottom: 22 },
  title: { color: "#38BDF8", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, paddingLeft: 4 },
  inner: { backgroundColor: "#111827", borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" }
});
