import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AppTabsProps {
  activeTab: string;
  tabs: { id: string; label: string }[];
  onChange: (id: string) => void;
}

export default function AppTabs({ activeTab, tabs, onChange }: AppTabsProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onChange(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#111827",
    borderRadius: 10,
    padding: 4,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8 },
  activeTab: { backgroundColor: "#2563EB" },
  tabText: { color: "#9CA3AF", fontSize: 14, fontWeight: "600" },
  activeTabText: { color: "white" },
});
