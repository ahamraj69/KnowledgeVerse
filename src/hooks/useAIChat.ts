import { buildSystemPrompt, getAIContext } from "@/lib/aiContextService";
import { askAI } from "@/lib/aiService";
import {
    createChat,
    deleteChat,
    getChats,
    getMessages,
    renameChat,
    saveMessage,
} from "@/lib/chatService";
import { auth } from "@/lib/firebase";
import { ChatMessage, ChatSession } from "@/types/chat";
import { useCallback, useEffect, useState } from "react";

export function useAIChat(activeChatId: string | null) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typing, setTyping] = useState(false);

  const userId = auth.currentUser?.uid || "guest_user";

  const refreshSessions = useCallback(async () => {
    try {
      setLoadingSessions(true);
      const data = await getChats(userId);
      setSessions(data);
    } catch (e) {
      console.log("Error syncing session tracks:", e);
    } finally {
      setLoadingSessions(false);
    }
  }, [userId]);

  const syncMessages = useCallback(async (chatId: string) => {
    try {
      setLoadingMessages(true);
      const data = await getMessages(chatId);
      setMessages(data);
    } catch (e) {
      console.log("Error loading message chains:", e);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const handleSendPrompt = useCallback(
    async (chatId: string, promptText: string) => {
      const cleanPrompt = promptText.trim();
      if (!cleanPrompt) return;

      try {
        setTyping(true);
        // 1. Commit and display the user message instantly
        await saveMessage(chatId, "user", cleanPrompt);
        const history = await getMessages(chatId);
        setMessages(history);

        // 2. Automatic Chat Title generation upon initial prompt submission
        const userPrompts = history.filter((m) => m.role === "user");
        if (userPrompts.length === 1) {
          const titleSnippet = cleanPrompt.length > 18 ? cleanPrompt.substring(0, 18) + "..." : cleanPrompt;
          await renameChat(chatId, `📘 ${titleSnippet}`);
          await refreshSessions();
        }

        // 3. Gather rich user learning telemetry frames live from progress collections
        const userContext = await getAIContext(userId);
        const systemPromptHeader = buildSystemPrompt(userContext);

        // 4. Compile conversation history paired with the system prompt context memory block
        const compiledContextPayload = 
          `System Instructions:\n${systemPromptHeader}\n\n` +
          history.map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`).join("\n") + 
          `\nUser: ${cleanPrompt}`;

        // 5. Package backend context payload block matching Step 5 specification
        const backendContextPayload = {
          progress: userContext.progress ?? 0,
          completedLessons: userContext.completedLessons ?? [],
          recentCourses: userContext.recentCourses ?? []
        };

        const modelReply = await askAI(compiledContextPayload, backendContextPayload);
        await saveMessage(chatId, "assistant", modelReply);
        await syncMessages(chatId);
      } catch (err) {
        console.log("AI prompt execution failure:", err);
      } finally {
        setTyping(false);
      }
    },
    [userId, refreshSessions, syncMessages]
  );

  const handleInitNewSession = useCallback(async (): Promise<string> => {
    const id = await createChat(userId);
    await refreshSessions();
    return id;
  }, [userId, refreshSessions]);

  const handleRemoveSession = useCallback(
    async (chatId: string) => {
      await deleteChat(chatId);
      await refreshSessions();
      setMessages([]);
    },
    [refreshSessions]
  );

  useEffect(() => {
    refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    if (activeChatId) {
      syncMessages(activeChatId);
    } else {
      setMessages([]);
    }
  }, [activeChatId, syncMessages]);

  return {
    sessions,
    messages,
    loadingSessions,
    loadingMessages,
    typing,
    sendPrompt: handleSendPrompt,
    startNewChat: handleInitNewSession,
    deleteSession: handleRemoveSession,
    refreshSessions,
  };
}
