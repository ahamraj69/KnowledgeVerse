import { useAuth } from "@/context/AuthContext";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, Clipboard, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ReferralsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const mockInviteCode = user?.uid ? `KV-${user.uid.substring(0, 6).toUpperCase()}` : "KV-LEARN";

  const handleShareLink = useCallback(async () => {
    try {
      await Share.share({
        message: `Join me on KnowledgeVerse! Let's study smarter together using personalized AI Tutors and interactive course materials. Code: ${mockInviteCode}`,
      });
    } catch (e) {
      console.log("Sharing error:", e);
    }
  }, [mockInviteCode]);

  const handleCopyCode = useCallback(() => {
    Clipboard.setString(mockInviteCode);
    Alert.alert("Copied! 🎉", "Your educational invite code has been copied to your clipboard.");
  }, [mockInviteCode]);

  return (
    <View style={[Theme.screen, styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>◀ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
      </View>

      <View style={styles.contentCard}>
        <Text style={styles.graphic}>🚀</Text>
        <Text style={styles.title}>Grow the Learning Circle</Text>
        <Text style={styles.description}>
          Share KnowledgeVerse with your classmates. Let them access course-aware AI assistance, practice exams, and adaptive revision tools.
        </Text>

        <TouchableOpacity style={styles.codeContainer} onPress={handleCopyCode} activeOpacity={0.7}>
          <Text style={styles.codeText}>{mockInviteCode}</Text>
          <Text style={styles.copyHint}>Tap to Copy Code</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShareLink} activeOpacity={0.85}>
          <Text style={styles.shareBtnText}>Share Study Invitation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 20 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 10, marginBottom: 30 },
  backBtn: { backgroundColor: "rgba(255,255,255,0.05)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginRight: 14 },
  backBtnText: { color: "#38BDF8", fontSize: 14, fontWeight: "600" },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  contentCard: { backgroundColor: "#111827", borderRadius: 18, padding: 24, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  graphic: { fontSize: 54, marginBottom: 16 },
  title: { color: "white", fontSize: 22, fontWeight: "bold", textAlign: "center" },
  description: { color: "#9CA3AF", fontSize: 14, textAlign: "center", marginTop: 10, lineHeight: 22 },
  codeContainer: { borderStyle: "dashed", borderWidth: 2, borderColor: "#38BDF8", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24, marginVertical: 24, alignItems: "center", width: "100%", backgroundColor: "rgba(56,189,248,0.03)" },
  codeText: { color: "white", fontSize: 22, fontWeight: "bold", letterSpacing: 1 },
  copyHint: { color: "#6B7280", fontSize: 11, fontWeight: "600", marginTop: 4, textTransform: "uppercase" },
  shareBtn: { backgroundColor: "#2563EB", paddingVertical: 14, width: "100%", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  shareBtnText: { color: "white", fontSize: 16, fontWeight: "bold" }
});
