import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
} from "react-native";

import { askPDF } from "@/lib/aiTools";

export default function AIPDF() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleAsk() {
    const res = await askPDF(question, "current-pdf");
    setAnswer(res.answer);
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        AI PDF Tutor
      </Text>

      <TextInput
        placeholder="Ask about your PDF..."
        value={question}
        onChangeText={setQuestion}
        style={{
          borderWidth: 1,
          marginVertical: 20,
          padding: 12,
          borderRadius: 10,
        }}
      />

      <Button
        title="Ask AI"
        onPress={handleAsk}
      />

      <Text
        style={{
          marginTop: 30,
          fontSize: 16,
        }}
      >
        {answer}
      </Text>
    </ScrollView>
  );
}