import { useEffect, useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
// ✅ FIXED: Imported the correct service listener function name matching your module export declarations
import {
    deleteNotification,
    markNotificationRead,
    NotificationItem,
    subscribeNotifications,
} from "@/services/notificationService";

export default function NotificationsScreen() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.read).length;
  }, [notifications]);

  useEffect(() => {
    if (!user?.uid) return;

    // ✅ FIXED: Connected the right listener module function with an explicitly typed clean callback signature
    const unsubscribe = subscribeNotifications(
      user.uid,
      (liveNotifications: NotificationItem[]) => {
        setNotifications(liveNotifications);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleRead = async (id: string) => {
    if (!user?.uid) return;
    try {
      await markNotificationRead(user.uid, id);
    } catch (e) {
      if (__DEV__) console.log("Mark notification read error:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.uid) return;
    try {
      await deleteNotification(user.uid, id);
    } catch (e) {
      if (__DEV__) console.log("Delete notification error:", e);
    }
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={notifications}
      keyExtractor={(item) => item.id}
      removeClippedSubviews={true}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.heading}>🔔 Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyText}>You're all caught up.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={[styles.card, !item.read && styles.unreadCard]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>

          <View style={styles.actions}>
            {!item.read && (
              <TouchableOpacity
                style={styles.readBtn}
                onPress={() => handleRead(item.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.btnText}>Mark Read</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  heading: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#DC2626",
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  title: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  message: {
    color: "#9CA3AF",
    marginTop: 8,
    lineHeight: 22,
    fontSize: 14,
  },
  actions: {
    flexDirection: "row",
    marginTop: 15,
  },
  readBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    minHeight: 36,
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "#DC2626",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 36,
    justifyContent: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  empty: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 60,
  },
  emptyTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
  },
  emptyText: {
    color: "#9CA3AF",
    marginTop: 8,
    fontSize: 15,
  },
});
