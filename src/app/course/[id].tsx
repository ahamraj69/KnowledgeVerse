import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import VideoPlayer from "../../components/VideoPlayer";

import { useAuth } from "../../context/AuthContext";

import { hasAccess } from "../../services/accessService";
import { getLessons } from "../../services/lessonService";
import {
  completeLesson,
  getProgress,
  progressPercent,
} from "../../services/progressService";
import { payForCourse } from "../../services/razorpayService";
import { addToWishlist } from "../../services/wishlistService";

interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  pdfUrl: string;
}

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] =
    useState<Lesson | null>(null);

  const [completedLessons, setCompletedLessons] =
    useState<string[]>([]);

  const [progress, setProgress] = useState(0);

const [courseCompleted, setCourseCompleted] =
  useState(false);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      const purchased = await hasAccess(id as string);

      setAccess(purchased);

      const data = await getLessons(id as string);

      setLessons(data);

      if (user) {
        const saved = await getProgress(
          user.uid,
          id as string
        );

        setCompletedLessons(
          saved.completedLessons
        );

        const percent = progressPercent(
  saved.completedLessons.length,
  data.length
);

setProgress(percent);

setCourseCompleted(
  data.length > 0 &&
    saved.completedLessons.length === data.length
);

        const lastLesson = data.find(
          (lesson) =>
            lesson.id ===
            saved.lastLessonId
        );

        if (lastLesson) {
          setSelectedLesson(lastLesson);
        } else if (data.length > 0) {
          setSelectedLesson(data[0]);
        }
      } else if (data.length > 0) {
        setSelectedLesson(data[0]);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const buyCourse = async () => {
    try {
      await payForCourse(
        499,
        id as string,
        "teacher_123"
      );

      Alert.alert(
        "Success",
        "Course Purchased Successfully!"
      );

      setAccess(true);
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Payment Failed",
        "Unable to complete payment."
      );
    }
  };

  const wishlist = async () => {
    try {
      await addToWishlist(id as string);

      Alert.alert(
        "Wishlist",
        "Course added successfully ❤️"
      );
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Could not add course."
      );
    }
  };

  const markCompleted = async () => {
    if (!user || !selectedLesson) return;

    try {
      await completeLesson(
        user.uid,
        id as string,
        selectedLesson.id
      );

      const updated = [
        ...new Set([
          ...completedLessons,
          selectedLesson.id,
        ]),
      ];

      setCompletedLessons(updated);

      const percent = progressPercent(
  updated.length,
  lessons.length
);

setProgress(percent);

setCourseCompleted(
  lessons.length > 0 &&
    updated.length === lessons.length
);
      Alert.alert(
        "Completed",
        "Lesson marked as completed."
      );
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Could not save progress."
      );
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0B1220",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
          }}
        >
          Loading Course...
        </Text>
      </View>
    );
  }

  if (!access) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          padding: 20,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          📚 Course Details
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginTop: 15,
            marginBottom: 30,
          }}
        >
          Purchase this course to unlock all lessons.
        </Text>

        <TouchableOpacity
          onPress={wishlist}
          style={{
            backgroundColor: "#DC2626",
            padding: 15,
            borderRadius: 12,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            ❤️ Add to Wishlist
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={buyCourse}
          style={{
            backgroundColor: "#2563EB",
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            💳 Buy Course ₹499
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
    return (
    <FlatList
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
      }}
      contentContainerStyle={{
        padding: 20,
      }}
      data={lessons}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <>
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            🎓 Course Lessons
          </Text>

          <Text
  style={{
    color: "#10B981",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  }}
>
  📈 Progress: {progress}%
</Text>

<View
  style={{
    height: 12,
    backgroundColor: "#374151",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 25,
  }}
>
  <View
    style={{
      height: "100%",
      width: `${progress}%`,
      backgroundColor: "#10B981",
    }}
  />
</View>
{courseCompleted && (
  <View
    style={{
      backgroundColor: "#065F46",
      padding: 18,
      borderRadius: 12,
      marginBottom: 25,
    }}
  >
    <Text
      style={{
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      🎉 Course Completed!
    </Text>

    <Text
      style={{
        color: "#D1FAE5",
        textAlign: "center",
        marginTop: 10,
        fontSize: 16,
      }}
    >
      Congratulations! You have completed every lesson in this course.
    </Text>
  </View>
)}

          {selectedLesson && (
            <>
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <VideoPlayer
                  uri={selectedLesson.videoUrl}
                />
              </View>

              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: "bold",
                }}
              >
                {selectedLesson.title}
              </Text>

              <Text
                style={{
                  color: "#9CA3AF",
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                {selectedLesson.description}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    selectedLesson.pdfUrl
                  )
                }
                style={{
                  backgroundColor: "#2563EB",
                  padding: 15,
                  borderRadius: 12,
                  marginBottom: 15,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  📄 Open Lesson PDF
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={markCompleted}
                disabled={completedLessons.includes(
                  selectedLesson.id
                )}
                style={{
                  backgroundColor:
                    completedLessons.includes(
                      selectedLesson.id
                    )
                      ? "#6B7280"
                      : "#10B981",
                  padding: 15,
                  borderRadius: 12,
                  marginBottom: 25,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {completedLessons.includes(
                    selectedLesson.id
                  )
                    ? "✅ Lesson Completed"
                    : "✔ Mark Lesson Complete"}
                </Text>
              </TouchableOpacity>

              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: "bold",
                  marginBottom: 15,
                }}
              >
                Lessons
              </Text>
            </>
          )}
        </>
      )}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() =>
            setSelectedLesson(item)
          }
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
            {completedLessons.includes(item.id)
              ? "✅"
              : "📘"}{" "}
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
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View
          style={{
            marginTop: 100,
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