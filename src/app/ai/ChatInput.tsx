import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ChatInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  editable?: boolean;
}

export default function ChatInput({ value, onChange, onSend, editable = true }: ChatInputProps) {
  return (
    <View style={styles.row}>
      <TextInput
        style={[styles.input, !editable && styles.disabledInput]}
        placeholder="Ask KnowledgeVerse AI..."
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChange}
        editable={editable}
        multiline={true}
        maxLength={1000}
      />
      <TouchableOpacity
        style={[styles.button, (!value.trim() || !editable) && styles.disabledButton]}
        onPress={onSend}
        disabled={!value.trim() || !editable}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#0B1220",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    maxHeight: 120,
  },
  disabledInput: {
    opacity: 0.6,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    height: 48,
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: "#1F2937",
    opacity: 0.5,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});
