import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getReportsByStatus } from "@/lib/moderationService";
import ModerationCard from "@/components/reports/ModerationCard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Report } from "@/types/report";
import { Theme } from "@/theme/theme";

export default function PendingIncidentQueueScreen() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQueue() {
      const data = await getReportsByStatus("pending");
      setReports(data);
      setLoading(false);
    }
    loadQueue();
  }, []);

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={[Theme.screen, styles.box]}>
        <Text style={styles.heading}>🚩 Live Infractions Queue</Text>
        {loading ? <ActivityIndicator color="#EF4444" style={styles.load} /> : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ModerationCard report={item} onView={() => router.push(`/admin/reports/${item.id}` as any)} />
            )}
            ListEmptyComponent={<Text style={styles.empty}>Zero pending incident files logged across this data block.</Text>}
          />
        )}
      </View>
    </ProtectedRoute>
  );
}
const styles = StyleSheet.create({ box: { flex: 1, backgroundColor: "#0B1220", padding: 20 }, heading: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20 }, load: { marginTop: 40 }, empty: { color: "#6B7280", fontSize: 14, textAlign: "center", marginTop: 40 } });
