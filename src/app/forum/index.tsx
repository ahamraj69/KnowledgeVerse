import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import CreatePostModal from "../../components/forum/CreatePostModal";
import ForumPostCard from "../../components/forum/ForumPostCard";
import { useAuth } from "../../context/AuthContext";
import {
  createForumPost,
  deleteForumPost,
  getForumPosts,
  likeForumPost,
} from "../../services/forumService";
import { ForumPost } from "../../types/forum";

export default function DiscussionForumScreen() {
  const { user } = useAuth();
  
  const userId = user?.uid || "demo-user";
  const userName = user?.displayName || "Student";

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getForumPosts();
      setPosts(data);
    } catch (error) {
      console.log("Error loading forum database nodes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      const data = await getForumPosts();
      setPosts(data);
    } catch (error) {
      console.log("Pull refresh cycle failure:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreate = async (
    title: string,
    content: string
  ) => {
    await createForumPost({
      userId,
      userName,
      title,
      content,
      createdAt: Date.now(),
      likes: 0,
      replies: 0,
    });

    await loadPosts();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this discussion?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteForumPost(id);
              await loadPosts();
            } catch (error) {
              console.log("Delete failed:", error);
            }
          },
        },
      ]
    );
  };

  const handleLike = async (
    id: string,
    likes: number
  ) => {
    if (likedPosts.includes(id)) return;

    try {
      await likeForumPost(id, likes);
      setLikedPosts((prev) => [...prev, id]);
      await loadPosts();
    } catch (error) {
      console.log("Error liking post:", error);
    }
  };

  if (loading && !refreshing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0F172A",
        }}
      >
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ForumPostCard
            post={item}
            currentUserId={userId}
            onDelete={() => handleDelete(item.id)}
            onLike={() => handleLike(item.id, item.likes)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#2563EB"
            colors={["#2563EB"]}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              marginTop: 80,
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: "bold",
                marginTop: 15,
                textAlign: "center",
              }}
            >
              No discussions yet
            </Text>

            <Text
              style={{
                color: "#9CA3AF",
                marginTop: 8,
                textAlign: "center",
                fontSize: 15,
                lineHeight: 22,
              }}
            >
              Be the first student to start a discussion.
            </Text>
          </View>
        }
        contentContainerStyle={{
          paddingBottom: 100, // Safe padding spacer block so content doesn't hide behind floating button
          flexGrow: 1,
        }}
      />

      {/* ✅ Step 4 — Styled Floating Action Button Widget */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>

      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
    padding: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#2563EB",
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
    marginTop: -3, // Micro alignment adjustment for perfect center font tracking
  },
});
