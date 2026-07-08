import { Text, View } from "react-native";
import { useNetwork } from "../context/NetworkContext";

export default function OfflineBanner() {
  const { isConnected } = useNetwork();

  if (isConnected) return null;

  return (
    <View
      style={{
        backgroundColor: "#DC2626",
        padding: 12,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
        }}
      >
        📡 You're Offline
      </Text>
    </View>
  );
}