import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function NewChatButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.text}>+ Initialize New Study Chat</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { backgroundColor: "#2563EB", padding: 14, borderRadius: 12, alignItems: "center", justifyContent: "center", marginVertical: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  text: { color: "white", fontSize: 15, fontWeight: "bold" }
});
