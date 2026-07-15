import { StyleSheet, Text, View } from "react-native";

// Clean explicit data interface declaration guarantees alignment across files
export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: any;
}

interface Props {
  review: Review;
}

export default function ReviewCard({ review }: Props) {
  // Generate visual stars array block up to rating parameters dynamically
  const starsStringText = "⭐".repeat(Math.max(1, Math.min(5, review.rating)));

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.userName}>👤 {review.userName}</Text>
        <Text style={styles.ratingStars}>{starsStringText}</Text>
      </View>
      
      {/* ✅ FIXED: Changed review.review property reference target over to review.comment */}
      <Text style={styles.commentMessage}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    color: "#60A5FA",
    fontWeight: "bold",
    fontSize: 15,
  },
  ratingStars: {
    fontSize: 14,
  },
  commentMessage: {
    color: "#E5E7EB",
    fontSize: 14,
    lineHeight: 20,
  },
});
