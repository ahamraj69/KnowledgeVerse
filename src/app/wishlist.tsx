import { useEffect, useState } from "react";
import {
    FlatList,
    Text,
    View,
} from "react-native";

import { getWishlist } from "../services/wishlistService";

export default function Wishlist() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    const data = await getWishlist();
    setCourses(data);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        ❤️ Wishlist
      </Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text
            style={{
              color: "#9CA3AF",
              marginTop: 40,
              textAlign: "center",
            }}
          >
            No saved courses yet.
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#1F2937",
              padding: 15,
              borderRadius: 10,
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
              }}
            >
              ❤️ {item.courseId}
            </Text>
          </View>
        )}
      />
    </View>
  );
}