import { useEffect, useState } from "react";
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useRouter } from "expo-router";
import { getMyCourses } from "../../services/myCourseService";

export default function MyCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await getMyCourses();
    setCourses(data);
  };

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
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        📖 My Courses
      </Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text
            style={{
              color: "#9CA3AF",
              textAlign: "center",
              marginTop: 40,
            }}
          >
            You haven't created any courses yet.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
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
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {item.title}
            </Text>

            <Text
              style={{
                color: "#9CA3AF",
                marginTop: 6,
              }}
            >
              ₹ {item.price}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}