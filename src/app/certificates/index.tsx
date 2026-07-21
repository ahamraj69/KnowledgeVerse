import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
// ✅ FIXED: Standardised import path directly onto your unified lib structure
import { subscribeCertificates } from "@/lib/certificateService";
import { Theme } from "@/theme/theme";

export default function CertificatesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    // ✅ FIXED: Added explicit string array typing closure to fix the implicit 'any' compiler blockage
    const unsubscribe = subscribeCertificates(user.uid, (data: any[]) => {
      setCertificates(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={styles.title}>🎓 Your Certificates</Text>
      <FlatList
        data={certificates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.courseTitle || "Course Completion"}</Text>
            <Text style={styles.cardMeta}>Issued on: {new Date(item.issuedAt).toLocaleDateString()}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Complete a course to unlock certificates!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 20 },
  title: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 },
  card: { backgroundColor: "#111827", padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  cardMeta: { color: "#9CA3AF", fontSize: 13, marginTop: 4 },
  emptyText: { color: "#6B7280", fontSize: 14 }
});
