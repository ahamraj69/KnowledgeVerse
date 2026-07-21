import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { Question } from "@/lib/quizService";

interface Props {
  question: Question;
  index: number;
  onSelect: (isCorrect: boolean) => void;
}

export default function QuestionCard({
  question,
  index,
  onSelect,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return; // prevent re-answer

    setSelected(optionIndex);

    const isCorrect = optionIndex === question.answer;

    onSelect(isCorrect);
  };

  return (
    <View
      style={{
        backgroundColor: "#1F2937",
        padding: 18,
        borderRadius: 16,
        marginBottom: 20,
      }}
    >
      {/* Question */}
      <Text
        style={{
          color: "#9CA3AF",
          marginBottom: 8,
        }}
      >
        Question {index + 1}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 15,
        }}
      >
        {question.question}
      </Text>

      {/* Options */}
      {question.options.map((opt, i) => {
        const isSelected = selected === i;
        const isCorrect = question.answer === i;

        let bg = "#374151";

        if (selected !== null) {
          if (isCorrect) bg = "#16A34A"; // correct green
          else if (isSelected) bg = "#DC2626"; // wrong red
        }

        return (
          <TouchableOpacity
            key={i}
            onPress={() => handleSelect(i)}
            style={{
              backgroundColor: bg,
              padding: 12,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "white" }}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}