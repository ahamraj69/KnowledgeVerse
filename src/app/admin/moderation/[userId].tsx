import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TextInput, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useModeration } from "@/hooks/useModeration";
import ModerationHistoryCard from "@/components/moderation/ModerationHistoryCard";
import ActionButton from "@/components/moderation/ActionButton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Theme } from "@/theme/theme";

export default function UserEnforcementScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const { history, loading, escalation, syncUserMetrics, issueEnforcement } = useModeration(userId || "");

  const [reason, setReason] = useState("");

  useEffect(() => {
    if (userId) syncUserMetrics();
  }, [userId, syncUserMetrics]);

  const runEnforcementAction = useCallback(async (actionType: "warning" | "suspension" | "ban", duration?: number) => {
    if (!reason.trim()) {
      Alert.alert("Reason Required", "Please outline an explicit policy violation reason.");
      return;
    }
    try {
      await issueEnforcement(actionType, reason.trim(), duration);
      setReason("");
      Alert.alert("Success 🎉", "Moderation enforcement successfully committed and synced across database layers.");
    } catch (e) {
      Alert.alert("Fault", "Failed to commit user adjustment indices.");
    }
  }, [reason, issueEnforcement]);

  if (loading && history.length === 0) {
    return <View style={[Theme.screen, styles.center]}><ActivityIndicator size="large" color="#EF4444" /></View>;
  }

  return (
    <ProtectedRoute allow={["admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Enforcement Desk</Text>
          <Text style={styles.subtitle}>Target Account Profile UID: {userId}</Text>

          {/* ✅ Step 9 Repeat Offender Automated Detection Suggestions Box */}
          {escalation && (
            <View style={[styles.escalationBox, escalation.suggestedAction && styles.escalationAlertBorder]}>
              <Text style={styles.escalationHeading}>🤖 INTELLIGENT REPEAT OFFENDER METRICS</Text>
              <Text style={styles.escalationText}>Logged Violations: {escalation.warnings} Warnings • {escalation.suspensions} Suspensions</Text>
              {escalation.suggestedAction && (
                <Text style={styles.suggestionHighlight}>🎯 ESCALATION POLICY RECOMMENDATION: Use explicit '{escalation.suggestedAction.toUpperCase()}' action.</Text>
              )}
            </View>
          )}

          {/* Reason Input Box */}
          <Text style={styles.inputLabel}>POLICY VIOLATION ACTION REASON</Text>
          <TextInput 
            style={styles.input} 
            value={reason} 
            onChangeText={setReason} 
            placeholder="Type policy violation context description text here..." 
            placeholderTextColor="#4B5563" 
          />

          {/* Trigger Action Rows */}
          <Text style={styles.sectionHeading}>Enforcement Controls</Text>
          <View style={styles.actionGridRow}>
            <ActionButton title="Issue Warning" type="warn" onPress={() => runEnforcementAction("warning")} />
            <ActionButton title="Suspend 7 Days" type="suspend" onPress={() => runEnforcementAction("suspension", 7)} />
            <ActionButton title="Permanent Ban" type="ban" onPress={() => runEnforcementAction("ban")} />
          </View>

          {/* Enforcement History Feed */}
          <Text style={styles.sectionHeading}>📜 User Account Action Logs ({history.length})</Text>
          {history.map((record) => (
            <ModerationHistoryCard key={record.id} record={record} />
          ))}

        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { color: "white", fontSize: 24, fontWeight: "bold" },
  subtitle: { color: "#6B7280", fontSize: 12, marginTop: 4, marginBottom: 20 },
  escalationBox: { backgroundColor: "#111827", padding: 14, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  escalationAlertBorder: { borderColor: "rgba(239,68,68,0.25)", backgroundColor: "rgba(239,68,68,0.02)" },
  escalationHeading: { color: "#6B7280", fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginBottom: 4 },
  escalationText: { color: "white", fontSize: 14, fontWeight: "600" },
  suggestionHighlight: { color: "#F59E0B", fontSize: 12, fontWeight: "700", marginTop: 6 },
  inputLabel: { color: "#9CA3AF", fontSize: 11, fontWeight: "700", marginBottom: 6, letterSpacing: 0.3 },
  input: { backgroundColor: "#111827", padding: 14, borderRadius: 10, color: "white", marginBottom: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 15 },
  sectionHeading: { color: "white", fontSize: 15, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 12, marginTop: 14 },
  actionGridRow: { flexDirection: "row", gap: 10, marginBottom: 24 }
});
