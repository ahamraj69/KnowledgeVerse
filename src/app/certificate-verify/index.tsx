import { Text, View } from "react-native";

export default function CertificateVerify() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#0B1220", // Hardened background maps context themes smoothly
      }}
    >
      <Text
        style={{
          fontSize: 26,
          fontWeight: "bold",
          marginBottom: 20,
          color: "white",
        }}
      >
        Certificate Verification
      </Text>

      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          color: "#9CA3AF",
          lineHeight: 24,
        }}
      >
        Verification lookup will be added in a future enhancement.
      </Text>
    </View>
  );
}
