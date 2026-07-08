import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  addDownload,
  isDownloaded,
  removeDownload
} from "../services/downloadService";

interface Props {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
}

export default function DownloadButton({
  courseId,
  lessonId,
  lessonTitle,
}: Props) {
  // ✅ FIX: Injected active 'user' object context cleanly into your component scope
  const { user } = useAuth();
  const [isDownloadedState, setIsDownloadedState] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.uid) return;

    const checkDownloadStatus = async () => {
      try {
        const status = await isDownloaded(user.uid, lessonId);
        setIsDownloadedState(status);
      } catch (e) {
        console.log(e);
      }
    };

    checkDownloadStatus();
  }, [user?.uid, lessonId]);

  const handleDownloadAction = async () => {
    if (!user?.uid) return;

    try {
      if (isDownloadedState) {
        await removeDownload(user.uid, lessonId);
        setIsDownloadedState(false);
      } else {
        await addDownload(user.uid, {
          courseId,
          lessonId,
          lessonTitle,
        });
        setIsDownloadedState(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleDownloadAction}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1F2937",
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
        {isDownloadedState ? "📥 Saved Offline" : "💾 Download Lesson"}
      </Text>
    </TouchableOpacity>
  );
}
