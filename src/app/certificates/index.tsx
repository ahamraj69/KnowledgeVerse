import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FlatList,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import {
    Certificate,
    subscribeCertificates,
} from "@/services/certificateService";
import { Theme } from "@/theme/theme";

export default function CertificatesScreen() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeCertificates(user.uid, (data) => {
      setCertificates(data);
    });

    return () => unsubscribe();
  }, [user]);

  const shareCertificate = useCallback(async (certificate: Certificate) => {
    try {
      await Share.share({
        message: `🏆 Certificate of Completion\n\nStudent: ${certificate.studentName}\n\nCourse: ${certificate.courseTitle}\n\nVerification ID: ${certificate.certificateId}\n\nIssued by: KnowledgeVerse`,
      });
    } catch {
      if (__DEV__) {
        console.log("Unable to share certificate.");
      }
    }
  }, []);

  const renderCertificateItem = useCallback(({ item }: { item: Certificate }) => {
    return (
      <View style={styles.certificate}>
        <Text style={styles.logo}>
          🏆 KnowledgeVerse
        </Text>

        <Text style={styles.heading}>
          CERTIFICATE
        </Text>

        <Text style={styles.subHeading}>
          This certificate is proudly presented to
        </Text>

        <Text style={styles.studentName}>
          {item.studentName}
        </Text>

        <Text style={styles.description}>
          for successfully completing the course
        </Text>

        <Text style={styles.courseName}>
          {item.courseTitle}
        </Text>

        {/* ✅ Step 3: Mounted secure identification code text wrapper right under the title */}
        <Text style={styles.certificateId}>
          Certificate ID: {item.certificateId}
        </Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerTitle}>
              Issued By
            </Text>
            <Text style={styles.footerValue}>
              KnowledgeVerse
            </Text>
          </View>

          <View style={styles.footerRight}>
            <Text style={styles.footerTitle}>
              Date
            </Text>
            <Text style={styles.footerValue}>
              {item.issuedAt?.toDate
                ? item.issuedAt.toDate().toLocaleDateString()
                : "--"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => shareCertificate(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.shareButtonText}>
            Share Certificate
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [shareCertificate]);

  const listHeader = useMemo(() => (
    <View style={styles.headerContainer}>
      <Text style={[Theme.text, styles.mainTitle]}>🏆 Achievement Vault</Text>
      <Text style={[Theme.muted, styles.mainSubtitle]}>
        Your verified collection of graduation criteria benchmarks and credential course awards.
      </Text>
    </View>
  ), []);

  return (
    <View style={Theme.screen}>
      <FlatList
        data={certificates}
        keyExtractor={(item) => item.id}
        renderItem={renderCertificateItem}
        ListHeaderComponent={listHeader}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No certificates yet.
            </Text>
          </View>
        }
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  headerContainer: { marginBottom: 12 },
  mainTitle: { fontSize: 28, fontWeight: "bold" },
  mainSubtitle: { fontSize: 14, marginTop: 4, lineHeight: 22 },
  certificate: { backgroundColor: "#FFF8E7", borderRadius: 18, padding: 28, marginBottom: 24, borderWidth: 3, borderColor: "#D4AF37" },
  logo: { textAlign: "center", fontSize: 24, fontWeight: "bold", color: "#B8860B", marginBottom: 20 },
  heading: { textAlign: "center", fontSize: 30, fontWeight: "bold", color: "#222" },
  subHeading: { textAlign: "center", color: "#555", marginTop: 18, fontSize: 14 },
  studentName: { textAlign: "center", fontSize: 30, fontWeight: "bold", color: "#0F172A", marginVertical: 20 },
  description: { textAlign: "center", color: "#555", fontSize: 14 },
  courseName: { textAlign: "center", fontSize: 22, fontWeight: "700", color: "#2563EB", marginTop: 15 },
  // ✅ Step 4: Injected specified identification typography layout styles
  certificateId: {
    marginTop: 12,
    color: "#666",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  footerRight: { alignItems: "flex-end" },
  footerTitle: { color: "#777", fontSize: 13 },
  footerValue: { color: "#111", fontWeight: "bold", marginTop: 4, fontSize: 14 },
  shareButton: { marginTop: 24, backgroundColor: "#2563EB", paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center", minHeight: 44 },
  shareButtonText: { color: "white", fontWeight: "bold", fontSize: 15 },
  emptyContainer: { alignItems: "center", marginTop: 80 },
  emptyText: { color: "#9CA3AF", fontSize: 18, fontWeight: "500" },
});
