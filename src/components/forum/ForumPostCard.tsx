import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { ForumPost } from "../../types/forum";

type Props = {
  post: ForumPost;
  currentUserId: string;
  onDelete?: () => void;
  onLike?: () => void;
};

export default function ForumPostCard({
  post,
  currentUserId,
  onDelete,
  onLike,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {post.title}
      </Text>

      <Text style={styles.author}>
        👤 {post.userName}
      </Text>

      <Text style={styles.content}>
        {post.content}
      </Text>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onLike}>
          <Text style={styles.like}>
            👍 {post.likes}
          </Text>
        </TouchableOpacity>

        <Text style={styles.reply}>
          💬 {post.replies}
        </Text>

        {post.userId === currentUserId && (
          <TouchableOpacity onPress={onDelete}>
            <Text style={styles.delete}>
              🗑 Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  author: {
    color: "#60A5FA",
    marginBottom: 10,
    fontSize: 14,
  },

  content: {
    color: "#E5E7EB",
    fontSize: 15,
    lineHeight: 22,
  },

  footer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  like: {
    color: "#FACC15",
    fontWeight: "600",
  },

  reply: {
    color: "#9CA3AF",
  },

  delete: {
    color: "#EF4444",
    fontWeight: "700",
  },
});