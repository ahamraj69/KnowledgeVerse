import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../../context/AuthContext";

export default function TeacherDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: "#0B1220",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        🎓 Teacher Dashboard
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          fontSize: 16,
          marginBottom: 30,
        }}
      >
        Welcome {user?.email}
      </Text>

      {/* Create Course */}
      <TouchableOpacity
        onPress={() => router.push("/teacher/create-course")}
        style={{
          backgroundColor: "#2563EB",
          padding: 16,
          borderRadius: 10,
          marginBottom: 15,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          ➕ Create Course
        </Text>
      </TouchableOpacity>

      {/* My Courses */}
      <TouchableOpacity
        onPress={() => router.push("/courses")}
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
            fontWeight: "bold",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          📚 View Courses
        </Text>
      </TouchableOpacity>

      {/* AI Tutor */}
      <TouchableOpacity
        onPress={() => router.push("/ai")}
        style={{
          backgroundColor: "#10B981",
          padding: 16,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          🤖 Open AI Tutor
        </Text>
      </TouchableOpacity>
    </View>
  );
}