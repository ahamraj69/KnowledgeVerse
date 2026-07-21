import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getVerificationById, approveTeacher, updateRequestStatus } from "@/lib/verificationAdminService";
import DocumentViewer from "@/components/verification/DocumentViewer";
import AdminCommentBox from "@/components/verification/AdminCommentBox";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { VerificationRequest } from "@/types/verification";
import { Theme } from "@/theme/theme";

export default function EvaluationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [request, setRequest] = useState<VerificationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadTargetApplication() {
      if (!id) return;
      const data = await getVerificationById(id);
      setRequest(data);
      setLoading(false);
    }
    loadTargetApplication();
  }, [id]);

  const runDecisionTransaction = useCallback(async (action: "approved" | "rejected" | "needs_more_info") => {
    if (!request) return;
    try {
      setProcessing(true);
      if (action === "approved") {
        await approveTeacher(request.id, request.teacherId, comment.trim() || "Approved by Administrator.");
      } else {
        // ✅ FIXED: Maps correctly to 'rejected' instead of 'reject' to satisfy type constraints
        await updateRequestStatus(request.id, action, comment.trim() || "Action issued by administrative desk.");
      }
      Alert.alert("Success 🎉", "Database evaluation parameter logs committed cleanly.");
      router.back();
    } catch (e) {
      Alert.alert("Error", "Could not synchronize operations changes.");
    } finally {
      setProcessing(false);
    }
  }, [request, comment, router]);

  if (loading || !request) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Application Review</Text>
          <Text style={styles.subtitle}>Teacher ID Target: {request.teacherId}</Text>

          <View style={styles.bioCard}>
            <Text style={styles.nameLabel}>{request.fullName}</Text>
            <Text style={styles.bioBody}>{request.bio}</Text>
          </View>

          <Text style={styles.sectionHeading}>📄 Verification Documents</Text>
          <DocumentViewer label="Government Issued Identification" url={request.idDocumentURL} />
          <DocumentViewer label="Professional Teaching Certificate" url={request.certificateURL} />

          <AdminCommentBox value={comment} onChange={setComment} />

          <View style={styles.actionGridRow}>
            <TouchableOpacity style={styles.approveBtn} onPress={() => runDecisionTransaction("approved")} disabled={processing}>
              <Text style={styles.btnText}>✅ Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.rejectBtn} onPress={() => runDecisionTransaction("rejected")} disabled={processing}>
              <Text style={styles.btnText}>❌ Reject</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.infoBtn} onPress={() => runDecisionTransaction("needs_more_info")} disabled={processing}>
            <Text style={styles.infoBtnText}>📄 Request More Information</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 50 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#6B7280", fontSize: 13, marginTop: 4, marginBottom: 18 },
  bioCard: { backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  nameLabel: { color: "white", fontSize: 18, fontWeight: "bold" },
  bioBody: { color: "#9CA3AF", fontSize: 14, marginTop: 8, lineHeight: 22 },
  sectionHeading: { color: "white", fontSize: 15, fontWeight: "700", marginBottom: 12 },
  actionGridRow: { flexDirection: "row", gap: 12, marginTop: 10 },
  approveBtn: { flex: 1, backgroundColor: "#10B981", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  rejectBtn: { flex: 1, backgroundColor: "#EF4444", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  infoBtn: { backgroundColor: "#1F2937", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 14 },
  infoBtnText: { color: "#38BDF8", fontWeight: "bold", fontSize: 14 }
});
