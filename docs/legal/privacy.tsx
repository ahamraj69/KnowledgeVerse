import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Typography } from "@/theme/theme";
import { BrandColors } from "@/theme/colors";

export default function PrivacyPolicyViewerScreen() {
  const router = useRouter();
  return (
    <View style={styles.viewportWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.heading, styles.title]}>User Privacy Policy</Text>
        <Text style={styles.meta}>Last Synchronized Revision: Version 1.7.0 • July 2026 [INDEX]</Text>

        <Text style={styles.bodyText}>
          KnowledgeVerse takes user privacy seriously. All data collected—including registration variables, learning progress tracking sheets, and AI Tutor memory nodes—is secured behind un-bypassable Firestore firewalls [INDEX]. 
          {"\n\n"}
          We do not sell, rent, or distribute individual learning histories or uploaded evaluation documents to external analytics frameworks. You retain full ownership of your data, with structural support to request exports or permanent data purges at any time [INDEX].
        </Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>◀ Acknowledge and Return</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  container: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingTop: 24, paddingBottom: 50 },
  title: { color: "white", fontWeight: "bold" },
  meta: { color: "#6B7280", fontSize: 12, marginTop: 4, marginBottom: 20 },
  bodyText: { color: "#CBD5E1", fontSize: 14, lineHeight: 22, fontWeight: "500" },
  backBtn: { backgroundColor: BrandColors.primary, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginTop: 32 },
  backText: { color: "white", fontWeight: "bold", fontSize: 14 }
});
