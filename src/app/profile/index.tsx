import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Alert,
  Image, // ✅ Step 2: Added core Image module import
  ScrollView,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
} from "@/services/userService";
import { Theme } from "@/theme/theme";

export default function ProfileScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const loadProfile = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const data = await getUserProfile(user.uid);
      setProfile(data);
      
      if (data) {
        setName(data.name || "");
        setBio(data.bio ?? "");
      }
    } catch (e) {
      if (__DEV__) {
        console.log("Profile load exception caught:", e);
      }
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user, loadProfile]);

  const saveProfile = useCallback(async () => {
    const cleanName = name.trim();
    if (!cleanName) {
      Alert.alert("Required Field", "Name parameter cannot be blank.");
      return;
    }

    if (!user?.uid) return;

    if (!isConnected) {
      Alert.alert("Offline", "Please connect to the internet to save updates.");
      return;
    }

    try {
      setSaving(true);
      
      await updateUserProfile(user.uid, {
        name: cleanName,
        bio: bio.trim(),
      });

      // ✅ Step 7: Hydrates states with freshly committed values instantly
      await loadProfile();

      Alert.alert("Success", "Profile updated.");
    } catch (error) {
      Alert.alert("Error", "Unable to save profile configuration parameters.");
    } finally {
      setSaving(false);
    }
  }, [user?.uid, name, bio, isConnected, loadProfile]);

  if (loading) {
    return (
      <View style={[Theme.screen, styles.center]}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <ScrollView style={Theme.screen} contentContainerStyle={styles.container}>
      {/* ✅ Step 5: Rendered title block with visual anchor icon */}
      <Text style={[Theme.text, styles.title]}>
        👤 My Profile
      </Text>

      {/* ✅ Step 3: Adaptive profile fallback avatar handler */}
      <Image
        source={{
          uri:
            profile?.photoURL ||
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(name || "User") +
            "&background=1E293B&color=60A5FA",
        }}
        style={styles.avatar}
      />

      {/* ✅ Step 4: Center-aligned absolute verification role badge container */}
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>
          {profile?.role?.toUpperCase() ?? "STUDENT"}
        </Text>
      </View>

      <Text style={[Theme.text, styles.label]}>
        Name
      </Text>
      <TextInput
        value={name}
        onChangeText={setName}
        editable={!saving}
        placeholder="Enter your name"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        maxLength={60}
      />

      <Text style={[Theme.text, styles.label]}>
        Email
      </Text>
      <Text style={styles.value}>
        {profile?.email ?? user?.email ?? "-"}
      </Text>

      <Text style={[Theme.text, styles.label]}>
        Bio
      </Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        editable={!saving}
        placeholder="Tell the community about your learning goals..."
        placeholderTextColor="#9CA3AF"
        multiline={true}
        numberOfLines={4}
        style={[styles.input, styles.multilineInput]}
        maxLength={400}
      />

      <TouchableOpacity
        style={[styles.saveButton, { opacity: saving ? 0.6 : 1 }]}
        onPress={saveProfile}
        disabled={saving}
        activeOpacity={0.8}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveText}>Save Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  // ✅ Step 6: Mounted specified avatar and badge layout style parameters
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginVertical: 20,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.05)",
  },
  roleBadge: {
    backgroundColor: "#2563EB",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 25,
  },
  roleText: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: 0.5,
    fontSize: 13,
  },
  label: {
    fontWeight: "700",
    marginTop: 18,
    fontSize: 13,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 12,
    marginBottom: 4,
    fontWeight: "500",
    paddingLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    backgroundColor: "#111827",
    color: "white",
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
    lineHeight: 22,
  },
  saveButton: {
    backgroundColor: "#2563EB",
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
