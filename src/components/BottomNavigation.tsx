import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const Item = ({
    icon,
    label,
    route,
  }: {
    icon: string;
    label: string;
    route: string;
  }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(route as any)}
    >
      <Text
        style={[
          styles.icon,
          pathname === route && styles.active,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.label,
          pathname === route && styles.active,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Item icon="🏠" label="Home" route="/feed" />

      <Item icon="📚" label="Explore" route="/explore" />

      <Item icon="🤖" label="AI" route="/ai" />

      <Item icon="📈" label="Progress" route="/progress" />

      <Item icon="👤" label="Profile" route="/profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    backgroundColor: "#111827",

    paddingVertical: 14,

    borderTopWidth: 1,

    borderTopColor: "#1F2937",
  },

  item: {
    alignItems: "center",
  },

  icon: {
    fontSize: 24,

    color: "#9CA3AF",
  },

  label: {
    marginTop: 5,

    color: "#9CA3AF",

    fontSize: 12,
  },

  active: {
    color: "#38BDF8",
    fontWeight: "bold",
  },
});