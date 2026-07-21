import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublishStatusCard from "@/components/courseApproval/PublishStatusCard";
import { useCourseApproval } from "@/hooks/useCourseApproval";
import { Theme } from "@/theme/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SubmitCourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { course, loading, submitting, submitForReview } = useCourseApproval(id || "");

  const handleTriggerSubmission = async () => {
    Alert.alert(
      "Confirm Submission",
      "Are you ready to locking down changes and dispatch this curriculum draft to the administrative review queue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit for Review",
          onPress: async () => {
            const result = await submitForReview();
            if (result.success) {
              Alert.alert("Success 🎉", "Course submitted successfully! It is now locked under pending validation status.");
              router.back();
            } else {
              // ✅ Step 5 FIXED: Blocks out invalid submissions and alerts the instructor
              Alert.alert("Validation Mismatch", result.error || "Please clear all required fields constraints.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#2563EB" /></View>;
  }

  if (!course) {
    return <View style={[Theme.screen, styles.center]}><Text style={styles.error}>Course profile structure not tracked.</Text></View>;
  }

  const isEditable = course.status === "draft" || course.status === "rejected";

  return (
    <ProtectedRoute allow={["teacher", "admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backBtnText}>◀ Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Review Submission</Text>
          </View>

          {/* Step 7 & 11 Status Banners Hook */}
          <PublishStatusCard status={course.status} comment={course.reviewComment} />

          {/* Course Details Block Sheet Elements */}
          <View style={styles.detailsSheet}>
            <Text style={styles.metaLabel}>COURSE TITLE</Text>
            <Text style={styles.metaValue}>{course.title}</Text>

            <Text style={styles.metaLabel}>SYLLABUS DESCRIPTION</Text>
            <Text style={styles.metaDesc}>{course.description}</Text>

            <View style={styles.rowGrid}>
              <View style={styles.gridItem}>
                <Text style={styles.metaLabel}>CATEGORY</Text>
                <Text style={styles.gridValue}>📖 {course.category}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.metaLabel}>LEVEL</Text>
                <Text style={styles.gridValue}>📊 {course.level || "General"}</Text>
              </View>
            </View>
          </View>

          {/* Action Trigger Buttons */}
          {isEditable && (
            <TouchableOpacity 
              style={[styles.submitBtn, submitting && styles.dis]} 
              onPress={handleTriggerSubmission}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.submitBtnText}>Submit For Review</Text>}
            </TouchableOpacity>
          )}

        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  backBtn: { backgroundColor: "rgba(255,255,255,0.05)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginRight: 14 },
  backBtnText: { color: "#38BDF8", fontSize: 13, fontWeight: "600" },
  title: { color: "white", fontSize: 22, fontWeight: "bold" },
  error: { color: "#EF4444", fontSize: 15 },
  
  detailsSheet: { backgroundColor: "#111827", padding: 18, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", gap: 14 },
  metaLabel: { color: "#6B7280", fontSize: 11, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" },
  metaValue: { color: "white", fontSize: 18, fontWeight: "bold" },
  metaDesc: { color: "#CBD5E1", fontSize: 14, lineHeight: 22 },
  rowGrid: { flexDirection: "row", gap: 16 },
  gridItem: { flex: 1 },
  gridValue: { color: "white", fontSize: 15, fontWeight: "600", marginTop: 4 },
  
  submitBtn: { backgroundColor: "#2563EB", padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 24, minHeight: 52 },
  dis: { opacity: 0.5 },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "bold" }
});
