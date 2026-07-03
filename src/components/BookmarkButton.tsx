import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
} from "react-native";

import { useAuth } from "../context/AuthContext";

import {
    addBookmark,
    getBookmarkByLesson,
    removeBookmark,
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
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadBookmark();
  }, [user, lessonId]);

  const loadBookmark = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const bookmark = await getBookmarkByLesson(
        user.uid,
        lessonId
      );

      if (bookmark) {
        setBookmarkId(bookmark.id!);
      } else {
        setBookmarkId(null);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async () => {
    if (!user) return;

    try {
      setLoading(true);

      if (bookmarkId) {
        await removeBookmark(
          user.uid,
          bookmarkId
        );

        setBookmarkId(null);

        Alert.alert(
          "Bookmark Removed",
          "Lesson removed from bookmarks."
        );
      } else {
        const id = await addBookmark(
          user.uid,
          courseId,
          lessonId,
          lessonTitle
        );

        setBookmarkId(id);

        Alert.alert(
          "Bookmarked",
          "Lesson added to bookmarks."
        );
      }
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Unable to update bookmark."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        color="#FBBF24"
      />
    );
  }

  return (
    <TouchableOpacity
      onPress={toggleBookmark}
      style={{
        backgroundColor: bookmarkId
          ? "#F59E0B"
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
        {bookmarkId
          ? "⭐ Bookmarked"
          : "☆ Add Bookmark"}
      </Text>
    </TouchableOpacity>
  );
}