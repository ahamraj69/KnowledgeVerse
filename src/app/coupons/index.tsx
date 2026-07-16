import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import {
    calculateDiscount,
    hasRedeemedCoupon,
    redeemCoupon,
    validateCoupon,
} from "@/services/couponService";
import { Theme } from "@/theme/theme";

export default function CouponVerificationScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();
  const [couponCode, setCouponCode] = useState("");
  const [checking, setChecking] = useState(false);

  const coursePrice = 999;

  // ✅ Step 2 FIXED: Enhanced error routing intercepts service errors to display useful warnings
  const handleApplyCoupon = useCallback(async () => {
    const cleanInput = couponCode.trim().toUpperCase();
    if (!cleanInput) {
      Alert.alert("Input Code", "Please key in a valid coupon token string first.");
      return;
    }

    if (!isConnected) {
      Alert.alert("Offline", "Please connect to network nodes to verify campaign listings.");
      return;
    }

    try {
      setChecking(true);

      // Service execution layer will propagate descriptive thrown errors natively on matches
      const coupon = await validateCoupon(cleanInput);

      if (
        user &&
        coupon.oneTime &&
        await hasRedeemedCoupon(user.uid, coupon.code)
      ) {
        Alert.alert(
          "Coupon Already Used",
          "This coupon can only be redeemed once."
        );
        return;
      }

      const finalPrice = calculateDiscount(coursePrice, coupon);

      Alert.alert(
        "Coupon Applied",
        `Original Price : ₹${coursePrice}\n\nFinal Price : ₹${finalPrice}`
      );

      if (user && coupon.oneTime) {
        await redeemCoupon(user.uid, coupon);
      }
      
      setCouponCode("");
    } catch (error) {
      // ✅ Captures precise thrown messages ('Coupon expired' / 'Coupon inactive') on validation failures
      Alert.alert(
        "Coupon",
        error instanceof Error ? error.message : "Unable to validate coupon."
      );
    } finally {
      setChecking(false);
    }
  }, [couponCode, isConnected, user]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🎫 Coupon Desk</Text>
      <Text style={[Theme.muted, styles.subtitle]}>
        Enter a valid campaign string or institutional token to apply percentage adjustments directly to your checkout.
      </Text>

      <View style={styles.checkoutSummary}>
        <Text style={styles.summaryLabel}>Cart Item Baseline:</Text>
        <Text style={styles.summaryValue}>₹{coursePrice}.00</Text>
      </View>

      <TextInput
        placeholder="ENTER COUPON CODE (e.g., KV100, NEW20)"
        placeholderTextColor="#9CA3AF"
        value={couponCode}
        onChangeText={setCouponCode}
        autoCapitalize="characters"
        editable={!checking}
        maxLength={20}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.verifyButton, { opacity: checking ? 0.6 : 1 }]}
        onPress={handleApplyCoupon}
        disabled={checking}
      >
        {checking ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.verifyButtonText}>Apply Promotion</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220" },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: "white", fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 24, lineHeight: 22 },
  checkoutSummary: { backgroundColor: "#111827", padding: 16, borderRadius: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  summaryLabel: { color: "#9CA3AF", fontSize: 15, fontWeight: "500" },
  summaryValue: { color: "white", fontSize: 18, fontWeight: "bold" },
  input: { backgroundColor: "#111827", color: "white", padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  verifyButton: { backgroundColor: "#10B981", padding: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", minHeight: 52 },
  verifyButtonText: { color: "white", fontWeight: "bold", fontSize: 16 }
});
