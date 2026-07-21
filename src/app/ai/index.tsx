import ChatHistoryCard from "@/components/ChatHistoryCard";
import QuizCard from "@/components/QuizCard";
import RevisionCard from "@/components/RevisionCard";
import { useAIChat } from "@/hooks/useAIChat";
import { useProgress } from "@/hooks/useProgress";
import { generateQuiz, QuizPayload } from "@/lib/quizAIService";
import { generateRevision, RevisionSummary } from "@/lib/revisionService";
import { speak } from "@/lib/voiceService";
import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function AICompanionScreen() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  
  const { sessions, messages, loadingSessions, loadingMessages, typing, sendPrompt, startNewChat, deleteSession } = useAIChat(selectedChatId);
  const { progress } = useProgress();
  const chatFlatListRef = useRef<FlatList>(null);
  
  const [activeVoice, setActiveVoice] = useState(false);
  const [quizData, setQuizData] = useState<QuizPayload | null>(null);
  const [revData, setRevData] = useState<RevisionSummary | null>(null);

  const handleLaunchSession = useCallback(async () => {
    const id = await startNewChat();
    if (id) setSelectedChatId(id);
  }, [startNewChat]);

  // ✅ Processes custom analytical tutoring triggers directly from input text queries
  const handleSendPrompt = useCallback(async () => {
    const textToSubmit = inputMessage.trim();
    if (!textToSubmit) return;

    let targetChatId = selectedChatId;
    if (!targetChatId) {
      targetChatId = await startNewChat();
      if (!targetChatId) return;
      setSelectedChatId(targetChatId);
    }

    const lowerQuery = textToSubmit.toLowerCase();
    
    // ✅ Module 1 Trigger Intersection Hook
    if (lowerQuery.includes("quiz") || lowerQuery.includes("test")) {
      const generatedAssessment = await generateQuiz("Class 8 General Science", "Medium");
      setQuizData(generatedAssessment);
      setRevData(null);
    } 
    // ✅ Module 2 Trigger Intersection Hook
    else if (lowerQuery.includes("revise") || lowerQuery.includes("summary")) {
      const summaryNotes = await generateRevision("Plant Photosynthesis Cycles");
      setRevData(summaryNotes);
      setQuizData(null);
    } else {
      setQuizData(null);
      setRevData(null);
    }

    setInputMessage("");
    await sendPrompt(targetChatId, textToSubmit);
  }, [inputMessage, selectedChatId, startNewChat, sendPrompt]);

  const toggleVoiceMode = useCallback(() => {
    setActiveVoice(prev => {
      const targetState = !prev;
      if (targetState) speak("Personal Learning Assistant vocal feedback module engaged.");
      return targetState;
    });
  }, []);

  const triggerAttachmentAlert = useCallback((type: string) => {
    Alert.alert("Attachment Engaged", `Initializing hardware interface to parse incoming ${type} context logs.`);
  }, []);

  const handleDeleteSession = useCallback((id: string) => {
    Alert.alert("Delete Conversation", "Permanently erase this chat session framework?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
          deleteSession(id);
          if (selectedChatId === id) setSelectedChatId(null);
        }}
    ]);
  }, [selectedChatId, deleteSession]);

  const currentActiveChatTitle = useMemo(() => {
    const matched = sessions.find(s => s.id === selectedChatId);
    return matched ? matched.title : "Select or Start a Chat Node";
  }, [sessions, selectedChatId]);

  return (
    <KeyboardAvoidingView style={styles.viewportWrapper} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Sidebar Panel Drawer */}
      <View style={styles.sidebarPanel}>
        <Text style={styles.sidebarHeaderLabel}>📜 History</Text>
        <TouchableOpacity style={styles.newChatBtn} onPress={handleLaunchSession} activeOpacity={0.8}>
          <Text style={styles.newChatBtnText}>+ New Chat</Text>
        </TouchableOpacity>
        {loadingSessions ? (
          <ActivityIndicator color="#38BDF8" style={styles.marginSpacer} />
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ChatHistoryCard
                session={item as any}
                active={selectedChatId === item.id}
                onSelect={() => setSelectedChatId(item.id)}
                onDelete={() => handleDeleteSession(item.id)}
              />
            )}
          />
        )}
      </View>

      {/* Main Chat Display Window */}
      <View style={styles.mainChatWindow}>
        <View style={styles.chatStatusBarHeader}>
          <Text style={styles.activeChatTitleText} numberOfLines={1}>{currentActiveChatTitle}</Text>
          {progress && (
            <Text style={styles.adaptiveDiffBadge}>🔥 STREAK: {progress.streak} DAYS • ADAPTIVE MODE ACTIVE</Text>
          )}
        </View>

        {loadingMessages ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator color="#2563EB" size="large" />
          </View>
        ) : (
          <FlatList
            ref={chatFlatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageScrollPadding}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => chatFlatListRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item }) => (
              <MessageBubble message={item.content} user={item.role === "user"} />
            )}
            ListHeaderComponent={
              <>
                {quizData && <QuizCard quiz={quizData} onStart={() => Alert.alert("Assessment Launched", "Beginning full adaptive study quiz context.")} />}
                {revData && <RevisionCard summary={revData} />}
              </>
            }
            ListFooterComponent={typing ? <TypingIndicator /> : null}
            ListEmptyComponent={
              <View style={styles.emptyDialogueStateCenter}>
                <Text style={styles.emptyGraphic}>🎓</Text>
                <Text style={styles.emptyTitleText}>KnowledgeVerse Learning Coach</Text>
                <Text style={styles.emptyMutedBodyText}>Type 'Quiz' or 'Revise' above to unlock advanced educational workflows dynamically.</Text>
              </View>
            }
          />
        )}

        {/* Input Access Action Toolbar Container */}
        <View style={styles.toolbarContainerRow}>
          <TouchableOpacity onPress={toggleVoiceMode} style={[styles.toolbarButton, activeVoice && styles.activeVoiceBtn]}>
            <Text style={styles.toolbarEmoji}>🎤</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => triggerAttachmentAlert("Camera")} style={styles.toolbarButton}>
            <Text style={styles.toolbarEmoji}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => triggerAttachmentAlert("PDF Document")} style={styles.toolbarButton}>
            <Text style={styles.toolbarEmoji}>📄</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => triggerAttachmentAlert("System File Asset")} style={styles.toolbarButton}>
            <Text style={styles.toolbarEmoji}>➕</Text>
          </TouchableOpacity>
          
          <View style={styles.inputFlexFieldWrapper}>
            <ChatInput value={inputMessage} onChange={setInputMessage} onSend={handleSendPrompt} editable={!typing} />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  viewportWrapper: { flex: 1, backgroundColor: "#0B1220", flexDirection: "row" },
  sidebarPanel: { width: "30%", backgroundColor: "#0F172A", paddingHorizontal: 8, paddingTop: 20, borderRightWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  sidebarHeaderLabel: { color: "#9CA3AF", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, paddingLeft: 4, marginBottom: 8 },
  newChatBtn: { backgroundColor: "#2563EB", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  newChatBtnText: { color: "white", fontSize: 13, fontWeight: "bold" },
  marginSpacer: { marginTop: 20 },
  mainChatWindow: { flex: 1, backgroundColor: "#0B1220" },
  chatStatusBarHeader: { padding: 14, backgroundColor: "#111827", borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.04)" },
  activeChatTitleText: { color: "white", fontSize: 16, fontWeight: "bold" },
  adaptiveDiffBadge: { color: "#10B981", fontSize: 10, fontWeight: "700", marginTop: 4, letterSpacing: 0.5 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  messageScrollPadding: { padding: 16, paddingBottom: 24 },
  emptyDialogueStateCenter: { padding: 32, alignItems: "center", marginTop: 40 },
  emptyGraphic: { fontSize: 44, marginBottom: 12 },
  emptyTitleText: { color: "white", fontSize: 16, fontWeight: "bold" },
  emptyMutedBodyText: { color: "#6B7280", fontSize: 13, textAlign: "center", marginTop: 6, lineHeight: 18 },
  toolbarContainerRow: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#0F172A", alignItems: "center", gap: 8, borderTopWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
toolbarButton: { width: 42, height: 42, borderRadius: 10, backgroundColor: "#111827", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
activeVoiceBtn: { backgroundColor: "rgba(56,189,248,0.15)", borderColor: "#38BDF8" },
toolbarEmoji: { fontSize: 18 },
inputFlexFieldWrapper: { flex: 1 }
});
