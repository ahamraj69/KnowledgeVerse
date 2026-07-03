import { Text, View } from "react-native";

interface Props {
  progress: number;
  courseCompleted: boolean;
}

export default function ProgressCard({
  progress,
  courseCompleted,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#111827",
        borderRadius: 14,
        padding: 18,
        marginBottom: 25,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        📈 Course Progress
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 10,
          marginBottom: 15,
          fontSize: 16,
        }}
      >
        {progress}% Completed
      </Text>

      {/* Progress Bar Background */}
      <View
        style={{
          height: 12,
          backgroundColor: "#374151",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {/* Progress Fill */}
        <View
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#22C55E",
          }}
        />
      </View>

      {courseCompleted && (
        <View
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#065F46",
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            🎉 Congratulations!
          </Text>

          <Text
            style={{
              color: "#D1FAE5",
              textAlign: "center",
              marginTop: 8,
              fontSize: 15,
            }}
          >
            You have successfully completed this course.
          </Text>
        </View>
      )}
    </View>
  );
}