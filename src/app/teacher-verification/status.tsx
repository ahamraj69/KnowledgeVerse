import AdminComment from "@/components/verification/AdminComment";
import ResubmitButton from "@/components/verification/ResubmitButton";
import UploadedDocumentCard from "@/components/verification/UploadedDocumentCard";
import VerificationStatusCard from "@/components/verification/VerificationStatusCard";
import VerificationTimeline from "@/components/verification/VerificationTimeline";
import { useVerificationStatus } from "@/hooks/useVerificationStatus";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function VerificationStatusScreen() {
  const router = useRouter();
  const { verification, loading, refresh } = useVerificationStatus();

  if (loading) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  if (!verification) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <Text style={styles.errorText}>No submitted application context logged.</Text>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.replace("/teacher-verification" as any)}>
          <Text style={styles.actionBtnText}>Apply for Verification</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const allowResubmit = verification.status === "rejected" || verification.status === "needs_more_info";

  return (
    <View style={styles.viewportWrapper}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor="#38BDF8" />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Verification Status</Text>
          <TouchableOpacity onPress={() => router.push("/teacher-verification/history" as any)}>
            <Text style={styles.historyLink}>📜 History</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.metaLabel}>Submitted: {new Date(verification.submittedAt).toLocaleDateString()}</Text>

        {/* Dynamic Status Blocks */}
        <VerificationStatusCard status={verification.status} />
        <VerificationTimeline status={verification.status} />
        <AdminComment comment={verification.adminComment} />

        {/* Current Document Summary */}
        <Text style={styles.sectionHeading}>📁 Uploaded Documents Summary</Text>
        <UploadedDocumentCard label="Profile Avatar Picture" url={verification.profilePhotoURL} resubmitting={false} onReplace={() => {}} />
        <UploadedDocumentCard label="Government Identification Record" url={verification.idDocumentURL} resubmitting={false} onReplace={() => {}} />
        {verification.certificateURL && (
          <UploadedDocumentCard label="Academic Credentials Certificate" url={verification.certificateURL} resubmitting={false} onReplace={() => {}} />
        )}

        {/* ✅ Step 8: Conditional Resubmission Controls Activation */}
        {allowResubmit && (
          <ResubmitButton onPress={() => router.push("/teacher-verification/resubmit" as any)} />
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 24, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  historyLink: { color: "#38BDF8", fontSize: 14, fontWeight: "600" },
  metaLabel: { color: "#6B7280", fontSize: 12, marginTop: 4, marginBottom: 16, fontWeight: "500" },
  sectionHeading: { color: "white", fontSize: 15, fontWeight: "700", marginTop: 20, marginBottom: 12 },
  errorText: { color: "#9CA3AF", fontSize: 15, marginBottom: 16 },
  actionBtn: { backgroundColor: "#2563EB", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  actionBtnText: { color: "white", fontWeight: "bold" }
});
