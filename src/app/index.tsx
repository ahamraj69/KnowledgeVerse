import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Mock component placeholders for system compatibility
// Replace these with your actual local component paths if needed
function Card({ title, icon, color, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        padding: 16,
        borderRadius: 14,
        marginVertical: 8,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, marginRight: 12 }}>{icon}</Text>
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1220" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Welcome Title Area */}
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Welcome back 👋
      </Text>

      {/* ✅ STEP 3: Smart Dashboard Shortcut Widget (Home Top) */}
      <View
        style={{
          backgroundColor: "#111827",
          padding: 15,
          borderRadius: 14,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
          📊 Quick Insight
        </Text>

        <Text style={{ color: "#9CA3AF", marginTop: 5 }}>
          Track your progress, quizzes, and assignments in one place.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/analytics")}
          style={{
            marginTop: 10,
            backgroundColor: "#2563EB",
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Open Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grid Menu Section Container */}
      <Text
        style={{
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        Explore Sections
      </Text>

      {/* Existing navigation cards flow... */}

      {/* ✅ STEP 1: Analytics Dashboard Navigation Card */}
      <Card
        title="Analytics"
        icon="📊"
        color="#0EA5E9"
        onPress={() => router.push("/analytics")}
      />
    </ScrollView>
  );
}
