import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon: string;
  title: string;
  subtitle: string;
};

export default function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    marginTop: 40,
  },
  icon: {
    fontSize: 55,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
  },
});
