import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useNetwork } from "@/context/NetworkContext";
import { Theme } from "@/theme/theme";

interface Flashcard {
  question: string;
  answer: string;
}

export default function FlashcardsScreen() {
  const { isConnected } = useNetwork();
  const [topic, setTopic] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const generateFlashcards = useCallback(async () => {
    const cleanTopic = topic.trim();
    if (!cleanTopic) {
      Alert.alert("Topic Required", "Please enter a topic text descriptor.");
      return;
    }

    if (!isConnected) {
      Alert.alert("Offline", "Please connect to the internet to use AI generation tools.");
      return;
    }

    try {
      setLoading(true);
      setCards([]);
      setFlippedCards({});

      const response = await fetch("http://localhost:5000/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: cleanTopic }),
      });

      const data = await response.json();

      // ✅ Step 2 FIXED: Gracefully reports empty results with descriptive warning popups
      if (data.cards?.length) {
        setCards(data.cards);
      } else {
        Alert.alert(
          "No Flashcards",
          "The AI couldn't generate flashcards for this topic."
        );
      }
    } catch (e) {
      Alert.alert("Error", "Unable to communicate with the flashcards service node.");
    } finally {
      setLoading(false);
    }
  }, [topic, isConnected]);

  const toggleFlipCard = useCallback((index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const renderCardItem = useCallback(({ item, index }: { item: Flashcard; index: number }) => {
    const isFlipped = !!flippedCards[index];

    return (
      <TouchableOpacity
        style={[styles.flashCard, isFlipped && styles.flashCardFlipped]}
        onPress={() => toggleFlipCard(index)}
        activeOpacity={0.9}
      >
        <Text style={styles.cardSideLabel}>
          {isFlipped ? "💡 ANSWER" : "❓ QUESTION"}
        </Text>
        <Text style={styles.cardContentText}>
          {isFlipped ? item.answer : item.question}
        </Text>
      </TouchableOpacity>
    );
  }, [flippedCards, toggleFlipCard]);

  return (
    <View style={Theme.screen}>
      <FlatList
        data={cards}
        keyExtractor={(_, index) => `card-${index}`}
        renderItem={renderCardItem}
        removeClippedSubviews={true}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.mainTitle}>🎴 AI Flashcards</Text>
            <Text style={[Theme.muted, styles.subtitle]}>
              Instantly create dynamic study memory arrays about any concept.
            </Text>

            <TextInput
              placeholder="e.g. Docker Containerization & Microservices"
              placeholderTextColor="#9CA3AF"
              value={topic}
              onChangeText={setTopic}
              editable={!loading}
              style={styles.input}
            />

            <TouchableOpacity
              style={[styles.generateBtn, { opacity: loading ? 0.6 : 1 }]}
              onPress={generateFlashcards}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnText}>Build Flashcard Deck</Text>
              )}
            </TouchableOpacity>
          </View>
        }
        // ✅ Step 3 FIXED: Inlined customized text placeholders for empty list sets
        ListEmptyComponent={
          !loading ? (
            <Text
              style={{
                color: "#9CA3AF",
                textAlign: "center",
                marginTop: 40,
                fontSize: 15,
                fontWeight: "500"
              }}
            >
              No flashcards generated yet.
            </Text>
          ) : null
        }
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  headerBlock: { marginBottom: 10 },
  mainTitle: { color: "white", fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 24, lineHeight: 22 },
  input: { backgroundColor: "#111827", color: "white", padding: 16, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", fontSize: 16, marginBottom: 16 },
  generateBtn: { backgroundColor: "#6366F1", padding: 16, borderRadius: 12, alignItems: "center", minHeight: 54, justifyContent: "center" },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
  flashCard: { backgroundColor: "#111827", padding: 20, minHeight: 160, borderRadius: 16, marginTop: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)", justifyContent: "center", borderLeftWidth: 4, borderLeftColor: "#6366F1" },
  flashCardFlipped: { borderLeftColor: "#10B981", backgroundColor: "#121F24" },
  cardSideLabel: { color: "#9CA3AF", fontSize: 11, fontWeight: "700", position: "absolute", top: 14, left: 20, letterSpacing: 1 },
  cardContentText: { color: "white", fontSize: 16, fontWeight: "600", lineHeight: 24, textAlign: "center", marginTop: 10 }
});
