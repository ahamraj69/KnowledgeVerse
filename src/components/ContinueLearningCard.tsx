import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  progress: number;
  onContinue: (courseId: string) => void;
}

export default function ContinueLearningCard({
  courseId,
  courseTitle,
  lessonTitle,
  progress,
  onContinue,
}: Props) {
  return (
    <View
      style={{
        backgroundColor: "#1E3A8A",
        borderRadius: 22, // Phase 11.5.4.8 UI Polish
        padding: 22,        // Phase 11.5.4.8 UI Polish
        marginBottom: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        Continue Learning
      </Text>

      <Text style={{ color: "#E5E7EB", marginTop: 12, fontSize: 16 }}>Course</Text>
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>{courseTitle}</Text>

      <Text style={{ color: "#E5E7EB", marginTop: 12, fontSize: 16 }}>Last Lesson</Text>
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>{lessonTitle}</Text>

      <View style={{ marginTop: 18 }}>
        <Text style={{ color: "#E5E7EB", marginBottom: 6 }}>Progress</Text>

        <View
          style={{
            height: 10, // Phase 11.5.4.8 UI Polish
            backgroundColor: "#374151",
            borderRadius: 20, // Phase 11.5.4.8 UI Polish
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
              height: "100%",
              backgroundColor: "#22C55E",
            }}
          />
        </View>

        <Text style={{ color: "white", marginTop: 6, fontWeight: "bold" }}>{progress}%</Text>
      </View>

      <TouchableOpacity
        onPress={() => onContinue(courseId)}
        style={{
          backgroundColor: "#2563EB",
          paddingVertical: 14, // Phase 11.5.4.8 UI Polish
          borderRadius: 12,     // Phase 11.5.4.8 UI Polish
          marginTop: 15,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
          ▶ Resume
        </Text>
      </TouchableOpacity>
    </View>
  );
}
