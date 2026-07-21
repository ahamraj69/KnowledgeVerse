import { UserProfile } from "@/types/profile";
import { StyleSheet, Text, View } from "react-native";
import ProfileAvatar from "./ProfileAvatar";

export default function ProfileHeader({ profile, onAvatarPress }: { profile: UserProfile; onAvatarPress: () => void; }) {
  return (
    <View style={styles.container}>
      <ProfileAvatar url={profile.photoURL} name={profile.displayName} onPress={onAvatarPress} />
      <Text style={styles.name}>{profile.displayName}</Text>
      <Text style={styles.email}>{profile.email}</Text>
      {profile.bio ? <Text style={styles.bio}>{profile.bio}</Text> : null}
      <View style={styles.locRow}>
        <Text style={styles.metaText}>📍 {profile.country || "India"}</Text>
        {profile.school ? <Text style={styles.metaText}>🏫 {profile.school}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 24, backgroundColor: "#111827", borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  name: { color: "white", fontSize: 22, fontWeight: "bold", marginTop: 12 },
  email: { color: "#9CA3AF", fontSize: 14, marginTop: 2 },
  bio: { color: "#CBD5E1", fontSize: 14, textAlign: "center", marginTop: 10, paddingHorizontal: 20, lineHeight: 20 },
  locRow: { flexDirection: "row", gap: 14, marginTop: 12, flexWrap: "wrap", justifyContent: "center" },
  metaText: { color: "#38BDF8", fontSize: 13, fontWeight: "600" }
});
