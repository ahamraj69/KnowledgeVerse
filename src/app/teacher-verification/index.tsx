import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import { uploadImage } from "@/services/storageService";
import { getVerification, submitVerification, TeacherVerification } from "@/services/teacherVerificationService";
import { Theme } from "@/theme/theme";

export default function TeacherVerificationScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();

  const [fullName, setFullName] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState("");
  const [idDocument, setIdDocument] = useState("");
  const [certificateDocument, setCertificateDocument] = useState("");
  const [uploading, setUploading] = useState(false);

  const [verification, setVerification] = useState<TeacherVerification | null>(null);

  const loadVerification = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const data = await getVerification(user.uid);
      setVerification(data);
    } catch (e) {
      if (__DEV__) console.log("Verification profile track extraction fault:", e);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    loadVerification();
  }, [user, loadVerification]);

  const pickImage = useCallback(async (type: "profile" | "id" | "certificate") => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "KnowledgeVerse needs gallery privileges to attach credentials.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        allowsEditing: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const uri = result.assets[0].uri;

      switch (type) {
        case "profile":
          setProfilePhoto(uri);
          break;
        case "id":
          setIdDocument(uri);
          break;
        case "certificate":
          setCertificateDocument(uri);
          break;
      }
    } catch (err) {
      Alert.alert("Selection Error", "Could not complete media asset extraction loop.");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!user?.uid) return;

    if (verification?.status === "pending") {
      Alert.alert(
        "Already Submitted",
        "Your verification request is currently under review."
      );
      return;
    }

    const cleanName = fullName.trim();
    const cleanQualification = qualification.trim();
    const cleanSpecialization = specialization.trim();
    const cleanExperience = experience.trim();
    const cleanBio = bio.trim();

    if (!cleanName || !cleanQualification || !cleanSpecialization || !cleanExperience || !cleanBio) {
      Alert.alert("Incomplete", "Please fill all text fields.");
      return;
    }

    if (!profilePhoto || !idDocument || !certificateDocument) {
      Alert.alert("Missing Assets", "Please select all three required verification documents.");
      return;
    }

    if (!isConnected) {
      Alert.alert("Offline", "Please connect to the internet to submit verification parameters.");
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);

      const profilePhotoUrl = await uploadImage(
        profilePhoto,
        `teacherVerification/${user.uid}/profile.jpg`
      );

      const idDocumentUrl = await uploadImage(
        idDocument,
        `teacherVerification/${user.uid}/id.jpg`
      );

      const certificateUrl = await uploadImage(
        certificateDocument,
        `teacherVerification/${user.uid}/certificate.jpg`
      );

      setUploading(false);

      await submitVerification({
        uid: user.uid,
        fullName: cleanName,
        qualification: cleanQualification,
        specialization: cleanSpecialization,
        experience: cleanExperience,
        bio: cleanBio,
        profilePhoto: profilePhotoUrl,
        idDocument: idDocumentUrl,
        certificateDocument: certificateUrl,
        status: "pending",
        submittedAt: Date.now(),
      });

      Alert.alert("Submitted", "Verification request sent successfully.");
      
      setFullName("");
      setQualification("");
      setSpecialization("");
      setExperience("");
      setBio("");
      setProfilePhoto("");
      setIdDocument("");
      setCertificateDocument("");
      
      await loadVerification();
    } catch (e) {
      setUploading(false);
      Alert.alert("Error", "Could not upload binary files or commit your request portfolio document.");
    } finally {
      setSubmitting(false);
    }
  }, [user?.uid, fullName, qualification, specialization, experience, bio, profilePhoto, idDocument, certificateDocument, isConnected, verification, loadVerification]);

  const statusCardSection = useMemo(() => {
    if (!verification) return null;

    const isRejected = verification.status === "rejected";
    const statusColor = verification.status === "approved" ? "#10B981" : isRejected ? "#EF4444" : "#D97706";

    return (
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Verification Status</Text>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {verification.status.toUpperCase()}
        </Text>
        {isRejected && verification.rejectionReason && (
          <Text style={styles.rejectReason}>
            Reason: {verification.rejectionReason}
          </Text>
        )}
      </View>
    );
  }, [verification]);

  const verifiedBadgeSection = useMemo(() => {
    if (verification?.status !== "approved") return null;

    return (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✔ VERIFIED TEACHER</Text>
      </View>
    );
  }, [verification]);

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={styles.container}>
      <Text style={[Theme.text, styles.title]}>👨‍🏫 Teacher Verification</Text>
      
      {statusCardSection}
      {verifiedBadgeSection}

      <Text style={[Theme.muted, styles.subtitle]}>
        Submit academic credentials, technical skill documentation, and identity records directly to request verified status privileges.
      </Text>

      <Text style={styles.inputLabel}>Full Legal Name</Text>
      <TextInput
        placeholder="e.g., Prof. Aham Raj"
        placeholderTextColor="#9CA3AF"
        value={fullName}
        onChangeText={setFullName}
        editable={!submitting && !uploading}
        style={styles.input}
        maxLength={80}
      />

      <Text style={styles.inputLabel}>Academic Qualification</Text>
      <TextInput
        placeholder="e.g., M.Tech in Computer Science, Ph.D."
        placeholderTextColor="#9CA3AF"
        value={qualification}
        onChangeText={setQualification}
        editable={!submitting && !uploading}
        style={styles.input}
        maxLength={100}
      />

      <Text style={styles.inputLabel}>Area of Specialization</Text>
      <TextInput
        placeholder="e.g., Artificial Intelligence & Predictive Models"
        placeholderTextColor="#9CA3AF"
        value={specialization}
        onChangeText={setSpecialization}
        editable={!submitting && !uploading}
        style={styles.input}
        maxLength={100}
      />

      <Text style={styles.inputLabel}>Teaching Experience</Text>
      <TextInput
        placeholder="Teaching Experience (e.g. 5 years)"
        placeholderTextColor="#9CA3AF"
        value={experience}
        onChangeText={setExperience}
        editable={!submitting && !uploading}
        style={styles.input}
        maxLength={100}
      />

      <Text style={styles.inputLabel}>Teacher Biography</Text>
      <TextInput
        placeholder="Tell students about yourself"
        placeholderTextColor="#9CA3AF"
        value={bio}
        onChangeText={setBio}
        editable={!submitting && !uploading}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, styles.multilineInput]}
        maxLength={500}
      />

      <Text style={[Theme.text, styles.label]}>Profile Photo</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickImage("profile")}
        disabled={submitting || uploading}
        activeOpacity={0.7}
      >
        <Text style={styles.uploadButtonText}>Choose Profile Photo</Text>
      </TouchableOpacity>
      {profilePhoto !== "" && (
        <Image source={{ uri: profilePhoto }} style={styles.preview} />
      )}

      <Text style={[Theme.text, styles.label]}>Government ID</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickImage("id")}
        disabled={submitting || uploading}
        activeOpacity={0.7}
      >
        <Text style={styles.uploadButtonText}>Choose ID</Text>
      </TouchableOpacity>
      {idDocument !== "" && (
        <Image source={{ uri: idDocument }} style={styles.preview} />
      )}

      <Text style={[Theme.text, styles.label]}>Qualification Certificate</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickImage("certificate")}
        disabled={submitting || uploading}
        activeOpacity={0.7}
      >
        <Text style={styles.uploadButtonText}>Choose Certificate</Text>
      </TouchableOpacity>
      
      {/* ✅ INJECTED: Replaced starting exactly from certificate document evaluation block */}
{certificateDocument !== "" && (
  <Image
    source={{ uri: certificateDocument }}
    style={styles.preview}
  />
)}

<TouchableOpacity
  style={[
    styles.button,
    { opacity: submitting || uploading ? 0.6 : 1 },
  ]}
  onPress={handleSubmit}
  disabled={submitting || uploading}
  activeOpacity={0.8}
>
  {submitting || uploading ? (
    <ActivityIndicator color="#FFFFFF" />
  ) : (
    <Text style={styles.buttonText}>
      Submit Verification
    </Text>
  )}
</TouchableOpacity>

</ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: "#9CA3AF",
    lineHeight: 22,
  },

  inputLabel: {
    color: "#9CA3AF",
    marginTop: 12,
    marginBottom: 6,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#111827",
    color: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  multilineInput: {
    height: 120,
    textAlignVertical: "top",
  },

  label: {
    color: "white",
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },

  uploadButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2563EB",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "rgba(37,99,235,0.05)",
  },

  uploadButtonText: {
    color: "#60A5FA",
    fontWeight: "600",
  },

  preview: {
    width: 130,
    height: 130,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    minHeight: 52,
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  statusCard: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  statusTitle: {
    color: "#9CA3AF",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  statusText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  rejectReason: {
    color: "#EF4444",
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },

  badge: {
    backgroundColor: "#10B981",
    padding: 10,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },

  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
});