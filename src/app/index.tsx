import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { getUserRole } from "../services/userService";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (user) {
      getUserRole(user.uid).then(setRole);
    }
  }, [user]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 26, fontWeight: "bold" }}>
        🚀 KnowledgeVerse
      </Text>

      <Text style={{ color: "#9CA3AF", marginTop: 10 }}>
        AI + Learning Marketplace Platform
      </Text>

      {/* AI BUTTON */}
      <TouchableOpacity
        onPress={() => router.push("/ai")}
        style={{
          marginTop: 30,
          backgroundColor: "#2563EB",
          padding: 15,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white" }}>🤖 Open AI Tutor</Text>
      </TouchableOpacity>

      {/* COURSES */}
      <TouchableOpacity
        onPress={() => router.push("/courses")}
        style={{
          marginTop: 15,
          backgroundColor: "#1F2937",
          padding: 15,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white" }}>📚 Browse Courses</Text>
      </TouchableOpacity>

      {/* TEACHER DASHBOARD */}
      {role === "teacher" && (
        <TouchableOpacity
          onPress={() => router.push("/teacher/dashboard")}
          style={{
            marginTop: 15,
            backgroundColor: "#10B981",
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white" }}>🏫 Teacher Dashboard</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}