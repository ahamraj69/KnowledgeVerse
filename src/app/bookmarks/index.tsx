import BookmarkCard from "@/components/BookmarkCard";
import { useAuth } from "@/context/AuthContext";
import { removeBookmark, subscribeToBookmarks } from "@/lib/bookmarkService";
import { Theme } from "@/theme/theme";
import { Bookmark } from "@/types/chat";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

export default function BookmarksScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToBookmarks(user.uid, (liveBookmarks: Bookmark[]) => {
      // ✅ FIXED: Sorted chronologically using absolute numeric values directly without using .seconds
      const sorted = liveBookmarks.sort((a, b) => {
        const timeA = typeof a.createdAt === "number" ? a.createdAt : 0;
        const timeB = typeof b.createdAt === "number" ? b.createdAt : 0;
        return timeB - timeA;
      });
      setBookmarks(sorted);
      setCorners(false);
    });
    return unsubscribe;
  }, [user]);

  function setCorners(val: boolean) {
    setLoading(val);
  }

  const handleOpenCourse = (courseId: string) => {
    router.push(`/course/${courseId}` as any);
  };

  const handleDelete = async (id: string) => {
    if (!user?.uid) return;
    const matched = bookmarks.find(b => b.id === id);
    if (matched) {
      await removeBookmark(user.uid, matched.lessonId);
    }
  };

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={styles.headerTitle}>🔖 Saved Lessons</Text>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookmarkCard bookmark={item} onOpen={handleOpenCourse} onDelete={handleDelete} />
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No saved content layers bookmarked yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 20 },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 },
  emptyText: { color: "#6B7280", fontSize: 14 }
});
