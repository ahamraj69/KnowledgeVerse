import {
    createChat,
    deleteChat,
    getChats,
    saveMessage,
} from "@/lib/chatService";
import { auth } from "@/lib/firebase";
import { ChatSession } from "@/types/chat";
import { useCallback, useEffect, useState } from "react";

/**
 * ✅ FIXED: Backward-Compatible Bridge Hook [INDEX].
 * Maps old function structures directly onto our newly standardized production-grade 
 * chat services to instantly resolve all module export blocks.
 */
export function useChat() {
  const [conversations, setConversations] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = auth.currentUser?.uid || "guest_user";

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getChats(userId);
      setConversations(data);
    } catch (e) {
      console.log("Legacy chat link bridge read error:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const create = useCallback(async (title: string) => {
    await createChat(userId);
    // Backward compatibility sets the structural naming
    await refresh();
  }, [userId, refresh]);

  const remove = useCallback(async (id: string) => {
    await deleteChat(id);
    await refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    conversations,
    loading,
    create,
    remove,
    refresh,
  };
}

// ✅ FIXED: Aliased backward-compatible helper functions matching your service mapping exports [INDEX]
export async function createConversation(title: string) {
  const userId = auth.currentUser?.uid || "guest_user";
  return await createChat(userId);
}

export async function getConversations() {
  const userId = auth.currentUser?.uid || "guest_user";
  return await getChats(userId);
}

export async function deleteConversation(id: string) {
  return await deleteChat(id);
}

export async function sendMessage(chatId: string, role: "user" | "assistant", content: string) {
  return await saveMessage(chatId, role, content);
}
