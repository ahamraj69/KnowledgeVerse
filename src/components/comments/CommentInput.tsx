import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  // ✅ FIX: Properties updated to use your exact parameter requirements
  onSend: (text: string) => void | Promise<void>;
}

export default function CommentInput({ onSend }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const value = text.trim();
    if (!value || loading) return;

    try {
      setLoading(true);
      await onSend(value);
      setText("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#111827",
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
      }}
    >
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Write a comment..."
        placeholderTextColor="#9CA3AF"
        multiline
        editable={!loading}
        style={{
          color: "white",
          minHeight: 90,
          textAlignVertical: "top",
          fontSize: 15,
        }}
      />

      <TouchableOpacity
        disabled={loading}
        onPress={handleSubmit}
        style={{
          marginTop: 14,
          backgroundColor: "#2563EB", // ✅ OPTION A: Safe literal hex colors replace external lookup definitions
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {loading ? "Posting..." : "Post Comment"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
