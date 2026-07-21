import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ✅ FIXED: Imported saveMessage straight out of centralized src/lib/chatService layer
import { saveMessage } from "@/lib/chatService";
import { Theme } from "@/theme/theme";
import { ChatMessage } from "@/types/chat";
import MessageBubble from "../ai/MessageBubble";
import TypingIndicator from "../ai/TypingIndicator";

export default function VoiceAIScreen() {
  const router = useRouter();
  const voiceSessionId = "global_voice_ai_session_node";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const toggleVoiceCapture = useCallback(async () => {
    if (listening) {
      setListening(false);
      setTyping(true);
      
      const simulatedTranscript = "Explain Newton's First Law using clear visual examples.";
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        chatId: voiceSessionId,
        role: "user",
        type: "voice",
        content: simulatedTranscript,
        createdAt: Date.now()
      };

      setMessages(prev => [...prev, userMessage]);

      try {
        // ✅ FIXED: Utilizing clean production-grade saveMessage method here
        await saveMessage(voiceSessionId, "user", simulatedTranscript);
        
        const aiMessage: ChatMessage = {
          id: `ai_${Date.now()}`,
          chatId: voiceSessionId,
          role: "assistant",
          type: "text",
          content: "Newton's First Law states that an object stays at rest unless a force acts on it. Think of a football resting on the grass—it won't move until you kick it!",
          createdAt: Date.now()
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (err) {
        Alert.alert("Network Failure", "Could not process vocal streams matrix execution loops.");
      } finally {
        setTyping(false);
      }
    } else {
      setListening(true);
    }
  }, [listening]);

  return (
    <KeyboardAvoidingView style={[Theme.screen, styles.viewportWrapper]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>◀ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>🎤 Vocal AI Companion</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listScrollContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <MessageBubble message={item.content} user={item.role === "user"} />
        )}
        ListFooterComponent={typing ? <TypingIndicator /> : null}
        ListEmptyComponent={
          <View style={styles.emptyCenterContainer}>
            <Text style={styles.emptyGraphicIcon}>🎤</Text>
            <Text style={styles.emptyTitleText}>Hands-Free Study Space</Text>
            <Text style={styles.emptyMutedBodyText}>Tap the microphone overlay block below and speak your query to get instant synthesized voice guidance feedback.</Text>
          </View>
        }
      />

      <View style={styles.footerActionRow}>
        <TouchableOpacity 
          style={[styles.micBtn, listening && styles.activeMicBtn]} 
          onPress={toggleVoiceCapture}
          activeOpacity={0.85}
        >
          <Text style={styles.micEmoji}>{listening ? "⏹️" : "🎙️"}</Text>
        </TouchableOpacity>
        <Text style={styles.statusLabel}>
          {listening ? "LISTENING TO VOICE..." : "TAP MIC TO SPEAK"}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220" },
  headerBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, backgroundColor: "#111827", borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  backBtn: { marginRight: 14, backgroundColor: "rgba(255,255,255,0.05)", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  backBtnText: { color: "#38BDF8", fontSize: 14, fontWeight: "600" },
  headerTitleText: { color: "white", fontSize: 18, fontWeight: "bold" },
  listScrollContent: { padding: 16, paddingBottom: 24 },
  emptyCenterContainer: { padding: 32, alignItems: "center", marginTop: 60 },
  emptyGraphicIcon: { fontSize: 44, marginBottom: 12 },
  emptyTitleText: { color: "white", fontSize: 16, fontWeight: "bold" },
  emptyMutedBodyText: { color: "#6B7280", fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 18 },
  footerActionRow: { padding: 24, backgroundColor: "#0F172A", alignItems: "center", borderTopWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  micBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center", elevation: 6, shadowColor: "#2563EB", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  activeMicBtn: { backgroundColor: "#EF4444", shadowColor: "#EF4444" },
  micEmoji: { fontSize: 28, color: "white" },
  statusLabel: { color: "#9CA3AF", fontSize: 12, fontWeight: "700", marginTop: 12, letterSpacing: 0.5 }
});
