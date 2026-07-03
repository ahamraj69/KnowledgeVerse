import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl: string;
}

interface Props {
  lessons: Lesson[];
  selectedLesson: Lesson | null;
  completedLessons: string[];
  onSelectLesson: (lesson: Lesson) => void;
  onCompleteLesson: (lessonId: string) => void;
}

export default function LessonList({
  lessons,
  selectedLesson,
  completedLessons,
  onSelectLesson,
  onCompleteLesson,
}: Props) {
  return (
    <FlatList
      data={lessons}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      renderItem={({ item, index }) => {
        const completed =
          completedLessons.includes(item.id);

        return (
          <TouchableOpacity
            onPress={() => onSelectLesson(item)}
            style={{
              backgroundColor:
                selectedLesson?.id === item.id
                  ? "#2563EB"
                  : "#1F2937",
              padding: 18,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Lesson {index + 1}
            </Text>

            <Text
              style={{
                color: "white",
                marginTop: 5,
                fontSize: 16,
              }}
            >
              {item.title}
            </Text>

            <Text
              style={{
                color: "#D1D5DB",
                marginTop: 8,
              }}
              numberOfLines={2}
            >
              {item.description}
            </Text>

            <Text
              style={{
                color: completed
                  ? "#22C55E"
                  : "#F59E0B",
                marginTop: 10,
                fontWeight: "bold",
              }}
            >
              {completed
                ? "✅ Completed"
                : "⏳ Not Completed"}
            </Text>

            {!completed && (
              <TouchableOpacity
                onPress={() =>
                  onCompleteLesson(item.id)
                }
                style={{
                  backgroundColor: "#10B981",
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Mark Complete
                </Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={() => (
        <View
          style={{
            marginTop: 60,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 18,
            }}
          >
            No lessons available.
          </Text>
        </View>
      )}
    />
  );
}