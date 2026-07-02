import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getCourses } from "../services/courseListService";

export default function Courses() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
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
        <ActivityIndicator color="white" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        📚 Courses
      </Text>

      {courses.map((course) => (
        <TouchableOpacity
          key={course.id}
          onPress={() => router.push(`/course/${course.id}`)}
          style={{
            backgroundColor: "#1F2937",
            padding: 16,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {course.title}
          </Text>

          <Text style={{ color: "#9CA3AF", marginTop: 5 }}>
            ₹{course.price}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}