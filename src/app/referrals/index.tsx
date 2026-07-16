import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
// ✅ Step 3: Updated named imports for background analytics calculation loops
import {
    applyReferralCode,
    ReferralProfile,
    subscribeReferralHistory,
    subscribeReferralProfile,
} from "@/services/referralService";
import { Theme } from "@/theme/theme";

export default function ReferralScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();

  const [profile, setProfile] = useState<ReferralProfile | null>(null);
  const [referralInput, setReferralInput] = useState("");
  const [processing, setProcessing] = useState(false);
  
  // ✅ Step 4: Instantiated referral total metrics count state tracker
  const [totalReferrals, setTotalReferrals] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeReferralProfile(user.uid, setProfile);
    return () => unsubscribe();
  }, [user]);

  // ✅ Step 5: Dual real-time connection listens for downstream validation logs
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeReferralHistory(user.uid, setTotalReferrals);
    return () => unsubscribe();
  }, [user]);

  const copyCode = useCallback(async () => {
    if (!profile?.code) return;
    await Clipboard.setStringAsync(profile.code);
    Alert.alert("Copied", "Referral code copied.");
  }, [profile]);

  const shareCode = useCallback(async () => {
    if (!profile?.code) return;
    try {
      await Share.share({
        message: `Join KnowledgeVerse!\n\nUse my referral code:\n\n${profile.code}`,
      });
    } catch {
      if (__DEV__) console.log("Native share failure trace intercepted");
    }
  }, [profile]);

  const applyCode = useCallback(async () => {
    const targetInput = referralInput.trim();
    if (!targetInput) {
      Alert.alert("Input Code", "Please enter a referral voucher string first.");
      return;
    }

    if (!user?.uid) return;

    if (!isConnected) {
      Alert.alert("Offline", "Please connect to network nodes to verify profiles.");
      return;
    }

    try {
      setProcessing(true);
      const message = await applyReferralCode(user.uid, targetInput);
      
      Alert.alert("Referral", message);
      if (message.includes("successfully")) {
        setReferralInput("");
      }
    } catch (e) {
      Alert.alert("Error", "Could not complete referral application parameters.");
    } finally {
      setProcessing(false);
    }
  }, [user, referralInput, isConnected]);

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={[Theme.text, styles.title]}>
        Referral Program
      </Text>

      <Text style={styles.code}>
        {profile?.code ?? "--"}
      </Text>

      <Text style={[Theme.text, styles.points]}>
        Reward Points{"\n"}
        <Text style={styles.pointsValue}>{profile?.rewardPoints ?? 0}</Text>
      </Text>

      {/* ✅ Step 6: Rendered comprehensive statistical telemetry dashboard block */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Referral Statistics</Text>
        <Text style={styles.statsText}>
          Total Referrals: <Text style={styles.boldText}>{totalReferrals}</Text>
        </Text>
        <Text style={styles.statsText}>
          Reward Points: <Text style={styles.boldText}>{profile?.rewardPoints ?? 0}</Text>
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter Referral Code"
          placeholderTextColor="#9CA3AF"
          value={referralInput}
          onChangeText={setReferralInput}
          autoCapitalize="characters"
          editable={!processing}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, styles.applyBtn, { opacity: processing ? 0.6 : 1 }]}
          onPress={applyCode}
          disabled={processing}
        >
          <Text style={styles.buttonText}>
            Apply Referral Code
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerRow} />

      <TouchableOpacity
        style={styles.button}
        onPress={copyCode}
        disabled={processing}
      >
        <Text style={styles.buttonText}>
          Copy Code
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={shareCode}
        disabled={processing}
      >
        <Text style={styles.buttonText}>
          Share Referral
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 24,
  },
  code: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#38BDF8",
    marginBottom: 16,
    letterSpacing: 1,
    backgroundColor: "#111827",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  points: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#9CA3AF",
    lineHeight: 26,
  },
  pointsValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#10B981",
  },
  // ✅ Step 7: Configured specified theme-harmonized token options natively
  statsCard: {
    width: "100%",
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(56,189,248,0.15)",
  },
  statsTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
    color: "white",
  },
  statsText: {
    fontSize: 15,
    marginBottom: 8,
    color: "#9CA3AF",
  },
  boldText: {
    color: "white",
    fontWeight: "700",
  },
  formContainer: {
    width: "100%",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#111827",
    color: "white",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
  },
  applyBtn: {
    backgroundColor: "#10B981",
  },
  secondaryButton: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  dividerRow: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
