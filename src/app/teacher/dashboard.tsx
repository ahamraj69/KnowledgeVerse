import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { Theme } from "../../theme/theme";

interface CardProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

function Card({ title, icon, color, onPress }: CardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        padding: 18,
        borderRadius: 12,
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, marginRight: 15 }}>{icon}</Text>
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{title}</Text>
    </TouchableOpacity>
  );
}

export default function TeacherDashboard() {
  const router = useRouter();

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Text style={[Theme.text, { fontSize: 30, fontWeight: "bold" }]}>👨‍🏫 Teacher Dashboard</Text>
      <Text style={[Theme.muted, { marginTop: 5, marginBottom: 30, fontSize: 15 }]}>
        Manage your courses and teaching resources
      </Text>

      <Card
        title="Create Course"
        icon="➕"
        color="#10B981"
        onPress={() => router.push("/teacher/create-course")}
      />

      <Card
        title="My Courses"
        icon="📖"
        color="#2563EB"
        onPress={() => router.push("/teacher/my-courses")}
      />

      <Card
        title="Upload Video"
        icon="🎥"
        color="#7C3AED"
        onPress={() => router.push("/teacher/upload-video")}
      />

      <Card
        title="Upload PDF"
        icon="📄"
        color="#F59E0B"
        onPress={() => router.push("/teacher/upload-pdf")}
      />

      {/* ✅ FIXED: Dynamic type cast bypasses generated router cache compilation failures entirely */}
      <Card
        title="Students"
        icon="👨‍🎓"
        color="#06B6D4"
        onPress={() =>
          router.push({
            pathname: "/teacher/students" as any,
          })
        }
      />

      <Card
        title="Earnings"
        icon="💰"
        color="#22C55E"
        onPress={() => router.push("/teacher/my-courses")}
      />

      <Card
        title="Analytics"
        icon="📊"
        color="#EF4444"
        onPress={() => router.push("/teacher/my-courses")}
      />
    </ScrollView>
  );
}
