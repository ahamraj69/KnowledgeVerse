import { StyleSheet, Text, View } from "react-native";

export default function InterestChip({ name }: { title?: string; name: string; }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.text}>✨ {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { backgroundColor: "rgba(56,189,248,0.08)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "rgba(56,189,248,0.2)" },
  text: { color: "#38BDF8", fontSize: 13, fontWeight: "600" }
});
