import { router } from "expo-router";
import { useMemo } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import BottomNavigation from "@/components/BottomNavigation";
import DashboardStats from "@/components/DashboardStats";
import { useCourses } from "@/hooks/useCourses";
import { useProgress } from "@/hooks/useProgress";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Theme } from "@/theme/theme";

export default function FeedScreen() {
  const { profile, loading: profileLoading } = useUserProfile();
  const { courses, loading: coursesLoading } = useCourses();
  const { progress, loading: progressLoading } = useProgress();

  const recommendedCourses = useMemo(() => {
    return courses ? courses.slice(0, 3) : [];
  }, [courses]);

  if (profileLoading || coursesLoading || progressLoading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.viewportWrapper}>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header Layout Section Block */}
            <View style={styles.header}>
              <View style={styles.greetingHeaderRow}>
                <Text style={styles.greeting}>Welcome Back 👋</Text>
                <TouchableOpacity onPress={() => router.push("/notifications")} activeOpacity={0.7}>
                  <Text style={styles.notificationBellEmoji}>🔔</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.title}>KnowledgeVerse</Text>
              <Text style={styles.subtitle}>India's AI Learning Platform 🇮🇳</Text>

              {/* Profile Overview Card */}
              <View style={styles.profileBadgeCard}>
                <Text style={styles.profileNameText}>{profile?.name || "Student"}</Text>
                <Text style={styles.profileEmailText}>{profile?.email || "No email assigned"}</Text>
                <Text style={styles.profileRoleText}>🎓 {(profile?.role || "student").toUpperCase()}</Text>
              </View>
            </View>

            {/* Mounted real-time analytics data points into the metrics counter block */}
            <DashboardStats
              courses={courses.length}
              streak={progress?.streak || 0}
              lessons={progress?.totalLessons || 0}
            />

            {/* Daily Motivation Card */}
            <View style={styles.quoteCard}>
              <Text style={styles.quoteTitle}>💡 Daily Motivation</Text>
              <Text style={styles.quoteText}>"Success is the sum of small efforts repeated every day."</Text>
            </View>

            {/* General Progress Analytics Dashboard Container */}
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>📈 Your Progress</Text>
              <Text style={styles.progressText}>🔥 Streak: {progress?.streak ?? 0} days</Text>
              <Text style={styles.progressText}>🎓 Completed Courses: {progress?.completedCourses ?? 0}</Text>
              <Text style={styles.progressText}>📚 Lessons Finished: {progress?.totalLessons ?? 0}</Text>
            </View>

            {/* User Continue Learning resume shortcut module */}
            <View style={styles.continueCard}>
              <Text style={styles.progressTitle}>▶ Continue Learning</Text>
              <Text style={styles.progressText}>Last Course: {progress?.lastCourseId || "None"}</Text>
            </View>

            {/* Rendered the Top 3 custom targeted recommendation cards element row lists */}
            {recommendedCourses.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>⭐ Recommended For You</Text>
                {recommendedCourses.map(course => (
                  <View key={course.id} style={styles.recommendCard}>
                    <Text style={styles.recommendCourseTitle}>{course.title}</Text>
                    <Text style={styles.recommendTeacherText}>👨‍🏫 Instructor ID: {course.teacherId}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Quick Actions Sub-Grid Matrix */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickGrid}>
              <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/ai")} activeOpacity={0.8}>
                <Text style={styles.quickIcon}>🤖</Text>
                <Text style={styles.quickText}>AI Tutor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/progress")} activeOpacity={0.8}>
                <Text style={styles.quickIcon}>📈</Text>
                <Text style={styles.quickText}>Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/explore")} activeOpacity={0.8}>
                <Text style={styles.quickIcon}>📚</Text>
                <Text style={styles.quickText}>Courses</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickCard} onPress={() => router.push("/teacher")} activeOpacity={0.8}>
                <Text style={styles.quickIcon}>👨‍🏫</Text>
                <Text style={styles.quickText}>Teacher</Text>
              </TouchableOpacity>
            </View>

            {/* Live Courses Section Label */}
            <Text style={styles.sectionTitle}>📚 Live Courses</Text>
            {courses.length === 0 && (
              <View style={styles.innerEmptyState}>
                <Text style={styles.emptyStateSub}>No active courses matching criteria streams found.</Text>
              </View>
            )}
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            {item.thumbnail ? (
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            ) : (
              <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
                <Text style={styles.placeholderText}>📖 {item.title}</Text>
              </View>
            )}
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.teacher}>👨‍🏫 Instructor ID: {item.teacherId}</Text>
            <Text style={styles.category}>📚 {item.category}</Text>
            <Text style={styles.meta}>⭐ {item.rating}  •  🎓 {item.students} Students</Text>
          </View>
        )}
        ListFooterComponent={
          <>
            {/* Saved Bookmarks Summary Section */}
            {progress?.bookmarks && progress.bookmarks.length > 0 && (
              <View style={styles.metaPaddingCard}>
                <Text style={styles.progressText}>🔖 Saved Courses: {progress.bookmarks.length}</Text>
              </View>
            )}

            {/* Recent Learning History Section */}
            {progress?.recentCourses && progress.recentCourses.length > 0 && (
              <View style={styles.historyOverviewCard}>
                <Text style={styles.progressTitle}>🕒 Recent Learning</Text>
                {progress.recentCourses.map((item: string) => (
                  <Text key={item} style={styles.progressText}>• {item}</Text>
                ))}
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerTitle}>🚀 KnowledgeVerse</Text>
              <Text style={styles.footerText}>Version 1.0.0{"\n"}Made with ❤️ in India{"\n"}Powered by AI</Text>
            </View>
          </>
        }
      />

      <BottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  container: { flex: 1, paddingHorizontal: 18 },
  scrollContent: { paddingTop: 20, paddingBottom: 120 },
  header: { marginBottom: 25 },
  greetingHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  greeting: { color: "#38BDF8", fontSize: 16, fontWeight: "600" },
  notificationBellEmoji: { fontSize: 24 },
  title: { color: "white", fontSize: 32, fontWeight: "bold" },
  subtitle: { color: "#9CA3AF", marginTop: 5, fontSize: 15, marginBottom: 10 },
  profileBadgeCard: { width: "100%", backgroundColor: "#111827", marginTop: 15, padding: 18, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  profileNameText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  profileEmailText: { color: "#9CA3AF", marginTop: 4, fontSize: 14 },
  profileRoleText: { color: "#38BDF8", marginTop: 10, fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },
  quoteCard: { backgroundColor: "#111827", padding: 18, borderRadius: 18, marginBottom: 25, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  quoteTitle: { color: "#38BDF8", fontWeight: "bold", marginBottom: 10, fontSize: 15 },
  quoteText: { color: "white", fontSize: 15, lineHeight: 24, fontWeight: "500" },
  progressCard: { backgroundColor: "#111827", padding: 18, borderRadius: 18, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  continueCard: { backgroundColor: "#172554", padding: 18, borderRadius: 18, marginBottom: 20, borderWidth: 1, borderColor: "rgba(56,189,248,0.15)" },
  progressTitle: { fontSize: 20, fontWeight: "bold", color: "white", marginBottom: 10 },
  progressText: { fontSize: 15, color: "#D1D5DB", marginTop: 5, fontWeight: "500" },
recommendCard: { backgroundColor: "#1E293B", padding: 16, borderRadius: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
recommendCourseTitle: { fontSize: 16, fontWeight: "bold", color: "white" },
recommendTeacherText: { color: "#94A3B8", fontSize: 13, marginTop: 4, fontWeight: "500" },
sectionTitle: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 16, marginTop: 14, letterSpacing: 0.2 },
quickGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 25 },
quickCard: { width: "48%", backgroundColor: "#111827", borderRadius: 18, paddingVertical: 22, alignItems: "center", marginBottom: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
quickIcon: { fontSize: 34 },
quickText: { color: "white", fontWeight: "600", marginTop: 12, fontSize: 15 },
courseCard: { backgroundColor: "#111827", padding: 18, borderRadius: 18, marginBottom: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
thumbnail: { width: "100%", height: 180, borderRadius: 16, marginBottom: 14 },
thumbnailPlaceholder: { backgroundColor: "#1F2937", justifyContent: "center", alignItems: "center" },
placeholderText: { color: "#9CA3AF", fontSize: 16, fontWeight: "bold" },
courseTitle: { fontSize: 20, fontWeight: "bold", color: "white" },
teacher: { color: "#9CA3AF", marginTop: 6, fontSize: 14, fontWeight: "500" },
category: { color: "#38BDF8", marginTop: 6, fontSize: 14, fontWeight: "600" },
meta: { marginTop: 10, color: "#D1D5DB", fontSize: 13, fontWeight: "500" },
innerEmptyState: { padding: 16, backgroundColor: "#111827", borderRadius: 14, alignItems: "center" },
emptyStateSub: { color: "#9CA3AF", fontSize: 14, textAlign: "center" },
metaPaddingCard: { backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
historyOverviewCard: { backgroundColor: "#111827", padding: 16, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.04)", gap: 4, marginBottom: 14 },
footer: { alignItems: "center", marginTop: 24, marginBottom: 40 },
footerTitle: { color: "white", fontWeight: "bold", fontSize: 18 },
footerText: { color: "#6B7280", textAlign: "center", marginTop: 8, lineHeight: 22, fontSize: 13 }
});
