import { useFocusEffect } from "expo-router";
import { memo, useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

import BookmarkCard from "../../components/BookmarkCard";
import EmptyState from "../../components/EmptyState"; // ✅ Phase 23.2
import SkeletonCard from "../../components/SkeletonCard"; // ✅ Phase 23.1
import { useAuth } from "../../context/AuthContext";
import { Bookmark, subscribeToBookmarks } from "../../services/bookmarkService";
import { Theme } from "../../theme/theme";

function BookmarksScreen() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // ✅ Phase 23.3

  const connectListener = useCallback(() => {
    if (!user?.uid) return () => {};
    return subscribeToBookmarks(user.uid, (liveBookmarks) => {
      setBookmarks(liveBookmarks);
      setLoading(false);
      setRefreshing(false);
    });
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;
      setLoading(true);
      const unsubscribe = connectListener();
      return () => unsubscribe();
    }, [user?.uid, connectListener])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const unsubscribe = connectListener();
    setTimeout(() => {
      unsubscribe();
      setRefreshing(false);
    }, 1500);
  }, [connectListener]);

  const sortedBookmarks = useMemo(() => {
    return [...bookmarks].sort((a: Bookmark, b: Bookmark) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  }, [bookmarks]);

  const renderItem = useCallback(({ item }: { item: Bookmark }) => (
    <BookmarkCard bookmark={item} onOpen={async () => {}} onDelete={async () => {}} />
  ), []);

  // ✅ Phase 23.1: Structural skeleton loading placeholder elements masking network delays
  if (loading && !refreshing) {
    return (
      <View style={[Theme.screen, styles.paddingGrid]}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  return (
    <View style={Theme.screen}>
      <FlatList
        data={sortedBookmarks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" colors={["#2563EB"]} />
        }
        // ✅ Phase 23.2: Clean empty illustrations framework
        ListEmptyComponent={
          <EmptyState 
            icon="🔖" 
            title="No Bookmarks Found" 
            subtitle="Save references inside course lectures to display study cards here." 
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  paddingGrid: { padding: 16 }
});

export default memo(BookmarksScreen);
