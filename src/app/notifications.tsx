import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { Collections } from "@/lib/firebaseCollections";
import { Theme } from "@/theme/theme";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    // ✅ FIXED: Initialized secure direct observer to satisfy the notification layout screen cleanly
    const q = query(
      collection(db, Collections.NOTIFICATIONS),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
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
      <Text style={styles.title}>🔔 System Activity Alerts</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.notiTitle}>{item.title}</Text>
            <Text style={styles.notiBody}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No alerts received yet.</Text>
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
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 12, marginBottom: 12 },
  notiTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  notiBody: { color: "#9CA3AF", fontSize: 14, marginTop: 4 },
  emptyText: { color: "#6B7280", fontSize: 14 }
});
