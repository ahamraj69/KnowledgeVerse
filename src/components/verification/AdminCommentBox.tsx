import { StyleSheet, Text, TextInput, View } from "react-native";

export default function AdminCommentBox({ value, onChange }: { value: string; onChange: (text: string) => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>📝 REVIE COMMENT LOG</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter evaluation remarks (e.g. Government ID is unclear)..."
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
  container: { marginVertical: 14 },
  label: { color: "#9CA3AF", fontSize: 11, fontWeight: "700", marginBottom: 6, letterSpacing: 0.5 },
  input: { backgroundColor: "#111827", borderRadius: 10, padding: 12, color: "white", fontSize: 14, minHeight: 70, textAlignVertical: "top", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" }
});
