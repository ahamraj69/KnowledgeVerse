import { ScrollView, Text, View } from "react-native";

interface OutputConsoleProps {
  output: string;
  error?: string;
}

export default function OutputConsole({
  output,
  error,
}: OutputConsoleProps) {
  return (
    <View
      style={{
        backgroundColor: "#020617",
        borderRadius: 12,
        padding: 15,
        marginTop: 15,
        minHeight: 120,
        maxHeight: 250,
      }}
    >
      <Text
        style={{
          color: "#64748B",
          marginBottom: 10,
          fontWeight: "bold",
        }}
      >
        📤 Output
      </Text>

      <ScrollView>
        {error ? (
          <Text style={{ color: "#EF4444", fontFamily: "monospace" }}>
            ❌ {error}
          </Text>
        ) : (
          <Text style={{ color: "#22C55E", fontFamily: "monospace" }}>
            {output || "Run code to see output..."}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
