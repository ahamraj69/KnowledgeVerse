import { router } from "expo-router";
import { memo, useCallback } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/context/AuthContext";
import { Theme } from "@/theme/theme";

interface CardProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

const DashboardCard = memo(function DashboardCard({ title, icon, color, onPress }: CardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { borderLeftColor: color }]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default function HomeScreen() {
  const { user } = useAuth();

  const openCourses = useCallback(() => router.push("/courses" as any), []);
  const openExplore = useCallback(() => router.push("/explore" as any), []);
  const openAssignments = useCallback(() => router.push("/assignment/submit" as any), []);
  const openDownloads = useCallback(() => router.push("/downloads" as any), []);
  const openBookmarks = useCallback(() => router.push("/bookmarks" as any), []);
  const openWishlist = useCallback(() => router.push("/wishlist" as any), []);
  
  const openAITutor = useCallback(() => router.push("/ai" as any), []);
  const openVoiceAI = useCallback(() => router.push("/voice-ai" as any), []);
  const openAIQuiz = useCallback(() => router.push("/ai-quiz" as any), []);
  const openStudyPlanner = useCallback(() => router.push("/study-planner" as any), []);
  const openAIAssignment = useCallback(() => router.push("/ai-assignment" as any), []);

  const openAnalytics = useCallback(() => router.push("/analytics" as any), []);
  const openForum = useCallback(() => router.push("/forum" as any), []);
  const openNotifications = useCallback(() => router.push("/notifications" as any), []);
  const openProgress = useCallback(() => router.push("/progress" as any), []);
  
  const openCertificates = useCallback(() => {
    router.push({ pathname: "/certificate/[id]", params: { id: "course1" } } as any);
  }, []);

  const openNotes = useCallback(() => {
    router.push({ pathname: "/notes/[lessonId]", params: { lessonId: "lesson1" } } as any);
  }, []);

  const openTeacherDashboard = useCallback(() => router.push("/teacher" as any), []);
  const openCreateCourse = useCallback(() => router.push("/teacher/create-course" as any), []);
  const openUploadVideo = useCallback(() => router.push("/teacher/upload-video" as any), []);
  const openUploadPDF = useCallback(() => router.push("/teacher/upload-pdf" as any), []);
  const openStudents = useCallback(() => router.push("/teacher/students" as any), []);
  const openEarnings = useCallback(() => router.push("/teacher/earnings" as any), []);

  const openProfile = useCallback(() => router.push("/profile" as any), []);
  
  const openReviews = useCallback(() => {
    router.push({ pathname: "/course/review/[courseId]", params: { courseId: "course1" } } as any);
  }, []);

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={styles.container}>
      <Text style={[Theme.text, styles.welcomeTitle]}>
        👋 Welcome, {user?.displayName || "Student"}
      </Text>
      <Text style={[Theme.muted, styles.subtitle]}>
        Manage curriculum streams and telemetry tracking nodes.
      </Text>

      {/* Learning */}
      <Text style={styles.sectionTitle}>📚 Learning</Text>
      <View style={styles.grid}>
        <DashboardCard title="Courses" icon="📚" color="#2563EB" onPress={openCourses} />
        <DashboardCard title="Explore" icon="🧭" color="#10B981" onPress={openExplore} />
        <DashboardCard title="Assignments" icon="📝" color="#0891B2" onPress={openAssignments} />
        <DashboardCard title="Downloads" icon="⬇️" color="#7C3AED" onPress={openDownloads} />
        <DashboardCard title="Bookmarks" icon="🔖" color="#F59E0B" onPress={openBookmarks} />
        <DashboardCard title="Wishlist" icon="❤️" color="#DC2626" onPress={openWishlist} />
      </View>

      {/* AI Tools */}
      <Text style={styles.sectionTitle}>🤖 AI Tools</Text>
      <View style={styles.grid}>
        <DashboardCard title="AI Tutor" icon="🧠" color="#6366F1" onPress={openAITutor} />
        <DashboardCard title="Voice AI" icon="🎤" color="#14B8A6" onPress={openVoiceAI} />
        <DashboardCard title="AI Quiz" icon="❓" color="#8B5CF6" onPress={openAIQuiz} />
        <DashboardCard title="Study Planner" icon="📅" color="#0EA5E9" onPress={openStudyPlanner} />
        <DashboardCard title="AI Assignment" icon="📝" color="#EC4899" onPress={openAIAssignment} />
      </View>

      {/* Student */}
      <Text style={styles.sectionTitle}>🎓 Student</Text>
      <View style={styles.grid}>
        <DashboardCard title="Analytics" icon="📊" color="#0284C7" onPress={openAnalytics} />
        <DashboardCard title="Forum" icon="💬" color="#6366F1" onPress={openForum} />
        <DashboardCard title="Notifications" icon="🔔" color="#F97316" onPress={openNotifications} />
        <DashboardCard title="Progress" icon="📈" color="#22C55E" onPress={openProgress} />
        <DashboardCard title="Certificates" icon="🏆" color="#EAB308" onPress={openCertificates} />
        <DashboardCard title="Notes" icon="📒" color="#64748B" onPress={openNotes} />
      </View>

      {/* Teacher Studio */}
      <Text style={styles.sectionTitle}>👨‍🏫 Teacher Studio</Text>
      <View style={styles.grid}>
        <DashboardCard title="Teacher Dashboard" icon="👨‍🏫" color="#2563EB" onPress={openTeacherDashboard} />
        <DashboardCard title="Create Course" icon="➕" color="#059669" onPress={openCreateCourse} />
        <DashboardCard title="Upload Video" icon="🎥" color="#EF4444" onPress={openUploadVideo} />
        <DashboardCard title="Upload PDF" icon="📄" color="#8B5CF6" onPress={openUploadPDF} />
        <DashboardCard title="Students" icon="👥" color="#06B6D4" onPress={openStudents} />
        <DashboardCard title="Earnings" icon="💰" color="#F59E0B" onPress={openEarnings} />
      </View>

      {/* Account */}
      <Text style={styles.sectionTitle}>⚙️ Account</Text>
      <View style={styles.grid}>
        <DashboardCard title="Profile" icon="👤" color="#475569" onPress={openProfile} />
        <DashboardCard title="Reviews" icon="⭐" color="#FACC15" onPress={openReviews} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  welcomeTitle: { fontSize: 26, fontWeight: "bold", marginTop: 10 },
  subtitle: { fontSize: 15, marginTop: 4, marginBottom: 10 },
  sectionTitle: { color: "white", fontSize: 22, fontWeight: "700", marginTop: 28, marginBottom: 12 },
  grid: { gap: 16 },
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", borderLeftWidth: 5 },
  icon: { fontSize: 24, marginRight: 15 },
  cardTitle: { fontSize: 17, fontWeight: "600", color: "#FFFFFF" }
});
