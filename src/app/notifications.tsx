import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { NotificationItem, subscribeToNotifications } from "../services/notificationService"; // ✅ FIXED
import { Theme } from "../theme/theme";

export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;
      setLoading(true);

      const unsubscribe = subscribeToNotifications(user.uid, (liveNotes) => {
        setNotes(liveNotes);
        setLoading(false);
      });

      return () => unsubscribe();
    }, [user?.uid])
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={Theme.screen}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={[Theme.text, { fontWeight: "bold" }]}>{item.title}</Text>
            <Text style={[Theme.text, { marginTop: 4, color: "#D1D5DB" }]}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={Theme.text}>No notifications yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { padding: 16, backgroundColor: "#111827", margin: 10, borderRadius: 10 }
});
