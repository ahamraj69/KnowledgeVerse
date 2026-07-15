import { useFocusEffect } from "expo-router";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import CachedImage from "@/components/CachedImage";
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";
import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import { db } from "@/lib/firebase";
import { Theme } from "@/theme/theme";

interface WishlistItem {
  id: string;
  courseId: string;
  title: string;
  thumbnail: string;
}

export default function WishlistScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWishlistData = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const q = query(collection(db, "wishlist"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      const wishlistArray: WishlistItem[] = [];

      snap.forEach((docItem) => {
        const data = docItem.data();
        wishlistArray.push({
          id: docItem.id,
          courseId: data.courseId || "",
          title: data.title || "Saved Curriculum",
          thumbnail: data.thumbnail || "",
        });
      });

      setItems(wishlistArray);
    } catch (e) {
      if (__DEV__) {
        console.log("Wishlist data payload synchronization fault node caught:", e);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      if (items.length === 0) {
        setLoading(true);
      }
      loadWishlistData();
    }, [items.length, loadWishlistData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWishlistData();
  }, [loadWishlistData]);

  const handleRemoveItem = useCallback(async (wishlistId: string) => {
    if (!isConnected) {
      Alert.alert("Offline Mode", "Cannot delete catalog index elements while working disconnected.");
      return;
    }

    try {
      // Optimistic state updates keep UI cycles lightning fast
      setItems((prev) => prev.filter((item) => item.id !== wishlistId));
      await deleteDoc(doc(db, "wishlist", wishlistId));
    } catch (e) {
      loadWishlistData(); // Recover accurate database state on failures
      Alert.alert("Action Failed", "Could not remove item from wishlist parameters loop.");
    }
  }, [isConnected, loadWishlistData]);

  const renderWishlistItem = useCallback(({ item }: { item: WishlistItem }) => {
    const safeThumbnail = item.thumbnail || "https://placehold.co";

    return (
      <View style={styles.wishlistCard}>
        <CachedImage uri={safeThumbnail} width={80} height={80} borderRadius={8} />
        <View style={styles.cardInfo}>
          <Text style={[Theme.text, styles.itemTitle]} numberOfLines={2}>{item.title}</Text>
          <TouchableOpacity 
            style={styles.removeTouchArea} 
            onPress={() => handleRemoveItem(item.id)}
            activeOpacity={0.7}
          >
            {/* ✅ Step 3: Mounted custom trash emoji visual anchor element label string */}
            <Text style={styles.removeText}>🗑 Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [handleRemoveItem]);

  const listHeader = useMemo(() => (
    <View>
      <Text style={[Theme.text, styles.mainTitle]}>❤️ My Wishlist</Text>
      {/* ✅ Step 5: Rendered active numerical total item counter string variables */}
      <Text style={styles.subtitle}>
        {items.length} saved course{items.length !== 1 ? "s" : ""}
      </Text>
    </View>
  ), [items.length]);

  if (loading && !refreshing) {
    return (
      <View style={[Theme.screen, styles.loadingPadding]}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  return (
    <View style={Theme.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderWishlistItem}
        ListHeaderComponent={listHeader}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#DC2626" colors={["#DC2626"]} />
        }
        // ✅ Step 4: Refactored descriptive text layouts clarify interaction loops elegantly
        ListEmptyComponent={
          <EmptyState 
            icon="❤️" 
            title="You haven't saved any courses yet." 
            subtitle="Tap ❤️ on any course to save it here." 
          />
        }
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  loadingPadding: { padding: 20 },
  mainTitle: { fontSize: 28, fontWeight: "bold" },
  // ✅ Step 5 Mounted Counter Layout Styles Specification Mapped
  subtitle: {
    color: "#9CA3AF",
    marginBottom: 20,
    fontSize: 15,
  },
  wishlistCard: { backgroundColor: "#111827", padding: 12, borderRadius: 12, flexDirection: "row", alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  cardInfo: { flex: 1, marginLeft: 14, height: 80, justifyContent: "space-between", paddingVertical: 2 },
  itemTitle: { fontSize: 16, fontWeight: "600", lineHeight: 22 },
  removeTouchArea: { alignSelf: "flex-start", marginTop: 4 },
  removeText: { color: "#EF4444", fontSize: 14, fontWeight: "600" }
});
