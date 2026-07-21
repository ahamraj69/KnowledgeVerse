import { StyleSheet, View } from "react-native";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  // Forces boundaries constraint limits securely between 0 and 100 percent
  const validatedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      <View style={[styles.fill, { width: `${validatedProgress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: "#1F2937",
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    marginVertical: 8,
  },
  fill: {
    backgroundColor: "#2563EB",
    height: "100%",
    borderRadius: 10,
  },
});
