import { StyleSheet, Text, View } from "react-native";

export default function AdminComment({ comment }: { comment?: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>📝 ADMINISTRATIVE REMARKS</Text>
      <Text style={styles.text}>{comment ? comment : "No administrative comments posted yet."}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  box: { backgroundColor: "#111827", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginVertical: 8 },
  title: { color: "#6B7280", fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  text: { color: "#CBD5E1", fontSize: 14, lineHeight: 20, fontWeight: "500" }
});
