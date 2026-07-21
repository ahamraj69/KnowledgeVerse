import ProtectedRoute from "@/components/auth/ProtectedRoute";
import VerificationCard from "@/components/verification/VerificationCard";
import { useVerificationRequests } from "@/hooks/useVerificationRequests";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function PendingQueueScreen() {
  const router = useRouter();
  const { requests, loading, loadQueue } = useVerificationRequests();

  useEffect(() => {
    loadQueue("pending");
  }, [loadQueue]);

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={[Theme.screen, styles.viewportWrapper]}>
        <Text style={styles.title}>⏳ Pending Queue</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#38BDF8" style={styles.marginSpacer} />
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            renderItem={({ item }) => (
              <VerificationCard request={item} onView={() => router.push(`/admin/verification/${item.id}` as any)} />
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No pending applications inside this stream query.</Text>}
          />
        )}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220", padding: 20 },
  title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  marginSpacer: { marginTop: 40 },
  listPadding: { paddingBottom: 24 },
  emptyText: { color: "#6B7280", fontSize: 14, textAlign: "center", marginTop: 40 }
});
