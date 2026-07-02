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

import { hasAccess } from "../../services/accessService";
import { getLessons } from "../../services/lessonService";
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

  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [selectedLesson, setSelectedLesson] =
    useState<Lesson | null>(null);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    try {
      const purchased = await hasAccess(id as string);

      setAccess(purchased);

      const data = await getLessons(id as string);

      setLessons(data);

      if (data.length > 0) {
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
                  marginBottom: 30,
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