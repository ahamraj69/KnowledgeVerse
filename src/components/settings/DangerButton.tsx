import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function DangerButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: { backgroundColor: "rgba(239,68,68,0.08)", paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center", marginVertical: 6, borderWidth: 1, borderColor: "rgba(239,68,68,0.25)" },
  text: { color: "#EF4444", fontSize: 15, fontWeight: "bold" }
});
