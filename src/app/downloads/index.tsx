import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
// ✅ FIXED: Imported type reference interface natively from its true service layer home
import { DownloadItem, removeDownload, subscribeToDownloads } from "../../services/downloadService";
import { Theme } from "../../theme/theme";

export default function DownloadsScreen() {
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Focused mounting layer attaches live listeners and disposes them cleanly on focus shift
  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;
      setLoading(true);

      const unsubscribe = subscribeToDownloads(user.uid, (liveDownloads) => {
        // Enforce safe timestamp tracking loops to clear out any undefined values
        const sorted = liveDownloads.sort((a, b) => {
          const timeA = a.downloadedAt ?? 0;
          const timeB = b.downloadedAt ?? 0;
          return timeB - timeA;
        });
        setDownloads(sorted);
        setLoading(false);
      });

      return () => unsubscribe();
    }, [user?.uid])
  );

  const handleDelete = async (lessonId: string) => {
    if (!user?.uid) return;
    try {
      await removeDownload(user.uid, lessonId);
    } catch (e) {
      console.log("Failed to clear localized download track:", e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={Theme.screen}>
      <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textWrapper}>
              <Text style={[Theme.text, styles.title]}>{item.lessonTitle}</Text>
              <Text style={Theme.muted}>Available offline</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.lessonId)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete 🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={Theme.text}>No offline downloads available.</Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    padding: 16,
    backgroundColor: "#111827",
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  textWrapper: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  deleteText: {
    color: "#EF4444",
    fontWeight: "600",
    fontSize: 14,
  },
});
