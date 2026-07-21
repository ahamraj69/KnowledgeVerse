import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function TypingIndicator() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#38BDF8" size="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
