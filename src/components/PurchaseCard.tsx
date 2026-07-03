import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
  price: number;
  onWishlist: () => void;
  onBuy: () => void;
}

export default function PurchaseCard({
  price,
  onWishlist,
  onBuy,
}: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#0B1220",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
        }}
      >
        📚 Course Details
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          marginTop: 15,
          marginBottom: 30,
          fontSize: 16,
        }}
      >
        Purchase this course to unlock all lessons.
      </Text>

      <TouchableOpacity
        onPress={onWishlist}
        style={{
          backgroundColor: "#DC2626",
          padding: 15,
          borderRadius: 12,
          marginBottom: 15,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          ❤️ Add to Wishlist
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onBuy}
        style={{
          backgroundColor: "#2563EB",
          padding: 15,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          💳 Buy Course ₹{price}
        </Text>
      </TouchableOpacity>
    </View>
  );
}