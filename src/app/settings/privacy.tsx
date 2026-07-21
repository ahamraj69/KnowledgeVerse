import { Theme } from "@/theme/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function PrivacyPolicyScreen() {
  return (
    <View style={[Theme.screen, styles.container]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🔐 Privacy & Data Governance Statement</Text>
        <Text style={styles.body}>
          KnowledgeVerse values the confidentiality of student educational metadata. All collected telemetry logs, progress timelines, and personalized tutor conversation transcripts are stored securely using cloud infrastructure guidelines.{"\n\n"}
          We execute strict resource access locks so that no user can intersect profile properties outside of authenticated bounds. No structural data packets are transferred to external analytical profiles or monetization entities. Your learning footprint remains completely isolated, confidential, and safe.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 24 },
  content: { paddingTop: 10, paddingBottom: 30 },
  title: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  body: { color: "#9CA3AF", fontSize: 15, lineHeight: 24, textAlign: "justify" }
});
