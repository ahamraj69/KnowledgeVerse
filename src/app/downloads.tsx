import { useFocusEffect } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { DownloadItem } from "@/services/downloadService";
import { Theme } from "@/theme/theme";

export default function DownloadsScreen() {
  const { user } = useAuth();
  const [files, setFiles] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDownloadedAssets = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const snap = await getDocs(collection(db, "users", user.uid, "downloads"));
      const localFiles: DownloadItem[] = [];

      snap.forEach((docItem) => {
        const data = docItem.data();
        localFiles.push({
          id: docItem.id,
          courseId: data.courseId || "",
          lessonId: data.lessonId || docItem.id,
          lessonTitle: data.lessonTitle || "Untitled Resource Note",
          downloadedAt: data.downloadedAt || Date.now(),
        });
      });

      localFiles.sort((a, b) => (b.downloadedAt ?? 0) - (a.downloadedAt ?? 0));
      setFiles(localFiles);
    } catch (e) {
      if (__DEV__) {
        console.log("Error loading cached file tracks:", e);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      if (files.length === 0) {
        setLoading(true);
      }
      loadDownloadedAssets();
    }, [files.length, loadDownloadedAssets])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDownloadedAssets();
  }, [loadDownloadedAssets]);

  const handleOpenFile = useCallback((file: DownloadItem) => {
    Alert.alert("Opening Resource 📂", `Launching localized system viewer for: ${file.lessonTitle}`);
  }, []);

  const renderFileItem = useCallback(({ item }: { item: DownloadItem }) => {
    const formattedDate = item.downloadedAt ? new Date(item.downloadedAt).toLocaleDateString() : "Offline Cache";

    return (
      <TouchableOpacity 
        style={styles.fileCard} 
        onPress={() => handleOpenFile(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <Text style={styles.iconText}>📄</Text>
        </View>
        <View style={styles.fileDetails}>
          {/* ✅ FIXED: Replaced item.title with item.lessonTitle */}
          <Text style={[Theme.text, styles.fileTitle]} numberOfLines={1}>{item.lessonTitle}</Text>
          <Text style={Theme.muted}>Saved: {formattedDate} • Local Copy</Text>
        </View>
        {/* ✅ FIXED: Implemented static download verification token text */}
        <View style={styles.statusSection}>
          <Text style={styles.statusBadgeText}>✅ Downloaded</Text>
        </View>
      </TouchableOpacity>
    );
  }, [handleOpenFile]);

  const listHeader = useMemo(() => (
    <View>
      <Text style={[Theme.text, styles.mainTitle]}>⬇️ Offline Vault</Text>
      <Text style={[Theme.muted, styles.subtitle]}>Access your downloaded textbooks, study materials, and code guides anytime without data connectivity.</Text>
    </View>
  ), []);

  if (loading && !refreshing) {
    return (
      <View style={[Theme.screen, styles.loadingPadding]}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  return (
    <View style={Theme.screen}>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id}
        renderItem={renderFileItem}
        ListHeaderComponent={listHeader}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" colors={["#7C3AED"]} />
        }
        ListEmptyComponent={
          <EmptyState 
            icon="📥" 
            title="Your Vault is Empty" 
            subtitle="Saved lecture notes and resource parameters will automatically sync down here for disconnected learning." 
          />
        }
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  loadingPadding: { padding: 20 },
  mainTitle: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 24, lineHeight: 22 },
  fileCard: { backgroundColor: "#111827", padding: 16, borderRadius: 14, flexDirection: "row", alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  iconWrapper: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#7C3AED20", justifyContent: "center", alignItems: "center", marginRight: 15 },
  iconText: { fontSize: 20 },
  fileDetails: { flex: 1, marginRight: 10 },
  fileTitle: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  statusSection: { paddingLeft: 6 },
  statusBadgeText: { color: "#10B981", fontSize: 13, fontWeight: "600" }
});
