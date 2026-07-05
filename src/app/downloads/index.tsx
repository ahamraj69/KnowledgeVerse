import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import DownloadCard from "../../components/DownloadCard";
import { useAuth } from "../../context/AuthContext";

import {
  DownloadItem,
  getDownloads,
  removeDownload,
} from "../../services/downloadService";

export default function DownloadsScreen() {
  const { user } = useAuth();

  const [downloads, setDownloads] = useState<
    DownloadItem[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    loadDownloads();
  }, [user]);

  const loadDownloads = async () => {
    try {
      setLoading(true);

      const data = await getDownloads();

      // newest first
      const sorted = data.sort(
        (a, b) =>
          b.downloadedAt - a.downloadedAt
      );

      setDownloads(sorted);
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Failed to load downloads"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteDownload = async (
    lessonId: string
  ) => {
    try {
      const updated =
        await removeDownload(lessonId);

      setDownloads(updated);
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Failed to delete download"
      );
    }
  };

  const openLesson = (lessonId: string) => {
    // Navigate back to course screen
    router.push(`/course/${lessonId}`);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#22C55E" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Loading Downloads...
        </Text>
      </View>
    );
  }
  return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "#0B1220",
    }}
    contentContainerStyle={{
      padding: 20,
      paddingBottom: 40,
    }}
  >
    <Text
      style={{
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
      }}
    >
      📥 Offline Downloads
    </Text>

    {downloads.length === 0 ? (
      <View
        style={{
          marginTop: 80,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 60 }}>
          📭
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          No Downloads Yet
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginTop: 8,
            textAlign: "center",
            fontSize: 15,
          }}
        >
          Download lessons to access them offline anytime
        </Text>
      </View>
    ) : (
      downloads.map((item) => (
        <DownloadCard
          key={item.id}
          item={item}
          onOpen={openLesson}
          onDelete={deleteDownload}
        />
      ))
    )}
  </ScrollView>
);
}