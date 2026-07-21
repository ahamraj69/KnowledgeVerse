import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ResubmitCourseButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.text}>🔄 Commit Updates & Submit Again</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  text: { color: "white", fontSize: 15, fontWeight: "bold" }
});
