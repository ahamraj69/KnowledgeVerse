import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
// ✅ FIXED: Adjusted imports directly onto the primary src/lib workspace module
import { subscribeToForumPosts } from "@/lib/forumService";
import { Theme } from "@/theme/theme";

export default function ForumScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ FIXED: Strong baseline signature declaration clears type property tracking constraints
    const unsubscribe = subscribeToForumPosts((livePosts: any[]) => {
      setPosts(livePosts);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={styles.title}>💬 Discussion Forums</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.author}>{item.authorName || "Student"}</Text>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 20 },
  title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 12, marginBottom: 12 },
  author: { color: "#38BDF8", fontWeight: "bold", fontSize: 14 },
  content: { color: "white", marginTop: 6, fontSize: 15 }
});
