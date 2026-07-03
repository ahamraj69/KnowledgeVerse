import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  onBrowseCourses: () => void;
}

export default function ContinueLearningEmpty({
  onBrowseCourses,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#1F2937",
        borderRadius: 18,
        padding: 24,
        marginBottom: 20,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 50,
        }}
      >
        📚
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 15,
        }}
      >
        No Course In Progress
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          textAlign: "center",
          marginTop: 10,
          lineHeight: 22,
        }}
      >
        Start learning today and continue your journey anytime.
      </Text>

      <TouchableOpacity
        onPress={onBrowseCourses}
        style={{
          backgroundColor: "#2563EB",
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Browse Courses
        </Text>
      </TouchableOpacity>
    </View>
  );
}