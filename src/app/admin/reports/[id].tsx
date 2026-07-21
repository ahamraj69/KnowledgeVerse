import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth } from "@/lib/firebase";
import { getReportById, loadReportedTargetContent, processModerationAction } from "@/lib/moderationService";
import ApprovalCommentBox from "@/components/courseApproval/ApprovalCommentBox";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Report } from "@/types/report";
import { Theme } from "@/theme/theme";

export default function AdminReportDetailAdjudicationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [report, setReport] = useState<Report | null>(null);
  const [targetContent, setTargetContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadFullBundle() {
      if (!id) return;
      try {
        const reportData = await getReportById(id);
        if (reportData) {
          setReport(reportData);
          // ✅ Step 6: Pull exact target text strings/elements from cloud databases to audit live
          const content = await loadReportedTargetContent(reportData.targetId, reportData.targetType);
          setTargetContent(content);
        }
      } catch (e) {
        console.log("Error loading full moderation bundle context maps: ", e);
      } finally {
        setLoading(false);
      }
    }
    loadFullBundle();
  }, [id]);

  const handleModerationDecision = useCallback(async (action: "resolved" | "dismissed") => {
    if (!report || !id) return;
    const adminUid = auth.currentUser?.uid || "admin_node";

    try {
      setProcessing(true);
      // ✅ Step 8 & 9 FIXED: Dispatches status changes and saves transaction remarks
      await processModerationAction(id, action, adminUid, note.trim() || "Moderation cycle committed.");
      Alert.alert("Success 🎉", `Incident file successfully shifted to ${action} status registry.`);
      router.back();
    } catch (e) {
      Alert.alert("Error", "Could not complete moderation database transaction operations.");
    } finally {
      setProcessing(false);
    }
  }, [report, id, note, router]);

  if (loading || !report) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Incident Adjudication</Text>
          <Text style={styles.subtitle}>Report Identifier Token: {report.id}</Text>

          {/* Incident Data Metrics Sheet */}
          <View style={styles.sheet}>
            <Text style={styles.label}>VIOLATION TYPE SHARD</Text>
            <Text style={styles.val}>{report.targetType.toUpperCase()}</Text>

            <Text style={styles.label}>PREDEFINED VIOLATION REASON</Text>
            <Text style={styles.reasonText}>⚠️ {report.reason}</Text>

            {report.description ? (
              <>
                <Text style={styles.label}>REPORTER DESCRIPTION REMARKS</Text>
                <Text style={styles.desc}>{report.description}</Text>
              </>
            ) : null}
          </View>

          {/* ✅ Step 6 Target Content Preview Window Component Block */}
          <Text style={styles.sectionHeading}>🔍 Flagged Content Body Preview</Text>
          <View style={styles.contentPreviewBox}>
            {targetContent ? (
              <Text style={styles.previewText}>
                {targetContent.title || targetContent.content || targetContent.displayName || JSON.stringify(targetContent)}
              </Text>
            ) : (
              <Text style={styles.previewPlaceholder}>Target content layer cached data unavailable or purged from index.</Text>
            )}
          </View>

          {/* Admin Evaluation Notes Textfield */}
          <ApprovalCommentBox value={note} onChange={setNote} />

          {/* Action Row Button Grids */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.btn, styles.resolveBtn]} onPress={() => handleModerationDecision("resolved")} disabled={processing}>
              <Text style={styles.btnText}>⚡ Resolve Infraction</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.btn, styles.dismissBtn]} onPress={() => handleModerationDecision("dismissed")} disabled={processing}>
              <Text style={styles.btnText}>❌ Dismiss False Report</Text>
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
  scrollContent: { paddingTop: 20, paddingBottom: 50 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#6B7280", fontSize: 13, marginTop: 4, marginBottom: 18 },
  sheet: { backgroundColor: "#111827", padding: 16, borderRadius: 14, gap: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  label: { color: "#6B7280", fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  val: { color: "white", fontSize: 16, fontWeight: "bold" },
  reasonText: { color: "#EF4444", fontSize: 15, fontWeight: "bold" },
  desc: { color: "#CBD5E1", fontSize: 14, lineHeight: 22 },
  sectionHeading: { color: "white", fontSize: 15, fontWeight: "700", marginTop: 24, marginBottom: 12 },
  contentPreviewBox: { backgroundColor: "#1F2937", padding: 14, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: "#EF4444" },
  previewText: { color: "white", fontSize: 14, lineHeight: 22, fontWeight: "500" },
  previewPlaceholder: { color: "#6B7280", fontSize: 13, fontStyle: "italic" },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 14 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  resolveBtn: { backgroundColor: "#D97706" },
  dismissBtn: { backgroundColor: "#374151" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 14 }
});
