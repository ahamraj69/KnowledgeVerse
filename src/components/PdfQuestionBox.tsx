import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  loading: boolean;
  onSend(question: string): void;
}

export default function PdfQuestionBox({
  loading,
  onSend,
}: Props) {
  const [question, setQuestion] =
    useState("");

  const send = () => {
    if (!question.trim()) return;

    onSend(question.trim());

    setQuestion("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={question}
        onChangeText={setQuestion}
        placeholder="Ask about this PDF..."
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={send}
      >
        <Text style={styles.buttonText}>
          Send
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  input: {
    backgroundColor: "#1F2937",
    color: "white",
    borderRadius: 10,
    padding: 14,
    minHeight: 60,
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});