import { useState } from "react";
import {
    Button,
    Text,
    TextInput,
    View,
} from "react-native";

import { generateQuiz } from "@/lib/aiTools";

export default function QuizGenerator() {
  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState("");

  async function handleQuiz() {
    const res =
      await generateQuiz(
        topic,
        "medium"
      );

    setQuiz(res.quiz);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Quiz Topic"
        value={topic}
        onChangeText={setTopic}
      />

      <Button
        title="Generate Quiz"
        onPress={handleQuiz}
      />

      <Text>{quiz}</Text>
    </View>
  );
}