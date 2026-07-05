import { router } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function Card({
  title,
  icon,
  color,
  onPress,
}: {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          marginRight: 15,
        }}
      >
        {icon}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
      }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 30,
          fontWeight: "bold",
        }}
      >
        Welcome Back 👋
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 6,
          marginBottom: 24,
        }}
      >
        Continue learning and explore all KnowledgeVerse features.
      </Text>

      {/* Dashboard */}
      <View
        style={{
          backgroundColor: "#111827",
          borderRadius: 15,
          padding: 18,
          marginBottom: 25,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          📊 Smart Dashboard
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginTop: 8,
          }}
        >
          View analytics, quizzes, assignments,
          certificates and learning progress.
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/analytics")}
          style={{
            marginTop: 15,
            backgroundColor: "#2563EB",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            Open Dashboard
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          color: "white",
          fontSize: 22,
          fontWeight: "bold",
          marginBottom: 15,
        }}
      >
        Explore
      </Text>

      <Card
        title="Courses"
        icon="📚"
        color="#2563EB"
        onPress={() => router.push("/courses")}
      />

      <Card
        title="Bookmarks"
        icon="🔖"
        color="#059669"
        onPress={() => router.push("/bookmarks")}
      />

      <Card
        title="Wishlist"
        icon="❤️"
        color="#DC2626"
        onPress={() => router.push("/wishlist")}
      />

      <Card
        title="Continue Learning"
        icon="▶️"
        color="#7C3AED"
        onPress={() => router.push("/continue-learning")}
      />

      <Card
        title="Recently Viewed"
        icon="🕒"
        color="#EA580C"
        onPress={() => router.push("/recently-viewed")}
      />

      <Card
        title="Assignments"
        icon="📝"
        color="#0891B2"
        onPress={() => router.push("/assignment")}
      />

      <Card
        title="Analytics"
        icon="📊"
        color="#0EA5E9"
        onPress={() => router.push("/analytics")}
      />

      <Card
        title="Certificates"
        icon="🏆"
        color="#CA8A04"
        onPress={() => router.push("/certificate")}
      />

      <Card
        title="Profile"
        icon="👤"
        color="#374151"
        onPress={() => router.push("/profile")}
      />
    </ScrollView>
  );
}