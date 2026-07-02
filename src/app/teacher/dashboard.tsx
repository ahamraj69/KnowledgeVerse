import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function TeacherDashboard() {
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
          marginBottom: 5,
        }}
      >
        👨‍🏫 Teacher Dashboard
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginBottom: 30,
        }}
      >
        Manage your courses and students
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
        onPress={() => {}}
      />

      <Card
        title="Upload PDF"
        icon="📄"
        color="#F59E0B"
        onPress={() => {}}
      />

      <Card
        title="Students"
        icon="👨‍🎓"
        color="#0EA5E9"
        onPress={() => {}}
      />

      <Card
        title="Earnings"
        icon="💰"
        color="#22C55E"
        onPress={() => {}}
      />

      <Card
        title="Analytics"
        icon="📊"
        color="#EF4444"
        onPress={() => {}}
      />
    </ScrollView>
  );
}