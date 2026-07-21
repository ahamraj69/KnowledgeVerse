import { useCallback, useState, memo, useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, RefreshControl } from "react-native";
import { useFocusEffect, useRouter } from "expo-router"; // ✅ Step 2 FIXED: Mounted navigation reference router

import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import { subscribeDiscussions, likeDiscussion, Discussion } from "@/lib/discussionService";
import SkeletonCard from "@/components/SkeletonCard";
import EmptyState from "@/components/EmptyState";
import { Theme } from "@/theme/theme";

const COURSE_ID = "general";

export default function DiscussionForumScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();
  const router = useRouter(); // ✅ Step 2 FIXED: Router initialization

  const userId = user?.uid || "demo-user";
  const [posts, setPosts] = useState<Discussion[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const connectListener = useCallback(() => {
    return subscribeDiscussions(COURSE_ID, (livePosts) => {
      setPosts(livePosts);
      setLoading(false);
      setRefreshing(false);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      const unsubscribe = connectListener();
      return () => unsubscribe();
    }, [connectListener])
  );

  const onRefresh = useCallback(async () => {
    if (!isConnected) return;
    setRefreshing(true);
    const unsubscribe = connectListener();
    setTimeout(() => {
      unsubscribe();
      setRefreshing(false);
    }, 1500);
  }, [isConnected, connectListener]);

  const handleLike = useCallback(async (id: string) => {
    if (!isConnected || likedPosts.includes(id)) return;
    try {
      await likeDiscussion(COURSE_ID, id);
      setLikedPosts(prev => [...prev, id]);
    } catch (e) {
      console.log(e);
    }
  }, [isConnected, likedPosts]);

  const renderItem = useCallback(({ item }: { item: Discussion }) => {
    const isLiked = likedPosts.includes(item.id);

    return (
      // ✅ Step 2 FIXED: Replaced raw View nodes with click-navigable route redirection cells
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push(`/discussions/${item.id}` as any)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.userName}>👤 {item.userName}</Text>
          <Text style={styles.likesText}>❤️ {item.likes}</Text>
        </View>
        <Text style={[Theme.text, styles.cardTitle]}>{item.title}</Text>
        <Text style={[Theme.muted, styles.cardMessage]} numberOfLines={2}>{item.message}</Text>
        
        <View style={styles.cardFooter}>
          <TouchableOpacity 
            style={[styles.likeButton, isLiked && styles.likedButton]} 
            onPress={(e) => {
              e.stopPropagation(); // Prevents touch event bubbling from launching page pushes
              handleLike(item.id);
            }}
          >
            <Text style={styles.likeButtonText}>{isLiked ? "❤️ Liked" : "🤍 Like"}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }, [likedPosts, handleLike, router]);

  if (loading && !refreshing) {
    return (
      <View style={[Theme.screen, styles.loadingPadding]}>
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </View>
    );
  }

  return (
    <View style={Theme.screen}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" />}
        ListEmptyComponent={<EmptyState icon="💬" title="No Discussions" subtitle="Be the first to create a post! 🚀" />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingPadding: { padding: 16 },
  list: { padding: 16, paddingBottom: 40, flexGrow: 1 },
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 14, marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", borderLeftWidth: 4, borderLeftColor: "#6366F1" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  userName: { color: "#60A5FA", fontWeight: "600", fontSize: 14 },
  likesText: { color: "#9CA3AF", fontSize: 13, fontWeight: "500" },
  cardTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  cardMessage: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  cardFooter: { borderTopWidth: 1, borderColor: "rgba(255,255,255,0.03)", paddingTop: 10, alignItems: "flex-start" },
  likeButton: { backgroundColor: "#1F2937", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  likedButton: { backgroundColor: "#EF444420" },
  likeButtonText: { color: "white", fontSize: 13, fontWeight: "600" }
});
