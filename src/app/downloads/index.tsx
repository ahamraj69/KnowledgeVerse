import { useAuth } from "@/context/AuthContext";
import { removeDownload, subscribeToDownloads } from "@/lib/downloadService";
import { Theme } from "@/theme/theme";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DownloadsScreen() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToDownloads(user.uid, (liveDownloads: any[]) => {
      // ✅ FIXED: Safely tracks the numerical timestamps properties
      const sorted = liveDownloads.sort((a, b) => {
        return (b.timestamp || 0) - (a.timestamp || 0);
      });
      setDownloads(sorted);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={styles.title}>📥 Offline Downloads</Text>
      <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* ✅ FIXED: Safely reads title from fallback item metrics */}
            <Text style={styles.cardTitle}>{item.title || item.lessonName || "Offline Module"}</Text>
            {/* ✅ FIXED: Satisfies arguments signature by providing explicit keys */}
            <TouchableOpacity onPress={() => removeDownload(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No available content cached offline.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 20 },
  title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 },
  card: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#111827", padding: 16, borderRadius: 12, marginBottom: 12 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "600" },
  deleteText: { color: "#EF4444", fontWeight: "bold" },
  emptyText: { color: "#6B7280", fontSize: 14 }
});
