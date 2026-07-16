import { collection, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import EmptyState from "@/components/EmptyState";
import { db } from "@/lib/firebase";
import { Coupon } from "@/services/couponService";
import { Theme } from "@/theme/theme";

export default function CouponListScreen() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    // Standard real-time database listener registration mapping
    const unsubscribe = onSnapshot(
      collection(db, "coupons"),
      (snapshot) => {
        setCoupons(
          snapshot.docs.map(docItem => {
            const data = docItem.data();
            return {
              id: docItem.id,
              code: data.code || "",
              type: data.type === "percentage" ? "percentage" : "fixed",
              discount: Number(data.discount) || 0,
              expiry: Number(data.expiry) || 0,
              active: data.active ?? false,
              oneTime: data.oneTime ?? false,
            };
          })
        );
      },
      (error) => {
        if (__DEV__) console.log("Real-time coupon snapshot fault node:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const renderCouponItem = useCallback(({ item }: { item: Coupon }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <Text style={styles.code}>{item.code}</Text>
          <Text style={styles.discountText}>
            {item.type === "fixed" ? `₹${item.discount} OFF` : `${item.discount}% OFF`}
          </Text>
        </View>

        <View style={[styles.statusBadge, item.active ? styles.activeBadge : styles.disabledBadge]}>
          <Text style={[styles.statusText, item.active ? styles.activeText : styles.disabledText]}>
            {item.active ? "Active" : "Disabled"}
          </Text>
        </View>
      </View>
    );
  }, []);

  const listHeader = useMemo(() => (
    <View>
      <Text style={[Theme.text, styles.mainTitle]}>🏷️ Campaign Ledger</Text>
      <Text style={[Theme.muted, styles.subtitle]}>
        Available institutional promo vouchers and discount campaign tokens.
      </Text>
    </View>
  ), []);

  return (
    <View style={Theme.screen}>
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        renderItem={renderCouponItem}
        ListHeaderComponent={listHeader}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <EmptyState
            icon="🎫"
            title="No Active Campaigns"
            subtitle="Promotional coupon token matrices will reveal down inside this ledger array once configured."
          />
        }
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
    lineHeight: 22,
  },
  card: {
    padding: 18,
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: "#111827",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cardLeft: {
    flex: 1,
  },
  code: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    letterSpacing: 0.5,
  },
  discountText: {
    color: "#38BDF8",
    fontWeight: "600",
    fontSize: 15,
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  activeBadge: {
    backgroundColor: "rgba(16,185,129,0.1)",
    borderColor: "rgba(16,185,129,0.2)",
  },
  disabledBadge: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderColor: "rgba(239,68,68,0.2)",
  },
  statusText: {
    fontWeight: "700",
    fontSize: 13,
  },
  activeText: {
    color: "#10B981",
  },
  disabledText: {
    color: "#EF4444",
  },
});
