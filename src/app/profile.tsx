import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext"; // Update context path relative to file location if needed

export default function ProfileScreen() {
  const { user } = useAuth() || { user: { displayName: "Student", email: "student@knowledgeverse.com" } };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1220" }}
      contentContainerStyle={{ padding: 25 }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        👤 Profile Management
      </Text>

      {/* User Information Summary Card */}
      <View
        style={{
          backgroundColor: "#1F2937",
          padding: 20,
          borderRadius: 16,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          {user?.displayName || "Student"}
        </Text>
        <Text style={{ color: "#9CA3AF", marginTop: 4 }}>
          {user?.email || "No email assigned"}
        </Text>
      </View>

      {/* ✅ STEP 2: Quick Profile Learning Analytics Access Shortcut */}
      <TouchableOpacity
        onPress={() => router.push("/analytics")}
        style={{
          backgroundColor: "#1F2937",
          padding: 14,
          borderRadius: 12,
          marginTop: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
          📊 View My Learning Stats
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
