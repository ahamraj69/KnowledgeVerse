import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function Home() {
  const router = useRouter();

  const Card = ({
    title,
    icon,
    color,
    onPress,
  }: {
    title: string;
    icon: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        padding: 18,
        borderRadius: 14,
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
        {icon} {title}
      </Text>
    </TouchableOpacity>
  );

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
        🚀 KnowledgeVerse
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 6,
          marginBottom: 30,
          fontSize: 16,
        }}
      >
        AI Learning Marketplace
      </Text>

      <Card
        title="AI Tutor"
        icon="🤖"
        color="#2563EB"
        onPress={() => router.push("/ai")}
      />

      <Card
        title="Browse Courses"
        icon="📚"
        color="#1F2937"
        onPress={() => router.push("/courses")}
      />

      <Card
        title="Teacher Dashboard"
        icon="👨‍🏫"
        color="#10B981"
        onPress={() => router.push("/teacher/dashboard")}
      />

      <Card
        title="My Profile"
        icon="👤"
        color="#7C3AED"
        onPress={() => router.push("/profile")}
      />

      <Card
        title="Wishlist"
        icon="❤️"
        color="#DC2626"
        onPress={() => router.push("/wishlist")}
      />

      <Card
        title="Notifications"
        icon="🔔"
        color="#F59E0B"
        onPress={() => router.push("/notifications")}
      />

      <Card
        title="Settings"
        icon="⚙️"
        color="#374151"
        onPress={() => router.push("/settings")}
      />

      <Card
        title="Logout"
        icon="🚪"
        color="#EF4444"
        onPress={() => router.push("/login")}
      />
    </ScrollView>
  );
}