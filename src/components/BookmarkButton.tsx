import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import {
  addBookmark,
  getBookmarkByLesson,
  removeBookmark
} from "../services/bookmarkService";

interface Props {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
}

export default function BookmarkButton({
  courseId,
  lessonId,
  lessonTitle,
}: Props) {
  // ✅ FIX: Injected active 'user' object context cleanly into your component scope
  const { user } = useAuth();
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const checkStatus = async () => {
      try {
        const item = await getBookmarkByLesson(user.uid, lessonId);
        if (item) {
          setBookmarkId(lessonId);
        } else {
          setBookmarkId(null);
        }
      } catch (e) {
        console.log(e);
      }
    };

    checkStatus();
  }, [user?.uid, lessonId]);

  const toggleBookmark = async () => {
    if (!user?.uid) return;

    try {
      if (bookmarkId) {
        await removeBookmark(user.uid, lessonId);
        setBookmarkId(null);
      } else {
        await addBookmark(user.uid, {
          courseId,
          lessonId,
          lessonTitle,
        });
        setBookmarkId(lessonId); 
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleBookmark}
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
        {bookmarkId ? "❤️ Saved to Bookmarks" : "🖤 Bookmark Lesson"}
      </Text>
    </TouchableOpacity>
  );
}
