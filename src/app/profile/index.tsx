import AchievementCard from "@/components/profile/AchievementCard";
import InterestChip from "@/components/profile/InterestChip";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatsCard from "@/components/profile/StatsCard";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, refreshProfile } = useUserProfile();

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <Text style={styles.errorText}>No authenticated profile session mapped.</Text>
      </View>
    );
  }

  return (
    <View style={styles.viewportWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Identity Component */}
        <ProfileHeader profile={profile} onAvatarPress={() => Alert.alert("Profile Media", "Edit profile parameters to upload custom image assets.")} />

        {/* Dynamic Learning Statistics Grid */}
        <Text style={styles.sectionTitle}>📈 Performance Matrix</Text>
        <View style={styles.statsGrid}>
          <StatsCard label="Enrolled" value={profile.completedCourses + 1} />
          <StatsCard label="Finished" value={profile.completedLessons} />
          <StatsCard label="AI Chats" value={profile.aiChats} />
          <StatsCard label="Saved Notes" value={profile.bookmarks} />
          <StatsCard label="Streak" value={`${profile.streak} Days`} />
          <StatsCard label="Quiz Avg" value={`${profile.quizAverage}%`} />
        </View>

        {/* Interests Section */}
        {profile.interests && profile.interests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>🎯 Learning Interests</Text>
            <View style={styles.interestsRow}>
              {profile.interests.map((item, i) => (
                <InterestChip key={i} name={item} />
              ))}
            </View>
          </>
        )}

        {/* Achievements Timeline */}
        <Text style={styles.sectionTitle}>🔥 Unlocked Milestones</Text>
        {profile.achievements.map((item, index) => (
          <AchievementCard key={index} title={item} />
        ))}

        {/* Profile Modifications Control Link */}
        <TouchableOpacity style={styles.editBtn} onPress={() => router.push("/profile/edit")} activeOpacity={0.85}>
          <Text style={styles.editBtnText}>Edit Profile Parameters</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#EF4444", fontSize: 16, fontWeight: "600" },
  sectionTitle: { color: "white", fontSize: 16, fontWeight: "bold", marginTop: 24, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" },
  interestsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  editBtn: { backgroundColor: "#2563EB", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 32 },
  editBtnText: { color: "white", fontSize: 15, fontWeight: "bold" }
});
