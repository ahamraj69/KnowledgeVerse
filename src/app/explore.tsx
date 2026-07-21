import { Theme } from "@/theme/theme";
import { router } from "expo-router";
import { useCallback } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CategoryItem {
  id: string;
  title: string;
  icon: string;
  color: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: "ai", title: "Artificial Intelligence", icon: "🧠", color: "#6366F1" },
  { id: "mobile", title: "Mobile Engineering", icon: "📱", color: "#3B82F6" },
  { id: "cloud", title: "Cloud Architectures", icon: "☁️", color: "#14B8A6" },
  { id: "cyber", title: "Cyber Security Systems", icon: "🔒", color: "#EF4444" },
];

export default function ExploreScreen() {
  const handleSelectCategory = useCallback((id: string) => {
    router.push({ pathname: "/courses", params: { category: id } } as any);
  }, []);

  const renderCategory = useCallback(({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: item.color }]}
      onPress={() => handleSelectCategory(item.id)}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </TouchableOpacity>
  ), [handleSelectCategory]);

  return (
    <View style={Theme.screen}>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[Theme.text, styles.title]}>🧭 Explore Knowledge</Text>
            <Text style={[Theme.muted, styles.subtitle]}>
              Discover specialized technical curriculum tracks designed for India's tech ecosystem.
            </Text>
          </View>
        }
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "bold" },
  subtitle: { fontSize: 14, marginTop: 4, lineHeight: 22 },
  card: {
    backgroundColor: "#111827",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderLeftWidth: 5,
  },
  icon: { fontSize: 24, marginRight: 16 },
  cardTitle: { color: "white", fontSize: 16, fontWeight: "600" },
});
