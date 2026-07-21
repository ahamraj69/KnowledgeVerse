import UploadCard from "@/components/verification/UploadCard";
import { useVerification } from "@/hooks/useVerification";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function TeacherVerificationFormScreen() {
  const router = useRouter();
  const { activeRequest, submitting, submitRequest, isPending, loading } = useVerification();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("India");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [subjects, setSubjects] = useState("");

  const [progress, setProgress] = useState({ profile: 0, idDoc: 0, cert: 0 });
  const [filesUploaded, setFilesUploaded] = useState({ profile: false, idDoc: false, cert: false });

  // Safe client-side file pick mock bindings
  const simulateFileSelection = useCallback((key: "profile" | "idDoc" | "cert") => {
    setFilesUploaded(prev => ({ ...prev, [key]: true }));
    Alert.alert("File Attached", `${key.toUpperCase()} file asset cached in frame successfully.`);
  }, []);

  const handleFormSubmission = useCallback(async () => {
    // ✅ Step 7: Form Validation verification checks lock down execution
    if (!fullName.trim() || !phone.trim() || !experience.trim() || !bio.trim() || !subjects.trim()) {
      Alert.alert("Required Fields Missing", "Please populate all contextual information fields before submitting.");
      return;
    }
    if (!filesUploaded.profile || !filesUploaded.idDoc) {
      Alert.alert("Required Files Missing", "Both a Profile Photo and a Government ID document must be attached.");
      return;
    }

    try {
      const mockBlob = new Blob(["mock_file_data"], { type: "image/jpeg" });
      
      await submitRequest(
        { fullName: fullName.trim(), phone: phone.trim(), country, experience: Number(experience), bio: bio.trim(), subjects: [subjects.trim()] },
        { profileBlob: mockBlob, idBlob: mockBlob, certBlob: filesUploaded.cert ? mockBlob : null },
        (key, p) => setProgress(prev => ({ ...prev, [key]: p }))
      );

      router.replace("/teacher-verification/success" as any);
    } catch (e) {
      Alert.alert("Submission Breakdown", "Could not complete database registration. Try again later.");
    }
  }, [fullName, phone, country, experience, bio, subjects, filesUploaded, submitRequest, router]);

  if (loading) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  // ✅ Step 11: Lock duplicate active requests instantly
  if (isPending) {
    return (
      <View style={[Theme.screen, styles.lockedCenterWrapper]}>
        <Text style={styles.lockedGraphic}>⏳</Text>
        <Text style={styles.lockedTitle}>Verification Under Review</Text>
        <Text style={styles.lockedSub}>You already have a pending verification request. Our administrative team is currently reviewing your submitted profiles credentials logs.</Text>
        <TouchableOpacity style={styles.backButtonNode} onPress={() => router.replace("/feed" as any)}>
          <Text style={styles.backButtonNodeText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.viewportWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Instructor Verification</Text>
        <Text style={styles.subtitle}>Submit credentials to unlock curriculum publishing capabilities.</Text>

        <Text style={styles.label}>FULL NAME</Text>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Enter your full name" placeholderTextColor="#4B5563" />

        <Text style={styles.label}>PHONE NUMBER</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="e.g. +91 9876543210" placeholderTextColor="#4B5563" />

        <Text style={styles.label}>COUNTRY</Text>
        <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="India" placeholderTextColor="#4B5563" />

        <Text style={styles.label}>YEARS OF EXPERIENCE</Text>
        <TextInput style={styles.input} value={experience} onChangeText={setExperience} keyboardType="numeric" placeholder="e.g. 5" placeholderTextColor="#4B5563" />

        <Text style={styles.label}>SPECIALIZED SUBJECT AREAS</Text>
        <TextInput style={styles.input} value={subjects} onChangeText={setSubjects} placeholder="e.g. Physics, Class 8 Science" placeholderTextColor="#4B5563" />

        <Text style={styles.label}>TEACHING BIO</Text>
        <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} placeholder="Describe your teaching journey..." placeholderTextColor="#4B5563" multiline numberOfLines={4} />

        <Text style={styles.sectionHeading}>📁 Document Attachments</Text>
        
        <UploadCard title="Profile Photo" progress={progress.profile} uploaded={filesUploaded.profile} onPick={() => simulateFileSelection("profile")} />
        <UploadCard title="Government Issued ID" progress={progress.idDoc} uploaded={filesUploaded.idDoc} onPick={() => simulateFileSelection("idDoc")} />
        <UploadCard title="Teaching Certificate (Optional)" progress={progress.cert} uploaded={filesUploaded.cert} onPick={() => simulateFileSelection("cert")} />

        <TouchableOpacity style={[styles.submitBtn, submitting && styles.disabledBtn]} onPress={handleFormSubmission} disabled={submitting} activeOpacity={0.85}>
          {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.submitBtnText}>Submit Verification Request</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 18 },
  scrollContent: { paddingTop: 20, paddingBottom: 50 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  mainTitle: { color: "white", fontSize: 26, fontWeight: "bold" },
  subtitle: { color: "#9CA3AF", fontSize: 13, marginTop: 4, marginBottom: 24 },
  label: { color: "#9CA3AF", fontSize: 11, fontWeight: "700", marginBottom: 6, letterSpacing: 0.3 },
  input: { backgroundColor: "#111827", padding: 14, borderRadius: 10, color: "white", marginBottom: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 15 },
  textArea: { height: 90, textAlignVertical: "top" },
  sectionHeading: { color: "white", fontSize: 16, fontWeight: "bold", marginTop: 14, marginBottom: 14 },
  submitBtn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 16, minHeight: 52 },
  disabledBtn: { opacity: 0.5 },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "bold" },
  
  // Pending State Styles
  lockedCenterWrapper: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#0B1220" },
  lockedGraphic: { fontSize: 54, marginBottom: 16 },
  lockedTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  lockedSub: { color: "#9CA3AF", fontSize: 14, textAlign: "center", marginTop: 8, lineHeight: 22 },
  backButtonNode: { marginTop: 28, backgroundColor: "#111827", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  backButtonNodeText: { color: "#38BDF8", fontWeight: "bold" }
});
