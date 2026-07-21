import StatusBadge from "@/components/verification/StatusBadge";
import { auth } from "@/lib/firebase";
import { fetchVerificationHistory } from "@/lib/verificationStatusService";
import { Theme } from "@/theme/theme";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function VerificationHistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid || "";

  useEffect(() => {
    async function loadLogs() {
      if (!userId) return;
      const data = await fetchVerificationHistory(userId);
      setHistory(data);
      setLoading(false);
    }
    loadLogs();
  }, [userId]);

  if (loading) return <View style={[Theme.screen, styles.center]}><ActivityIndicator color="#38BDF8" /></View>;

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={styles.title}>Verification Review History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.dateText}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
              <StatusBadge status={item.status} />
            </View>
            <Text style={styles.commentText}>Remark: {item.adminComment || "No comment history saved."}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No evaluation cycles logged yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 20 },
  title: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0B1220" },
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  dateText: { color: "white", fontSize: 14, fontWeight: "600" },
  commentText: { color: "#9CA3AF", fontSize: 13, lineHeight: 18 },
  emptyText: { color: "#6B7280", fontSize: 14, textAlign: "center", marginTop: 40 }
});
