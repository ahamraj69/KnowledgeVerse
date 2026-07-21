import { useUserProfile } from "@/hooks/useUserProfile";
import { updateProfile } from "@/lib/user/profileService";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const { profile, loading, refreshProfile } = useUserProfile();

  const [name, setName] = useState(profile?.displayName || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [school, setSchool] = useState(profile?.school || "");
  const [grade, setGrade] = useState(profile?.grade || "");
  const [saving, setSaving] = useState(false);

  const handleSaveChanges = useCallback(async () => {
    if (!profile?.uid || !name.trim()) {
      Alert.alert("Validation Mismatch", "Display Name parameter field cannot remain blank.");
      return;
    }

    try {
      setSaving(true);
      await updateProfile(profile.uid, {
        displayName: name.trim(),
        bio: bio.trim(),
        school: school.trim(),
        grade: grade.trim()
      });
      await refreshProfile();
      Alert.alert("Success 🎉", "Profile database modifications synchronized successfully.");
      router.back();
    } catch (e) {
      Alert.alert("Commit Fault", "Could not complete modification operations.");
    } finally {
      setSaving(false);
    }
  }, [profile, name, bio, school, grade, refreshProfile, router]);

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.viewportWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Modify Profiles</Text>

        <Text style={styles.inputLabel}>DISPLAY NAME</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Student Name" placeholderTextColor="#4B5563" />

        <Text style={styles.inputLabel}>SHORT BIO</Text>
        <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} placeholder="Tell us about your learning goals..." placeholderTextColor="#4B5563" multiline numberOfLines={3} />

        <Text style={styles.inputLabel}>ACADEMIC INSTITUTION / SCHOOL</Text>
        <TextInput style={styles.input} value={school} onChangeText={setSchool} placeholder="School Name" placeholderTextColor="#4B5563" />

        <Text style={styles.inputLabel}>CURRENT CLASS GRADE LEVEL</Text>
        <TextInput style={styles.input} value={grade} onChangeText={setGrade} placeholder="e.g. Class 8" placeholderTextColor="#4B5563" />

        <TouchableOpacity style={[styles.saveBtn, saving && styles.disabledBtn]} onPress={handleSaveChanges} disabled={saving} activeOpacity={0.85}>
          {saving ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveBtnText}>Save Settings Changes</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 20 },
  scrollContent: { paddingTop: 24, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  inputLabel: { color: "#9CA3AF", fontSize: 11, fontWeight: "700", marginBottom: 6, letterSpacing: 0.3 },
  input: { backgroundColor: "#111827", padding: 14, borderRadius: 10, color: "white", marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 15 },
  textArea: { height: 80, textAlignVertical: "top" },
  saveBtn: { backgroundColor: "#2563EB", padding: 15, borderRadius: 12, alignItems: "center", marginTop: 12, minHeight: 50, justifyContent: "center" },
  disabledBtn: { opacity: 0.6 },
  saveBtnText: { color: "white", fontSize: 15, fontWeight: "bold" }
});
