import { Text, View } from "react-native";
import { Review } from "../services/reviewService";

export default function ReviewCard({
  review,
}: {
  review: Review;
}) {
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
        {review.userName}
      </Text>

      <Text
        style={{
          color: "#FACC15",
          marginTop: 6,
        }}
      >
        {"⭐".repeat(review.rating)}
      </Text>

      <Text
        style={{
          color: "#D1D5DB",
          marginTop: 8,
          lineHeight: 20,
        }}
      >
        {review.review}
      </Text>
    </View>
  );
}
