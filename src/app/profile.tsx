import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { auth, db } from "../lib/firebase";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setProfile({
          name: "Unknown User",
          email: user.email,
          role: "student",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="white" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#0B1220",
      }}
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 25,
        }}
      >
        👤 My Profile
      </Text>

      <View
        style={{
          backgroundColor: "#1F2937",
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "#9CA3AF",
            fontSize: 14,
          }}
        >
          Name
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 5,
          }}
        >
          {profile?.name || "Not Available"}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#1F2937",
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#9CA3AF" }}>
          Email
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 18,
            marginTop: 5,
          }}
        >
          {profile?.email}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#1F2937",
          padding: 20,
          borderRadius: 15,
          marginBottom: 20,
        }}
      >
        <Text style={{ color: "#9CA3AF" }}>
          Role
        </Text>

        <Text
          style={{
            color: "#10B981",
            fontSize: 18,
            fontWeight: "bold",
            marginTop: 5,
            textTransform: "capitalize",
          }}
        >
          {profile?.role}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#2563EB",
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          ✏️ Edit Profile
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}