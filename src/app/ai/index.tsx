import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";

import { useAuth } from "../../context/AuthContext";

import {
  AISuggestion,
  getAISuggestions,
} from "../../services/aiSuggestionService";

import SuggestionCard from "../../components/SuggestionCard";
import LearningPath from "../../components/LearningPath";

export default function AIScreen() {
  const { user } = useAuth();

  const [suggestions, setSuggestions] = useState<
    AISuggestion[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    loadAI();
  }, [user]);

  const loadAI = async () => {
    try {
      setLoading(true);

      const data = await getAISuggestions(
        user!.uid
      );

      setSuggestions(data);
    } catch (e) {
      console.log(e);

      Alert.alert(
        "Error",
        "Failed to load AI suggestions"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#A855F7" />

        <Text
          style={{
            color: "white",
            marginTop: 10,
          }}
        >
          Loading AI Suggestions...
        </Text>
      </View>
    );
  }

  if (!suggestions.length) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B1220",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 50 }}>🧠</Text>

        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          You're doing great!
        </Text>

        <Text
          style={{
            color: "#9CA3AF",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          No recommendations needed right now
        </Text>
      </View>
    );
  }
  return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: "#0B1220",
    }}
    contentContainerStyle={{
      padding: 20,
      paddingBottom: 40,
    }}
  >
    {/* Header */}
    <Text
      style={{
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
      }}
    >
      🧠 AI Learning Assistant
    </Text>

    {/* AI Learning Path */}
    <LearningPath suggestions={suggestions} />

    {/* Divider */}
    <View
      style={{
        height: 1,
        backgroundColor: "#1F2937",
        marginVertical: 15,
      }}
    />

    {/* Suggestions Section */}
    <Text
      style={{
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
      }}
    >
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