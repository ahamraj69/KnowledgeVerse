import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Comment } from "../../types/comment";

// ✅ FIXED: Added currentUserId? string directly to the Props signature contract
type Props = {
  comment: Comment;
  currentUserId?: string; 
  onEdit?: (comment: Comment) => void;
  onDelete?: (comment: Comment) => void;
};

export default function CommentCard({
  comment,
  currentUserId,
  onEdit,
  onDelete,
}: Props) {
  const isOwner = currentUserId === comment.userId;

  return (
    <View
      style={{
        backgroundColor: "#1F2937",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 16,
        }}
      >
        {comment.userName}
      </Text>

      <Text
        style={{
          color: "#D1D5DB",
          marginTop: 8,
          lineHeight: 22,
        }}
      >
        {comment.text}
      </Text>

      {isOwner && (
        <View
          style={{
            flexDirection: "row",
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => onEdit?.(comment)}
            style={{ marginRight: 20 }}
          >
            <Text
              style={{
                color: "#2563EB",
                fontWeight: "600",
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete?.(comment)}
          >
            <Text
              style={{
                color: "#EF4444",
                fontWeight: "600",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
