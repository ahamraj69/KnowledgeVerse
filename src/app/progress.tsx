import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getProgress } from "../lib/progress";

export default function Progress() {
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    getProgress().then(setData);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Your Progress</Text>

      {data.length === 0 ? (
        <Text style={styles.text}>No progress yet</Text>
      ) : (
        data.map((item, index) => (
          <Text key={index} style={styles.item}>
            ✔ {item}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 20,
  },
  text: { color: "#9CA3AF" },
  item: {
    color: "#60A5FA",
    marginBottom: 10,
  },
});