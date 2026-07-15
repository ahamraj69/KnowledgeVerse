import { useFocusEffect } from "expo-router";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

import EmptyState from "@/components/EmptyState";
import ReviewCard, { Review } from "@/components/ReviewCard";
import SkeletonCard from "@/components/SkeletonCard";
import { db } from "@/lib/firebase";
import { Theme } from "@/theme/theme";

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadGlobalReviews = useCallback(async () => {
    try {
      // Pulling universal evaluation logs ordered chronologically from firestore paths
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(20));
      const snap = await getDocs(q);
      const reviewsList: Review[] = [];

      snap.forEach((docItem) => {
        const data = docItem.data();
        reviewsList.push({
          id: docItem.id,
          courseId: data.courseId || "",
          userId: data.userId || "",
          userName: data.userName || "Verified Learner",
          rating: data.rating || 5,
          comment: data.comment || "Great material stream!",
        });
      });

      setReviews(reviewsList);
    } catch (error) {
      if (__DEV__) {
        console.log("Reviews extraction data sync exception caught:", error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (reviews.length === 0) {
        setLoading(true);
      }
      loadGlobalReviews();
    }, [reviews.length, loadGlobalReviews])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadGlobalReviews();
  }, [loadGlobalReviews]);

  const listHeader = useMemo(() => (
    <View>
      <Text style={[Theme.text, styles.mainTitle]}>⭐ Student Feedback</Text>
      <Text style={[Theme.muted, styles.subtitle]}>Real reviews and ratings left by verified KnowledgeVerse community members.</Text>
    </View>
  ), []);

  if (loading && !refreshing) {
    return (
      <View style={[Theme.screen, styles.loadingPadding]}>
        <SkeletonCard /><SkeletonCard /><SkeletonCard />
      </View>
    );
  }

  return (
    <View style={Theme.screen}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReviewCard review={item} />}
        ListHeaderComponent={listHeader}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" colors={["#F59E0B"]} />
        }
        ListEmptyComponent={
          <EmptyState 
            icon="⭐" 
            title="No Reviews Yet" 
            subtitle="This curriculum track feedback history ledger log will compile dynamically once students submit evaluations." 
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
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 24, lineHeight: 22 }
});
