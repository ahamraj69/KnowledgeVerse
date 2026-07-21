import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import CommentCard from "./CommentCard";
import CommentInput from "./CommentInput";

import {
  addComment,
  deleteComment,
  getComments,
} from "@/lib/commentService";

import { Comment } from "../../types/comment";

type Props = {
  courseId: string;
  userId: string;
  userName: string;
};

export default function CommentsSection({
  courseId,
  userId,
  userName,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(courseId);
      setComments(data);
    } catch (error) {
      console.log("Error loading discussions list:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    await addComment({
      courseId,
      userId,
      userName,
      text,
      createdAt: Date.now(),
    });
    
    await loadComments();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(courseId, id);
      await loadComments();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ marginVertical: 30 }}
      />
    );
  }

  return (
    <View style={{ marginTop: 25, marginBottom: 20 }}>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 15,
          color: "white"
        }}
      >
        💬 Comments
      </Text>

      <CommentInput
        onSend={handleSend}
      />

      {comments.map((item) => (
        <CommentCard
          key={item.id || Math.random().toString()}
          comment={item}
          currentUserId={userId}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
    </View>
  );
}
