import { addDownload, isDownloaded, removeDownload } from "@/lib/downloadService";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

interface DownloadButtonProps {
  userId: string;
  lessonId: string;
  lessonTitle: string;
}

export default function DownloadButton({ userId, lessonId, lessonTitle }: DownloadButtonProps) {
  const [cached, setCached] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkCacheState() {
      if (!userId || !lessonId) return;
      const exists = await isDownloaded(userId, lessonId);
      setCached(exists);
    }
    checkCacheState();
  }, [userId, lessonId]);

  const handleToggleDownload = async () => {
    if (!userId || !lessonId) return;
    try {
      setLoading(true);
      if (cached) {
        // ✅ FIXED: Invoking the clean single-argument downloadId removal query parameter
        await removeDownload(`${userId}_${lessonId}`);
        setCached(false);
      } else {
        await addDownload(userId, lessonId, lessonTitle);
        setCached(true);
      }
    } catch (e) {
      console.log("Offline caching error toggle trace:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="small" color="#38BDF8" style={styles.loader} />;

  return (
    <TouchableOpacity style={[styles.btn, cached && styles.active]} onPress={handleToggleDownload}>
      <Text style={styles.text}>{cached ? "📥 Saved Offline" : "📥 Download Lesson"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 12, backgroundColor: "#111827", borderRadius: 10, alignItems: "center", justifyContent: "center", minHeight: 44, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  active: { backgroundColor: "rgba(16,185,129,0.15)", borderColor: "#10B981" },
  text: { color: "white", fontSize: 14, fontWeight: "600" },
  loader: { padding: 12 }
});
