import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View, Platform, Alert } from "react-native";
// ✅ Step 9 FIXED: Imported native clipboard package for hardware text processing
import * as Clipboard from "expo-clipboard";

interface MessageBubbleProps {
  message: string;
  user: boolean;
}

export default function MessageBubble({ message, user }: MessageBubbleProps) {
  // ✅ Step 9 FIXED: Long press trigger interaction safely extracts element text straight into memory context
  const handleCopyMessage = async () => {
    await Clipboard.setStringAsync(message);
    if (Platform.OS === "android") {
      ToastAndroid.show("Text copied to clipboard", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied", "Message text moved to clipboard system successfully.");
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, user ? styles.user : styles.ai]}
      onLongPress={handleCopyMessage}
      delayLongPress={450}
      activeOpacity={0.9}
    >
      <Text style={styles.text}>{message}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 14, borderRadius: 16, marginVertical: 6, maxWidth: "85%", borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  user: { backgroundColor: "#2563EB", alignSelf: "flex-end", borderBottomRightRadius: 4 },
  ai: { backgroundColor: "#1F2937", alignSelf: "flex-start", borderBottomLeftRadius: 4, borderColor: "rgba(255,255,255,0.04)" },
  text: { color: "#FFFFFF", fontSize: 16, lineHeight: 22, fontWeight: "500" },
});
