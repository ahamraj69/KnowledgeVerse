import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import { auth } from "@/lib/firebase";
import { fetchVerificationHistory } from "@/lib/verificationStatusService";
import SubmissionHistoryCard from "@/components/courseApproval/SubmissionHistoryCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Theme } from "@/theme/theme";

export default function TeacherCourseHistoryScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid || "";

  useEffect(() => {
    async function loadLogs() {
      if (!userId) return;
      const data = await fetchVerificationHistory(userId);
      setLogs(data);
      setLoading(false);
    }
    loadLogs();
  }, [userId]);

  if (loading) return <View style={[Theme.screen, styles.center]}><ActivityIndicator color="#38BDF8" /></View>;

  return (
    <ProtectedRoute allow={["teacher", "admin"]}>
      <View style={[Theme.screen, styles.container]}>
        <Text style={styles.title}>Syllabus Submission History</Text>
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubmissionHistoryCard date={item.updatedAt} status={item.status} comment={item.adminComment} />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No historical submission logs traced.</Text>}
        />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 20 },
  title: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0B1220" },
  emptyText: { color: "#6B7280", fontSize: 14, textAlign: "center", marginTop: 40 }
});
