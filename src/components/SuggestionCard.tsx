import { Text, View } from "react-native";

import { AISuggestion } from "@/lib/aiSuggestionService";

interface Props {
  suggestion: AISuggestion;
}

export default function SuggestionCard({
  suggestion,
}: Props) {
  const getColor = () => {
    if (suggestion.priority === "high")
      return "#EF4444"; // red
    if (suggestion.priority === "medium")
      return "#F59E0B"; // yellow
    return "#22C55E"; // green
  };

  return (
    <View
      style={{
        backgroundColor: "#1F2937",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: getColor(),
      }}
    >
      {/* Title */}
      <Text
        style={{
          color: "white",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        🧠 {suggestion.title}
      </Text>

      {/* Reason */}
      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 6,
          fontSize: 13,
        }}
      >
        {suggestion.reason}
      </Text>

      {/* Priority */}
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            color: getColor(),
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          Priority: {suggestion.priority.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}