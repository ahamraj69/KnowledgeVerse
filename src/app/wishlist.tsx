import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { subscribeToWishlist, WishlistItem } from "../services/wishlistService"; // ✅ FIXED
import { Theme } from "../theme/theme";

export default function WishlistScreen() {
  const { user } = useAuth(); 
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user?.uid) return;
      setLoading(true);

      const unsubscribe = subscribeToWishlist(user.uid, (liveItems) => {
        setItems(liveItems);
        setLoading(false);
      });

      return () => unsubscribe();
    }, [user?.uid])
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <View style={Theme.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={Theme.text}>Course Reference: {item.courseId}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={Theme.text}>Your wishlist is empty.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { padding: 16, backgroundColor: "#111827", margin: 10, borderRadius: 10 }
});
