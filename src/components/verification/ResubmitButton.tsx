import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ResubmitButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.text}>🔄 Resubmit Verification Documents</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 20 },
  text: { color: "white", fontSize: 15, fontWeight: "bold" }
});
