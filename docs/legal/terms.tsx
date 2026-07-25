import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Typography } from "@/theme/theme";
import { BrandColors } from "@/theme/colors";

export default function TermsConditionsViewerScreen() {
  const router = useRouter();
  return (
    <View style={styles.viewportWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[Typography.heading, styles.title]}>Terms & Conditions</Text>
        <Text style={styles.meta}>Version Reference: 1.7.0-Release [INDEX]</Text>

        <Text style={styles.bodyText}>
          By initializing a session on KnowledgeVerse, you explicitly agree to comply with our community standard guidelines. 
          {"\n\n"}
          Users must refrain from automated scraping loops, database injection attempts, or brute-force activities. Instructors must submit valid, verified documentation before publishing courses. The system provides AI cognitive tips on an as-is baseline, and outputs should be verified against verified reference manuals [INDEX].
        </Text>

        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Accept and Close</Text>
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
