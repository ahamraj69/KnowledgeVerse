import { TeacherProfile } from "@/types/teacher";
import { Image, StyleSheet, Text, View } from "react-native";

interface TeacherHeaderProps {
  teacher: TeacherProfile;
}

export default function TeacherHeader({ teacher }: TeacherHeaderProps) {
  const placeholderInitial = teacher.displayName ? teacher.displayName.substring(0, 1).toUpperCase() : "T";

  return (
    <View style={styles.container}>
      {teacher.photoURL ? (
        <Image source={{ uri: teacher.photoURL }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitialText}>{placeholderInitial}</Text>
        </View>
      )}

      <View style={styles.titleRow}>
        <Text style={styles.name}>{teacher.displayName}</Text>
        {teacher.verified && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✔️ VERIFIED</Text>
          </View>
        )}
      </View>

      {teacher.bio ? (
        <Text style={styles.bio}>{teacher.bio}</Text>
      ) : (
        <Text style={styles.bioPlaceholder}>Professional Instructor at KnowledgeVerse.</Text>
      )}

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>📍 {teacher.country || "India"}</Text>
        <Text style={styles.metaText}>💼 {teacher.experience} Yrs Exp</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20, backgroundColor: "#111827", borderRadius: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)", marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: "#2563EB" },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#1F2937", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#2563EB" },
  avatarInitialText: { color: "white", fontSize: 32, fontWeight: "bold" },
  titleRow: { flexDirection: "row", alignItems: "center", marginTop: 14, gap: 8, flexWrap: "wrap", justifyContent: "center" },
  name: { color: "white", fontSize: 22, fontWeight: "bold", textAlign: "center" },
  badge: { backgroundColor: "rgba(16,185,129,0.15)", paddingVertical: 2, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1, borderColor: "rgba(16,185,129,0.3)" },
  badgeText: { color: "#10B981", fontSize: 10, fontWeight: "700" },
  bio: { color: "#CBD5E1", fontSize: 14, textAlign: "center", marginTop: 8, paddingHorizontal: 10, lineHeight: 20 },
  bioPlaceholder: { color: "#6B7280", fontSize: 14, fontStyle: "italic", marginTop: 8 },
  metaRow: { flexDirection: "row", gap: 14, marginTop: 14 },
  metaText: { color: "#38BDF8", fontSize: 13, fontWeight: "600" }
});
