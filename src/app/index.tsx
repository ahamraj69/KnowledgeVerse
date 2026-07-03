import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

import ContinueLearningCard from "../components/ContinueLearningCard";
import ContinueLearningEmpty from "../components/ContinueLearningEmpty";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  // Step 1: Destructure user AND loading from auth context
  const { user, loading, logout } = useAuth();

  // Temporary mock state placeholder for development
  const continueLearning = null;

  // Step 1: Handle authentication redirection carefully alongside the loading state
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user, loading]);

  const continueCourse = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const browseCourses = () => {
    router.push("/courses");
  };

  // Step 1: Prevent component content from flashing before context resolves
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0B1220", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

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
          marginTop: 5,
          marginBottom: 30,
          fontSize: 16,
        }}
      >
        AI Learning Marketplace
      </Text>

      {continueLearning ? (
        <ContinueLearningCard
          courseId={continueLearning.courseId}
          courseTitle={continueLearning.courseTitle}
          lessonTitle={continueLearning.lessonTitle}
          progress={continueLearning.progress}
          onContinue={continueCourse}
        />
      ) : (
        <ContinueLearningEmpty onBrowseCourses={browseCourses} />
      )}

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
        onPress={async () => {
          try {
            await logout();
            router.replace("/login");
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </ScrollView>
  );
}
