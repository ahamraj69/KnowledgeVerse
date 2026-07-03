import { Text, View } from "react-native";
import { AISuggestion } from "../services/aiSuggestionService";

interface Props {
  suggestions: AISuggestion[];
}

export default function LearningPath({
  suggestions,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#111827",
        padding: 18,
        borderRadius: 16,
        marginBottom: 15,
      }}
    >
      {/* Title */}
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 12,
        }}
      >
        🧭 Your AI Learning Path
      </Text>

      {/* Path Items */}
      {suggestions.map((item, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            marginBottom: 12,
            alignItems: "flex-start",
          }}
        >
          {/* Step Number */}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "#2563EB",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {index + 1}
            </Text>
          </View>

          {/* Content */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              {item.title}
            </Text>

            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 12,
                marginTop: 3,
              }}
            >
              {item.reason}
            </Text>

            <Text
              style={{
                color:
                  item.priority === "high"
                    ? "#EF4444"
                    : item.priority === "medium"
                    ? "#F59E0B"
                    : "#22C55E",
                fontSize: 11,
                marginTop: 4,
                fontWeight: "600",
              }}
            >
              {item.priority.toUpperCase()} PRIORITY
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}