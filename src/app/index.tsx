import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

import ContinueLearningCard from "../components/ContinueLearningCard";
import ContinueLearningEmpty from "../components/ContinueLearningEmpty";
import RecentlyViewedCard from "../components/RecentlyViewedCard";
import { useAuth } from "../context/AuthContext";
import { getRecentlyViewed, RecentlyViewedCourse } from "../services/recentlyViewedService";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedCourse[]>([]);

  // Temporary mock state placeholder for development layout testing
  const continueLearning = null;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    loadRecentlyViewed();
  }, [user, loading]);

  const continueCourse = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const loadRecentlyViewed = async () => {
    if (!user) return;

    try {
      const data = await getRecentlyViewed(user.uid);
      setRecentlyViewed(data);
    } catch (e) {
      console.log("loadRecentlyViewed error:", e);
    }
  };

  const browseCourses = () => {
    router.push("/courses");
  };

  // Phase 11.5.4.8 UI Polish: Detailed dashboard placeholder loading terminal view
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0B1220", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ color: "#9CA3AF", marginTop: 15, fontSize: 16, fontWeight: "500" }}>
          Loading your learning dashboard...
        </Text>
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
        marginBottom: 18, // Phase 11.5.4.8 UI Polish (Changed from 15 to 18)
      }}
    >
      <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
        {icon} {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0B1220" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>🚀 KnowledgeVerse</Text>
      <Text style={{ color: "#9CA3AF", marginTop: 5, marginBottom: 30, fontSize: 16 }}>
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

      {/* Render Recently Viewed courses configuration layout block */}
      {recentlyViewed.length > 0 && (
        <>
          <Text
            style={{
              color: "white",
              fontSize: 26,       // Phase 11.5.4.8 UI Polish
              fontWeight: "bold", // Phase 11.5.4.8 UI Polish
              marginBottom: 15,
              marginTop: 10,
            }}
          >
            Recently Viewed
          </Text>

          {recentlyViewed.map((course) => (
            <RecentlyViewedCard
              key={course.courseId}
              courseId={course.courseId}
              title={course.courseTitle}
              onPress={continueCourse}
            />
          ))}
        </>
      )}

      <Card title="AI Tutor" icon="🤖" color="#2563EB" onPress={() => router.push("/ai")} />
      <Card title="Browse Courses" icon="📚" color="#1F2937" onPress={() => router.push("/courses")} />
      <Card title="Teacher Dashboard" icon="👨‍🏫" color="#10B981" onPress={() => router.push("/teacher/dashboard")} />
      <Card title="My Profile" icon="👤" color="#7C3AED" onPress={() => router.push("/profile")} />
      <Card title="Wishlist" icon="❤️" color="#DC2626" onPress={() => router.push("/wishlist")} />
      <Card title="Notifications" icon="🔔" color="#F59E0B" onPress={() => router.push("/notifications")} />
      <Card title="Settings" icon="⚙️" color="#374151" onPress={() => router.push("/settings")} />
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
