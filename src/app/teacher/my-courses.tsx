import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getCourses } from "../../services/courseListService";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

export default function MyCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#2563EB" />

        <Text
          style={{
            color: "white",
            marginTop: 15,
          }}
        >
          Loading Courses...
        </Text>
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
      data={courses}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={() => (
        <>
          <Text
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            📖 My Courses
          </Text>

          <Text
            style={{
              color: "#9CA3AF",
              marginBottom: 25,
            }}
          >
            Select a course to manage lessons.
          </Text>
        </>
      )}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/teacher/add-lesson",
              params: {
                courseId: item.id,
              },
            })
          }
          style={{
            backgroundColor: "#1F2937",
            padding: 18,
            borderRadius: 12,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            {item.title}
          </Text>

          <Text
            style={{
              color: "#9CA3AF",
              marginTop: 8,
            }}
          >
            {item.description}
          </Text>

          <View
            style={{
              marginTop: 15,
              backgroundColor: "#2563EB",
              padding: 10,
              borderRadius: 8,
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
              }}
            >
              ➕ Manage Lessons
            </Text>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <Text
          style={{
            color: "#9CA3AF",
            textAlign: "center",
            marginTop: 80,
          }}
        >
          No courses found.
        </Text>
      )}
    />
  );
}