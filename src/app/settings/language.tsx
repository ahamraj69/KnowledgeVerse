import { useSettings } from "@/hooks/useSettings";
import { Theme } from "@/theme/theme";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const languagesList = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Chinese"];

export default function LanguageSelectorScreen() {
  const router = useRouter();
  const { settings, save } = useSettings();

  const handleSelectLanguage = useCallback(async (lang: string) => {
    await save({ language: lang });
    Alert.alert("Locale Modified", `Application localized framework switched over to ${lang}.`);
    router.back();
  }, [save, router]);

  return (
    <View style={[Theme.screen, styles.container]}>
      <Text style={styles.title}>Select App Language</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {languagesList.map((lang) => {
          const isSelected = settings?.language === lang;
          return (
            <TouchableOpacity key={lang} style={[styles.row, isSelected && styles.activeRow]} onPress={() => handleSelectLanguage(lang)} activeOpacity={0.7}>
              <Text style={[styles.text, isSelected && styles.activeText]}>{lang}</Text>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", padding: 24 },
  title: { color: "white", fontSize: 22, fontWeight: "bold", marginBottom: 20, marginTop: 10 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, backgroundColor: "#111827", borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  activeRow: { backgroundColor: "rgba(37,99,235,0.12)", borderColor: "#2563EB" },
  text: { color: "#9CA3AF", fontSize: 16, fontWeight: "500" },
  activeText: { color: "white", fontWeight: "bold" },
  checkmark: { color: "#38BDF8", fontSize: 16, fontWeight: "bold" }
});
