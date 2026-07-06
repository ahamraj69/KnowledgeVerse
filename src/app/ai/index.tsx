import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";

import {
  AISuggestion,
  getAISuggestions,
} from "../../services/aiSuggestionService";

import LearningPath from "../../components/LearningPath";
import SuggestionCard from "../../components/SuggestionCard";

export default function AIScreen() {
  const { user } = useAuth();

  const [suggestions, setSuggestions] = useState<
    AISuggestion[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ FIX: Swapped out primitive reference listener with granular dependency guard tracking rules
    if (!user?.uid) return;

    loadSuggestions();
  }, [user?.uid]);

  // ✅ STEP 1 FIX: Added structured protection layer filtering execution threads (Removes TS18047)
  const loadSuggestions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const data = await getAISuggestions(user.uid);

      setSuggestions(data);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "Failed to load AI suggestions."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#A855F7"
        />

        <Text style={styles.loading}>
          Loading AI Suggestions...
        </Text>
      </View>
    );
  }

  if (suggestions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emoji}>🧠</Text>

        <Text style={styles.emptyTitle}>
          You're doing great!
        </Text>

        <Text style={styles.emptySubtitle}>
          No AI recommendations available right now.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        🧠 AI Learning Assistant
      </Text>

      <LearningPath
        suggestions={suggestions}
      />

      <View style={styles.divider} />

      <Text style={styles.section}>
        📌 Recommendations
      </Text>

      {suggestions.map((item, index) => (
        <SuggestionCard
          key={index}
          suggestion={item}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loading: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
  },

  emoji: {
    fontSize: 60,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 12,
  },

  emptySubtitle: {
    color: "#9CA3AF",
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#1F2937",
    marginVertical: 20,
  },

  section: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
});
