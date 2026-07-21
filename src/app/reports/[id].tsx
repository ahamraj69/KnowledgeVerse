import { useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useReports } from "@/hooks/useReports";
import ReportReasonCard from "@/components/reports/ReportReasonCard";
import { ReportType } from "@/types/report";
import { Theme } from "@/theme/theme";

// ✅ Step 4 Predefined violation reasons list [INDEX]
const reportReasons = ["Spam", "Harassment", "Offensive Content", "Copyright", "False Information", "Adult Content", "Violence", "Other"];

export default function ReportFormScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const router = useRouter();
  const { submitReport, submitting } = useReports();

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDescription] = useState("");

  const handleProcessSubmission = useCallback(async () => {
    if (!id || !type || !selectedReason) {
      Alert.alert("Reason Required", "Please select a category reason before submitting.");
      return;
    }

    const result = await submitReport(id, type as ReportType, selectedReason, details);
    if (result.success) {
      router.replace("/reports/success" as any);
    } else {
      Alert.alert("Submission Blocked", result.error || "Could not record violation telemetry data.");
    }
  }, [id, type, selectedReason, details, submitReport, router]);

  return (
    <View style={styles.viewportWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>◀ Back</Text>
          </TouchableOpacity>
          <Text style={styles.mainTitle}>Submit Violation Report</Text>
        </View>

        <Text style={styles.sub}>You are reporting an inappropriate content framework segment. Let us know why this entity requires review.</Text>
        <Text style={styles.label}>TARGET TYPE ENCOUNTERED: {(type || "unknown").toUpperCase()}</Text>

        <Text style={styles.sectionHeading}>Select Reason</Text>
        {reportReasons.map((reason) => (
          <ReportReasonCard 
            key={reason} 
            reason={reason} 
            selected={selectedReason === reason} 
            onSelect={() => setSelectedReason(reason)} 
          />
        ))}

        <Text style={styles.label}>ADDITIONAL CONTEXT DESCRIPTION (OPTIONAL)</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={details} 
          onChangeText={setDescription} 
          placeholder="Provide additional details regarding the violation..." 
          placeholderTextColor="#4B5563" 
          multiline 
          numberOfLines={4} 
        />

        <TouchableOpacity 
          style={[styles.submitBtn, submitting && styles.disabledBtn]} 
          onPress={handleProcessSubmission} 
          disabled={submitting} 
          activeOpacity={0.85}
        >
          {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.submitBtnText}>Submit Inappropriate Content Report</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 50 },
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  backBtn: { backgroundColor: "rgba(255,255,255,0.05)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginRight: 14 },
  backBtnText: { color: "#38BDF8", fontSize: 13, fontWeight: "600" },
  mainTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  sub: { color: "#9CA3AF", fontSize: 14, lineHeight: 22, marginBottom: 20 },
  label: { color: "#6B7280", fontSize: 11, fontWeight: "800", letterSpacing: 0.3, marginBottom: 8, textTransform: "uppercase" },
  sectionHeading: { color: "white", fontSize: 15, fontWeight: "700", marginBottom: 12 },
  input: { backgroundColor: "#111827", padding: 14, borderRadius: 10, color: "white", marginBottom: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 15 },
  textArea: { height: 90, textAlignVertical: "top", marginTop: 10 },
  submitBtn: { backgroundColor: "#EF4444", padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 12, minHeight: 52 },
  disabledBtn: { opacity: 0.5 },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "bold" }
});
