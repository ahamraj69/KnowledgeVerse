import { StyleSheet, Text, View } from "react-native";

export default function UploadProgress({ progress }: { progress: number }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Uploading... {progress}%</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: 110, alignItems: "flex-end" },
  text: { color: "#38BDF8", fontSize: 12, fontWeight: "700", marginBottom: 4 },
  barBackground: { width: "100%", height: 6, backgroundColor: "#1F2937", borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: "#2563EB" }
});
