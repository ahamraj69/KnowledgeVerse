import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ActionButton({ title, type, onPress }: { title: string; type: "warn" | "suspend" | "ban"; onPress: () => void }) {
  const stylesMap = { warn: styles.warn, suspend: styles.suspend, ban: styles.ban };
  return (
    <TouchableOpacity style={[styles.btn, stylesMap[type]]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  warn: { backgroundColor: "#D97706" },
  suspend: { backgroundColor: "#4B5563" },
  ban: { backgroundColor: "#EF4444" },
  text: { color: "white", fontSize: 13, fontWeight: "bold" }
});
