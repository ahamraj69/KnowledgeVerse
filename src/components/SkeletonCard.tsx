import { StyleSheet, View } from "react-native";

export default function SkeletonCard() {
  return <View style={styles.skeleton} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#1E293B",
    height: 100,
    borderRadius: 12,
    marginBottom: 15,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.02)",
  },
});
