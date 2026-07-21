import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

// ✅ FIXED: Imported saveMessage matching our unified src/lib/chatService layout
import { saveMessage } from "@/lib/chatService";
import { Theme } from "@/theme/theme";
import { ChatMessage } from "@/types/chat";
import ChatInput from "../ai/ChatInput";
import MessageBubble from "../ai/MessageBubble";
import TypingIndicator from "../ai/TypingIndicator";

export default function AIAssignmentScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const assignmentId = typeof params.id === "string" ? params.id : "default_assignment_node";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = useCallback(async () => {
    const cleanText = message.trim();
    if (!cleanText) return;

    setMessage("");
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      chatId: assignmentId,
      role: "user",
      type: "text",
      content: cleanText,
      createdAt: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    
    try {
      setTyping(true);
      // ✅ FIXED: Using standardized saveMessage method
      await saveMessage(assignmentId, "user", cleanText);
      setTyping(false);

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        chatId: assignmentId,
        role: "assistant",
        type: "text",
        content: `Assignment submission processed for node index: ${assignmentId}. Reviewing evaluations shortly.`,
        createdAt: Date.now()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setTyping(false);
      Alert.alert("Network Failure", "Could not submit evaluation data context loops.");
    }
  }, [message, assignmentId]);

  return (
    <KeyboardAvoidingView 
      style={[Theme.screen, styles.viewportWrapper]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>◀ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>📝 AI Assignment Panel</Text>
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
            <Text style={styles.emptyGraphicIcon}>📖</Text>
            <Text style={styles.emptyTitleText}>Interactive Task Evaluator</Text>
            <Text style={styles.emptyMutedBodyText}>Input prompt metrics or confirm specialized answers here to calculate grade profiles.</Text>
          </View>
        }
      />

      <ChatInput value={message} onChange={setMessage} onSend={handleSend} editable={!typing} />
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
  emptyMutedBodyText: { color: "#6B7280", fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 18 }
});
