import { useFocusEffect } from "expo-router";
import { memo, useCallback, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import EmptyState from "../../components/EmptyState"; // ✅ Phase 23.2 Import
import CreatePostModal from "../../components/forum/CreatePostModal";
import ForumPostCard from "../../components/forum/ForumPostCard";
import SkeletonCard from "../../components/SkeletonCard"; // ✅ Phase 23.1 Import
import { useAuth } from "../../context/AuthContext";
import { useNetwork } from "../../context/NetworkContext";
import { createForumPost, deleteForumPost, likeForumPost, subscribeToForumPosts } from "../../services/forumService";
import { ForumPost } from "../../types/forum";

function DiscussionForumScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();
  
  const userId = user?.uid || "demo-user";
  const userName = user?.displayName || "Student";

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // ✅ Phase 23.3
  const [modalVisible, setModalVisible] = useState(false);

  // Unified data listener stream registration loop
  const connectListener = useCallback(() => {
    return subscribeToForumPosts((livePosts) => {
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

  // ✅ Phase 23.3: Native Swipe pull to refresh execution loop handler
  const onRefresh = useCallback(async () => {
    if (!isConnected) {
      Alert.alert("Offline Mode", "Cannot sync dynamic cloud threads while disconnected.");
      return;
    }
    setRefreshing(true);
    const unsubscribe = connectListener();
    setTimeout(() => {
      unsubscribe();
      setRefreshing(false);
    }, 1500); // Fail-safe fallback timeout guard
  }, [isConnected, connectListener]);

  const handleCreate = useCallback(async (title: string, content: string) => {
    if (!isConnected) {
      Alert.alert("Something went wrong", "Please verify your device connection settings.");
      return;
    }
    await createForumPost({ userId, userName, title, content, createdAt: Date.now(), likes: 0, replies: 0 });
    setModalVisible(false);
  }, [isConnected, userId, userName]);

  const handleDelete = useCallback((id: string) => {
    if (!isConnected) {
      Alert.alert("Something went wrong", "Please try again when online.");
      return;
    }
    Alert.alert("Delete Post", "Are you sure you want to delete this discussion?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await deleteForumPost(id); } }
    ]);
  }, [isConnected]);

  const handleLike = useCallback(async (id: string, likes: number) => {
    if (!isConnected || likedPosts.includes(id)) return;
    try {
      await likeForumPost(id, likes);
      setLikedPosts(prev => [...prev, id]);
    } catch (e) {
      console.log(e);
    }
  }, [isConnected, likedPosts]);

  const renderItem = useCallback(({ item }: { item: ForumPost }) => (
    <ForumPostCard 
      post={item} 
      currentUserId={userId} 
      onDelete={() => handleDelete(item.id)} 
      onLike={() => handleLike(item.id, item.likes)} 
    />
  ), [userId, handleDelete, handleLike]);

  // ✅ Phase 23.1: Clean multi-card wireframe skeleton masking loaders look beautiful
  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        // ✅ Phase 23.3: Injected core refresh configurations wrapper block
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#2563EB" 
            colors={["#2563EB"]} 
          />
        }
        // ✅ Phase 23.2: Replaced boring text nodes with high-utility EmptyState configurations
        ListEmptyComponent={
          <EmptyState 
            icon="💬" 
            title="No Discussions Yet" 
            subtitle="Be the first student to launch a new discussion stream pipeline! 🚀" 
          />
        }
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
      <CreatePostModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={handleCreate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 16 },
  list: { paddingBottom: 100, flexGrow: 1 },
  floatingButton: { position: "absolute", bottom: 25, right: 20, backgroundColor: "#2563EB", width: 62, height: 62, borderRadius: 31, justifyContent: "center", alignItems: "center", elevation: 8 },
  floatingButtonText: { color: "white", fontSize: 34, fontWeight: "bold" }
});

export default memo(DiscussionForumScreen);
