import UploadCard from "@/components/verification/UploadCard";
import { useVerificationStatus } from "@/hooks/useVerificationStatus";
import { executeResubmission } from "@/lib/verificationStatusService";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ResubmitVerificationScreen() {
  const router = useRouter();
  const { verification, refresh } = useVerificationStatus();

  const [fullName, setFullName] = useState(verification?.fullName || "");
  const [phone, setPhone] = useState(verification?.phone || "");
  const [bio, setBio] = useState(verification?.bio || "");
  const [submitting, setSubmitting] = useState(false);

  const [filesChanged, setFilesChanged] = useState({ profile: false, idDoc: false });

  const handleProcessUpdates = useCallback(async () => {
    if (!verification?.id || !fullName.trim() || !phone.trim() || !bio.trim()) {
      Alert.alert("Validation Defect", "Information fields cannot remain blank.");
      return;
    }

    try {
      setSubmitting(true);
      
      // ✅ Step 10: Commits patches resetting status boundaries cleanly back to pending
      await executeResubmission(verification.id, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        updatedAt: Date.now()
      });

      await refresh();
      Alert.alert("Success 🎉", "Application documentation updated successfully.");
      router.replace("/teacher-verification/status" as any);
    } catch (e) {
      Alert.alert("Fault", "Could not complete text modifications transaction logs.");
    } finally {
      setSubmitting(false);
    }
  }, [verification, fullName, phone, bio, refresh, router]);

  return (
    <View style={styles.viewportWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Resubmit Profile Documentation</Text>
        <Text style={styles.sub}>Update unreadable file items or correct profile parameter metrics here.</Text>

        <Text style={styles.label}>FULL NAME</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Update Full Name" placeholderTextColor="#4B5563" />

        <Text style={styles.label}>PHONE NUMBER</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Update Phone Number" placeholderTextColor="#4B5563" />

        <Text style={styles.label}>TEACHING BIO SUMMARY</Text>
        <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} multiline numberOfLines={3} placeholderTextColor="#4B5563" />

        <Text style={styles.sectionHeading}>🔄 Replace Attachments</Text>
        <UploadCard title="Replace Profile Picture" progress={0} uploaded={filesChanged.profile} onPick={() => setFilesChanged(prev => ({ ...prev, profile: true }))} />
        <UploadCard title="Replace Government ID" progress={0} uploaded={filesChanged.idDoc} onPick={() => setFilesChanged(prev => ({ ...prev, idDoc: true }))} />

        <TouchableOpacity style={[styles.btn, submitting && styles.dis]} onPress={handleProcessUpdates} disabled={submitting}>
          {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.btnText}>Commit Re-Application</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 24, paddingBottom: 40 },
  title: { color: "white", fontSize: 22, fontWeight: "bold" },
  sub: { color: "#9CA3AF", fontSize: 13, marginTop: 4, marginBottom: 20 },
  label: { color: "#9CA3AF", fontSize: 11, fontWeight: "700", marginBottom: 6, letterSpacing: 0.3 },
  input: { backgroundColor: "#111827", padding: 14, borderRadius: 10, color: "white", marginBottom: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  textArea: { height: 80, textAlignVertical: "top" },
  sectionHeading: { color: "white", fontSize: 15, fontWeight: "700", marginBottom: 12 },
  btn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 14, minHeight: 52 },
  dis: { opacity: 0.6 },
  btnText: { color: "white", fontSize: 16, fontWeight: "bold" }
});
