import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TeacherDashboardScreen() {
  const router = useRouter();
  const { profile, loading } = useUserProfile();

  const handleCreateCourseAction = useCallback(() => {
    // ✅ Step 4 FIXED: Hard guard completely locks out unverified publishing actions [INDEX]
    if (!profile?.verifiedTeacher) {
      Alert.alert(
        "Verification Required",
        "Teacher verification is strictly required before publishing new courses on KnowledgeVerse."
      );
      return;
    }
    router.push("/teacher/create-course" as any);
  }, [profile, router]);

  if (loading) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  // Fallback to student role if account profile is completely missing parameters
  const isVerified = profile?.verifiedTeacher === true;
  const currentStatus = profile?.verificationStatus || "unapplied";

  return (
    <ProtectedRoute allow={["teacher", "admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.title}>Teacher Studio</Text>
          <Text style={styles.sub}>Manage courses, lecture assets, and view student engagement.</Text>

          {/* ✅ Step 11 FIXED: Displays matching real-time verification status contextual banners [INDEX] */}
          {!isVerified && currentStatus === "unapplied" && (
            <TouchableOpacity style={[styles.banner, styles.bannerMuted]} onPress={() => router.push("/teacher-verification" as any)}>
              <Text style={styles.bannerText}>⚪ ACCOUNT UNVERIFIED - TAP TO APPLY NOW</Text>
            </TouchableOpacity>
          )}

          {!isVerified && currentStatus === "pending" && (
            <TouchableOpacity style={[styles.banner, styles.bannerPending]} onPress={() => router.push("/teacher-verification/status" as any)}>
              <Text style={styles.bannerText}>🟡 VERIFICATION PENDING ADMINISTRATIVE REVIEW</Text>
            </TouchableOpacity>
          )}

          {!isVerified && currentStatus === "needs_more_info" && (
            <TouchableOpacity style={[styles.banner, styles.bannerInfo]} onPress={() => router.push("/teacher-verification/status" as any)}>
              <Text style={styles.bannerText}>🟠 ACTION REQUIRED: RESUBMIT EXTRA DOCS</Text>
            </TouchableOpacity>
          )}

          {!isVerified && currentStatus === "rejected" && (
            <TouchableOpacity style={[styles.banner, styles.bannerRejected]} onPress={() => router.push("/teacher-verification/status" as any)}>
              <Text style={styles.bannerText}>🔴 VERIFICATION REJECTED - EXAMINE NOTES</Text>
            </TouchableOpacity>
          )}

          {isVerified && (
            <View style={[styles.banner, styles.bannerSuccess]}>
              <Text style={styles.bannerText}>🟢 VERIFIED INSTRUCTOR CORE ACTIVATED</Text>
            </View>
          )}

          {/* Publishing Grid Matrix */}
          <Text style={styles.sectionHeading}>Actions Workspace</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={[styles.card, !isVerified && styles.disabledCard]} 
              onPress={handleCreateCourseAction}
              activeOpacity={isVerified ? 0.8 : 1.0}
            >
              <Text style={styles.cardIcon}>➕</Text>
              <Text style={styles.cardTitle}>Create New Course</Text>
              {!isVerified && <Text style={styles.lockHint}>🔒 Locked</Text>}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, !isVerified && styles.disabledCard]} 
              onPress={() => isVerified ? router.push("/teacher/my-courses" as any) : null}
              disabled={!isVerified}
            >
              <Text style={styles.cardIcon}>📚</Text>
              <Text style={styles.cardTitle}>My Courses List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => router.push("/teacher-verification/status" as any)}>
              <Text style={styles.cardIcon}>🛡️</Text>
              <Text style={styles.cardTitle}>Verification Portal</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "white", fontSize: 26, fontWeight: "bold" },
  sub: { color: "#9CA3AF", fontSize: 13, marginTop: 4, marginBottom: 20 },
  sectionHeading: { color: "white", fontSize: 15, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, marginTop: 14 },
  
  // Step 11 Banner Styling Tokens
  banner: { padding: 14, borderRadius: 12, marginBottom: 20, borderWidth: 1, alignItems: "center" },
  bannerMuted: { backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" },
  bannerPending: { backgroundColor: "rgba(245,158,11,0.08)", borderColor: "#F59E0B" },
  bannerInfo: { backgroundColor: "rgba(56,189,248,0.08)", borderColor: "#38BDF8" },
  bannerRejected: { backgroundColor: "rgba(239,68,68,0.08)", borderColor: "#EF4444" },
  bannerSuccess: { backgroundColor: "rgba(16,185,129,0.08)", borderColor: "#10B981" },
  bannerText: { color: "white", fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },

  // Grid Layout Tokens
  actionGrid: { gap: 14 },
  card: { backgroundColor: "#111827", padding: 18, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  disabledCard: { opacity: 0.4 },
  cardIcon: { fontSize: 24, marginBottom: 6 },
  cardTitle: { color: "white", fontSize: 15, fontWeight: "bold" },
  lockHint: { color: "#EF4444", fontSize: 11, fontWeight: "700", marginTop: 4, textTransform: "uppercase" }
});
