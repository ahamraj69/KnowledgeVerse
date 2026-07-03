import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import BookmarkCard from "../../components/BookmarkCard";
import { useAuth } from "../../context/AuthContext";

import {
  Bookmark,
  getBookmarks,
  removeBookmark,
} from "../../services/bookmarkService";

export default function BookmarksScreen() {
  const { user } = useAuth();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    loadBookmarks();
  }, [user]);

  const loadBookmarks = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const data = await getBookmarks(user.uid);

      // newest first
      const sorted = data.sort((a, b) => {
        const aTime =
          a.createdAt?.seconds || 0;
        const bTime =
          b.createdAt?.seconds || 0;

        return bTime - aTime;
      });

      setBookmarks(sorted);
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Failed to load bookmarks"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteBookmark = async (
    bookmarkId: string
  ) => {
    if (!user) return;

    try {
      await removeBookmark(
        user.uid,
        bookmarkId
      );

      setBookmarks((prev) =>
        prev.filter((b) => b.id !== bookmarkId)
      );
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Failed to delete bookmark"
      );
    }
  };

  const openCourse = (courseId: string) => {
    router.push(`/course/${courseId}`);
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
        <ActivityIndicator color="#F59E0B" />
        <Text style={{ color: "white", marginTop: 10 }}>
          Loading Bookmarks...
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
      ⭐ Bookmarks
    </Text>

    {bookmarks.length === 0 ? (
      <View
        style={{
          marginTop: 80,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 60 }}>🔖</Text>

        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          No Bookmarks Yet
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginTop: 8,
            textAlign: "center",
            fontSize: 15,
          }}
        >
          Save lessons to quickly access them later
        </Text>
      </View>
    ) : (
      bookmarks.map((item) => (
        <BookmarkCard
          key={item.id}
          bookmark={item}
          onOpen={openCourse}
          onDelete={deleteBookmark}
        />
      ))
    )}
  </ScrollView>
);