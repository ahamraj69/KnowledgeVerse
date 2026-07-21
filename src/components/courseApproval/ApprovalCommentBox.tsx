import { StyleSheet, Text, TextInput, View } from "react-native";

export default function ApprovalCommentBox({ value, onChange }: { value: string; onChange: (t: string) => void }) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>📝 REVIE / MODERATION NOTES LOG</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter prescriptive remarks or decision logs context indices..."
        placeholderTextColor="#4B5563"
        value={value}
        onChangeText={onChange}
        multiline
        numberOfLines={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { marginVertical: 14 },
  label: { color: "#6B7280", fontSize: 11, fontWeight: "800", letterSpacing: 0.5, marginBottom: 6 },
  input: { backgroundColor: "#111827", borderRadius: 12, padding: 14, color: "white", fontSize: 14, minHeight: 80, textAlignVertical: "top", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }
});
