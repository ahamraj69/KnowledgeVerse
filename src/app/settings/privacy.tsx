import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { executeCompleteAccountDataPurge } from "@/lib/privacy/accountDeletionService";
import { generateUserDataPortabilityExport } from "@/lib/privacy/dataExportService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { BrandColors } from "@/theme/colors";
import { Typography } from "@/theme/theme";

export default function PrivacySettingsScreen() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [aiPersonalization, setAIPersonalization] = useState(true);

  // ✅ Step 4 Integration: Handles secure data packaging extraction
  const runDataPortabilityExportWorkflow = useCallback(async () => {
    try {
      setIsProcessing(true);
      await generateUserDataPortabilityExport();
    } catch (e) {
      Alert.alert("Export Failed", "Could not assemble profile metadata package.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // ✅ Step 3 Integration: Handles cascade user account deletion purge
  const triggerAccountDeletionConfirmationFlow = () => {
    Alert.alert(
      "⚠️ PERMANENT DATA PURGE",
      "Are you absolutely certain you want to delete your KnowledgeVerse account? This action permanently removes your profile, study progress, badges, and credentials. It cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "DELETE EVERYTHING", 
          style: "destructive", 
          onPress: async () => {
            try {
              setIsProcessing(true);
              const result = await executeCompleteAccountDataPurge();
              if (result.success) {
                Alert.alert("Purge Completed", result.message);
                router.replace("/login" as any);
              } else {
                Alert.alert("Deletion Blocked", result.message);
              }
            } catch (e) {
              Alert.alert("Error", "Could not complete account destruction routine.");
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ProtectedRoute allow={["student", "teacher", "admin"]}>
      <View style={styles.viewportWrapper}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[Typography.heading, styles.title]}>Privacy Control Hub</Text>
          <Text style={styles.sub}>Step 8: Manage profile visibility, data exports, and right-to-be-forgotten deletion workflows [1].</Text>

          {/* Toggle Controls Area */}
          <View style={styles.sectionBox}>
            <View style={styles.toggleRow}>
              <View style={styles.textColumn}>
                <Text style={styles.toggleLabel}>Anonymous Telemetry Share</Text>
                <Text style={styles.toggleSub}>Allow the system to aggregate background performance benchmarks [1].</Text>
              </View>
              <Switch value={shareAnalytics} onValueChange={setShareAnalytics} trackColor={{ true: BrandColors.primary }} />
            </View>

            <View style={[styles.toggleRow, styles.borderTop]}>
              <View style={styles.textColumn}>
                <Text style={styles.toggleLabel}>AI Personalization Feedback</Text>
                <Text style={styles.toggleSub}>Allow the AI Tutor to use recent quiz scores to tailor motivational tips [1].</Text>
              </View>
              <Switch value={aiPersonalization} onValueChange={setAIPersonalization} trackColor={{ true: BrandColors.primary }} />
            </View>
          </View>

          {/* Portability Action Section */}
          <Text style={styles.sectionHeader}>Data Portability Rights</Text>
          <TouchableOpacity style={styles.actionCard} onPress={runDataPortabilityExportWorkflow} disabled={isProcessing} activeOpacity={0.8}>
            <Text style={styles.cardIcon}>📥</Text>
            <View style={styles.textColumn}>
              <Text style={styles.cardTitle}>Download My Platform Archive</Text>
              <Text style={styles.cardSub}>Assembles profiles, achievements, and statistics logs into a JSON document.</Text>
            </View>
          </TouchableOpacity>

          {/* Destructive Action Section */}
          <Text style={styles.sectionHeader}>Danger Zone</Text>
          <TouchableOpacity style={[styles.actionCard, styles.dangerCard]} onPress={triggerAccountDeletionConfirmationFlow} disabled={isProcessing} activeOpacity={0.8}>
            <Text style={styles.cardIcon}>⚠️</Text>
            <View style={styles.textColumn}>
              <Text style={[styles.cardTitle, styles.dangerText]}>Permanently Delete My Account</Text>
              <Text style={styles.cardSub}>Instantly wipes your authentication profile and deletes your entire data trace.</Text>
            </View>
          </TouchableOpacity>

          {isProcessing && <ActivityIndicator size="small" color={BrandColors.primary} style={styles.loaderSpacing} />}
        </ScrollView>
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 20, paddingBottom: 50 },
  title: { color: "white", fontWeight: "bold" },
  sub: { color: BrandColors.textMutedDark, fontSize: 13, marginTop: 4, marginBottom: 24, lineHeight: 18 },
  sectionHeader: { color: "white", fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12, marginTop: 14 },
  sectionBox: { backgroundColor: "#111827", borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", overflow: "hidden", marginBottom: 20 },
  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, gap: 12 },
  borderTop: { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.03)" },
  textColumn: { flex: 1 },
  toggleLabel: { color: "white", fontSize: 15, fontWeight: "600" },
  toggleSub: { color: BrandColors.textMutedDark, fontSize: 12, marginTop: 2, lineHeight: 16 },
  actionCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#111827", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", gap: 14, marginBottom: 20 },
  dangerCard: { borderColor: "rgba(239,68,68,0.2)", backgroundColor: "rgba(239,68,68,0.02)" },
  cardIcon: { fontSize: 24 },
  cardTitle: { color: "white", fontSize: 15, fontWeight: "bold" },
  dangerText: { color: "#EF4444" },
  cardSub: { color: BrandColors.textMutedDark, fontSize: 12, marginTop: 2, lineHeight: 16 },
  loaderSpacing: { marginTop: 14 }
});
