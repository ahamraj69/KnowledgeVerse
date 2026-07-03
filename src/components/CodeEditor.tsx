import { useState } from "react";
import {
    Text,
    TextInput,
    View,
} from "react-native";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export default function CodeEditor({
  value,
  onChange,
}: Props) {
  const [lineNumbers] = useState(
    Array.from({ length: 50 }, (_, i) => i + 1)
  );

  return (
    <View
      style={{
        backgroundColor: "#0F172A",
        borderRadius: 12,
        padding: 12,
        flexDirection: "row",
        minHeight: 250,
      }}
    >
      {/* Line Numbers */}
      <View
        style={{
          paddingRight: 10,
        }}
      >
        {lineNumbers.map((num) => (
          <Text
            key={num}
            style={{
              color: "#64748B",
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            {num}
          </Text>
        ))}
      </View>

      {/* Editor */}
      <TextInput
        value={value}
        onChangeText={onChange}
        multiline
        placeholder="Write your code here..."
        placeholderTextColor="#64748B"
        style={{
          flex: 1,
          color: "#E2E8F0",
          fontSize: 14,
          lineHeight: 20,
          textAlignVertical: "top",
        }}
      />
    </View>
  );
}