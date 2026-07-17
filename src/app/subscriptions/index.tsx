import { useCallback, useEffect, useState, useMemo } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native"; // ✅ Step 2: Added core Alert import

import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import {
  subscriptionPlans,
  SubscriptionPlan,
  UserSubscription,
  subscribeSubscription,
  hasPremiumAccess,
  activatePlan, // ✅ Step 2: Added activatePlan utility import
} from "@/services/subscriptionService";
import { Theme } from "@/theme/theme";

export default function SubscriptionScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeSubscription(user.uid, setSubscription);
    return () => unsubscribe();
  }, [user]);

  // ✅ Step 3: Trigger callback dispatches the local database change asynchronously
  const choosePlan = useCallback(async (plan: SubscriptionPlan) => {
    if (!user?.uid) return;

    if (!isConnected) {
      Alert.alert("Offline", "Please connect to network nodes to finalize plan updates.");
      return;
    }

    try {
      setUpdating(true);
      await activatePlan(user.uid, plan.id);

      Alert.alert(
        "Subscription Updated",
        `You are now on the ${plan.name} plan.`
      );
    } catch (e) {
      Alert.alert("Update Failed", "Could not complete the plan modification step.");
    } finally {
      setUpdating(false);
    }
  }, [user, isConnected]);

  const renderPlan = useCallback(({ item }: { item: SubscriptionPlan }) => {
    const recommended = item.id === "premium_yearly";
    const isActivePlan = subscription?.planId === item.id;

    return (
      <View style={[styles.card, recommended && styles.recommendedCard]}>
        {recommended && (
          <Text style={styles.badge}>⭐ BEST VALUE</Text>
        )}

        <Text style={[Theme.text, styles.name]}>
          {item.name} {isActivePlan && "⭐️"}
        </Text>

        <Text style={[Theme.text, styles.price]}>
          {item.price === 0 ? "FREE" : `₹${item.price}`}
          <Text style={styles.durationText}>
            {item.price === 0 ? "" : item.duration === "yearly" ? " / yr" : " / mo"}
          </Text>
        </Text>

        <View style={styles.featuresList}>
          <Text style={styles.feature}>
            🔹 AI Messages: <Text style={styles.boldText}>{item.aiMessages}</Text>
          </Text>
          <Text style={styles.feature}>
            🔹 Premium Courses: <Text style={styles.boldText}>{item.premiumCourses ? "Yes" : "No"}</Text>
          </Text>
          <Text style={styles.feature}>
            🔹 Certificates: <Text style={styles.boldText}>{item.certificates ? "Yes" : "No"}</Text>
          </Text>
        </View>

        {/* ✅ Step 4: Bound tap triggers to trigger choice actions cleanly */}
        <TouchableOpacity
          style={[
            styles.button, 
            recommended && styles.recommendedButton,
            isActivePlan && styles.activePlanButton
          ]}
          onPress={() => choosePlan(item)}
          disabled={isActivePlan || updating}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isActivePlan ? "Current Active Plan" : "Choose Plan"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [subscription, choosePlan, updating]);

  const listHeader = useMemo(() => {
    const isPremium = hasPremiumAccess(subscription);
    const rawPlanLabel = subscription?.planId || "free";
    const localizedPlanName = rawPlanLabel.replace("_", " ").toUpperCase();

    return (
      <View style={styles.headerContainer}>
        <View style={styles.currentPlanCard}>
          <Text style={styles.currentPlanTitle}>Current Plan</Text>
          <Text style={styles.currentPlanText}>{localizedPlanName}</Text>
          <Text style={[styles.currentPlanStatus, { color: isPremium ? "#10B981" : "#A3A3A3" }]}>
            {isPremium ? "Premium Active ✅" : "Free Plan Base Tier"}
          </Text>
          
          {/* ✅ Step 5: Rendered formatted epoch dates smoothly inside status rows */}
          <Text style={styles.expiry}>
            Expires: {subscription?.expiresAt ? new Date(subscription.expiresAt).toLocaleDateString() : "--"}
          </Text>
        </View>

        <Text style={[Theme.text, styles.mainTitle]}>💎 KnowledgeVerse Premium</Text>
        <Text style={[Theme.muted, styles.mainSubtitle]}>
          Supercharge your learning with advanced AI capabilities and exclusive textbook matrices.
        </Text>
      </View>
    );
  }, [subscription]);

  return (
    <View style={Theme.screen}>
      <FlatList
        data={subscriptionPlans}
        renderItem={renderPlan}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={listHeader}
        removeClippedSubviews={true}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={2}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  headerContainer: { marginBottom: 24 },
  currentPlanCard: { backgroundColor: "#1E293B", padding: 18, borderRadius: 14, marginBottom: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  currentPlanTitle: { fontSize: 14, fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 },
  currentPlanText: { fontSize: 22, fontWeight: "bold", color: "#38BDF8", marginTop: 6 },
  currentPlanStatus: { marginTop: 8, fontSize: 15, fontWeight: "600" },
  // ✅ Step 6: Appended clear neutral label style tokens
  expiry: {
    marginTop: 8,
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500"
  },
  mainTitle: { fontSize: 26, fontWeight: "bold" },
  mainSubtitle: { fontSize: 14, marginTop: 6, lineHeight: 22 },
  card: { backgroundColor: "#111827", padding: 24, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  recommendedCard: { borderWidth: 2, borderColor: "#2563EB", backgroundColor: "#111C2E" },
  badge: { color: "#38BDF8", fontWeight: "bold", fontSize: 12, letterSpacing: 1, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "bold" },
  price: { fontSize: 34, fontWeight: "800", marginVertical: 14, color: "white" },
  durationText: { fontSize: 14, fontWeight: "500", color: "#9CA3AF" },
  featuresList: { marginVertical: 8, gap: 8 },
  feature: { fontSize: 15, color: "#D1D5DB" },
  boldText: { color: "white", fontWeight: "600" },
  button: { marginTop: 24, backgroundColor: "#1F2937", padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", minHeight: 52, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  recommendedButton: { backgroundColor: "#2563EB", borderColor: "transparent" },
  activePlanButton: { backgroundColor: "rgba(16,185,129,0.1)", borderColor: "#10B981", opacity: 0.9 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
