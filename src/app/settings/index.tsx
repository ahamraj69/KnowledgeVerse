import DangerButton from "@/components/settings/DangerButton";
import SettingsItem from "@/components/settings/SettingsItem";
import SettingsSection from "@/components/settings/SettingsSection";
import ToggleItem from "@/components/settings/ToggleItem";
import { useSettings } from "@/hooks/useSettings";
import { auth } from "@/lib/firebase";
import { executeAccountDeletion, executeLogout, verifyUserEmail } from "@/lib/user/settingsService";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, loading, save } = useSettings();
  const user = auth.currentUser;

  const handleLogoutAction = async () => {
    try {
      await executeLogout();
      router.replace("/login");
    } catch (e) {
      Alert.alert("Logout Error", "Could not complete account disconnect cycles cleanly.");
    }
  };

  const handleAccountDeletionAction = () => {
    if (!user) return;
    Alert.alert(
      "🚨 Critical Account Deletion",
      "Are you absolutely certain you want to permanently delete your account? This action erases your history, notes, and progress logs from the servers and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete Permanently", 
          style: "destructive", 
          onPress: async () => {
            try {
              await executeAccountDeletion(user.uid);
              router.replace("/login");
            } catch (err) {
              Alert.alert("Authentication Conflict", "This operations context requires a recent login validation track. Log back in and re-trigger execution.");
            }
          }
        }
      ]
    );
  };

  const triggerVerificationEmail = async () => {
    try {
      await verifyUserEmail();
      Alert.alert("Verification Dispatched ✉️", "Verification email has been sent successfully to your registered mailbox address.");
    } catch (e) {
      Alert.alert("Dispatch Error", "Failed to route system outbound verification tokens.");
    }
  };

  if (loading || !settings) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  return (
    <View style={styles.viewportWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Settings Panel</Text>

        <SettingsSection title="👤 Account Settings">
          <SettingsItem label="Personal Identification Card" value={user?.displayName || "Student"} onPress={() => router.push("/profile/edit" as any)} />
          <SettingsItem label="Email Contact" value={user?.email || "No email"} onPress={() => Alert.alert("Profile Context", "Email adjustments require advanced multi-factor re-verification channels.")} />
          <SettingsItem label="Modify Secure Password" onPress={() => router.push("/settings/change-password" as any)} />
          {!user?.emailVerified && (
            <TouchableOpacity style={styles.verifyBanner} onPress={triggerVerificationEmail}>
              <Text style={styles.verifyBannerText}>⚠️ Contact Email Unverified - Click to Verify</Text>
            </TouchableOpacity>
          )}
        </SettingsSection>

        <SettingsSection title="🎨 Theme & Localization">
          <ToggleItem label="Enforce Adaptive Dark Mode Layouts" value={settings.darkMode} onValueChange={(val) => save({ darkMode: val })} />
          <SettingsItem label="Active App Language" value={settings.language} onPress={() => router.push("/settings/language" as any)} />
        </SettingsSection>

        <SettingsSection title="🔔 System Alerts Control">
          <ToggleItem label="Global Push Notifications Alerts" value={settings.notifications} onValueChange={(val) => save({ notifications: val })} />
          <ToggleItem label="Outbound Email Summaries Feed" value={settings.emailNotifications} onValueChange={(val) => save({ emailNotifications: val })} />
        </SettingsSection>

        <SettingsSection title="🤖 AI Study Assistance Configuration">
          <ToggleItem label="Allow Personalized Learning Context Memory" value={settings.aiSuggestions} onValueChange={(val) => save({ aiSuggestions: val })} />
        </SettingsSection>

        <SettingsSection title="📚 Playback & Connectivity Parameters">
          <ToggleItem label="Autoplay Video Lessons Matrix" value={settings.autoPlayVideos} onValueChange={(val) => save({ autoPlayVideos: val })} />
          <ToggleItem label="Download Content on Wi-Fi Networks Only" value={settings.downloadOnWifiOnly} onValueChange={(val) => save({ downloadOnWifiOnly: val })} />
        </SettingsSection>

        <SettingsSection title="🔐 User Isolation Privacy">
          <ToggleItem label="Maintain Public Discovery Profile View" value={settings.publicProfile} onValueChange={(val) => save({ publicProfile: val })} />
          <SettingsItem label="Review Privacy Manifest Agreement Documentation" onPress={() => router.push("/settings/privacy" as any)} />
        </SettingsSection>

        <SettingsSection title="🚨 Security Disconnect Danger Zone">
          <DangerButton label="Secure Sign Out Session" onPress={handleLogoutAction} />
          <DangerButton label="Erase and Purge Account Permanently" onPress={handleAccountDeletionAction} />
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 24, paddingBottom: 50 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  screenTitle: { color: "white", fontSize: 26, fontWeight: "bold", marginBottom: 24, letterSpacing: 0.2 },
  verifyBanner: { backgroundColor: "rgba(245,158,11,0.1)", padding: 12, alignItems: "center", borderWidth: 1, borderColor: "rgba(245,158,11,0.25)" },
  verifyBannerText: { color: "#F59E0B", fontWeight: "700", fontSize: 13 }
});
