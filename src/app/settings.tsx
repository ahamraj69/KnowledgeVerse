import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Settings() {
  const SettingItem = ({
    icon,
    title,
    color = "#1F2937",
    onPress,
  }: {
    icon: string;
    title: string;
    color?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: color,
        padding: 18,
        borderRadius: 12,
        marginBottom: 15,
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "600",
        }}
      >
        {icon} {title}
      </Text>
    </TouchableOpacity>
  );

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
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 30,
        }}
      >
        ⚙️ Settings
      </Text>

      <SettingItem
        icon="👤"
        title="Account"
        onPress={() => Alert.alert("Account", "Coming Soon")}
      />

      <SettingItem
        icon="🌙"
        title="Dark Mode"
        onPress={() => Alert.alert("Dark Mode", "Coming Soon")}
      />

      <SettingItem
        icon="🔔"
        title="Notifications"
        onPress={() => Alert.alert("Notifications", "Coming Soon")}
      />

      <SettingItem
        icon="🔒"
        title="Privacy"
        onPress={() => Alert.alert("Privacy", "Coming Soon")}
      />

      <SettingItem
        icon="❓"
        title="Help & Support"
        onPress={() => Alert.alert("Help", "Coming Soon")}
      />

      <SettingItem
        icon="⭐"
        title="Rate App"
        onPress={() => Alert.alert("Rate App", "Coming Soon")}
      />

      <SettingItem
        icon="📄"
        title="Terms & Conditions"
        onPress={() => Alert.alert("Terms", "Coming Soon")}
      />

      <SettingItem
        icon="ℹ️"
        title="About KnowledgeVerse"
        onPress={() =>
          Alert.alert(
            "KnowledgeVerse",
            "Version 1.0.0\n\nAI Learning Marketplace built with React Native + Expo + Firebase."
          )
        }
      />

      <View
        style={{
          marginTop: 40,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#9CA3AF",
          }}
        >
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}