import { ActivityIndicator, Text, View } from "react-native";
import { useLoading } from "../context/LoadingContext";

export default function GlobalLoader() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <ActivityIndicator size="large" color="#2563EB" />
      <Text style={{ color: "white", marginTop: 10 }}>
        Loading...
      </Text>
    </View>
  );
}