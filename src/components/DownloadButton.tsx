import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
} from "react-native";

import { useAuth } from "../context/AuthContext";

import {
    addDownload,
    isDownloaded,
    removeDownload,
} from "../services/downloadService";

interface Props {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  videoUrl: string;
}

export default function DownloadButton({
  courseId,
  lessonId,
  lessonTitle,
  videoUrl,
}: Props) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!user) return;

    checkDownload();
  }, [user, lessonId]);

  const checkDownload = async () => {
    if (!user) return;

    try {
      const exists = await isDownloaded(lessonId);
      setDownloaded(exists);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleDownload = async () => {
    if (!user) return;

    try {
      setLoading(true);

      if (downloaded) {
        await removeDownload(lessonId);
        setDownloaded(false);

        Alert.alert(
          "Removed",
          "Download deleted successfully"
        );
      } else {
        await addDownload({
          id: `${lessonId}_${Date.now()}`,
          courseId,
          lessonId,
          lessonTitle,
          videoUrl,
          downloadedAt: Date.now(),
        });

        setDownloaded(true);

        Alert.alert(
          "Downloaded",
          "Lesson saved for offline use"
        );
      }
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Download failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator color="#22C55E" />
    );
  }

  return (
    <TouchableOpacity
      onPress={toggleDownload}
      style={{
        backgroundColor: downloaded
          ? "#16A34A"
          : "#374151",
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {downloaded
          ? "📥 Downloaded"
          : "⬇ Download"}
      </Text>
    </TouchableOpacity>
  );
}