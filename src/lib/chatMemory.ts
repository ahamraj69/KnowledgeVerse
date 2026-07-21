import { ChatMessage } from "@/types/chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PERSISTENT_CHAT_KEY = "knowledgeverse_chat_cache";

/**
 * Saves conversational dialog arrays securely onto local flash memory sectors.
 */
export async function saveConversation(messages: ChatMessage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PERSISTENT_CHAT_KEY, JSON.stringify(messages));
  } catch (e) {
    console.log("Local disk sync fallback write fault tracker:", e);
  }
}

/**
 * Hydrates local UI memory records by extracting historical conversations from local storage.
 */
export async function loadConversation(): Promise<ChatMessage[]> {
  try {
    const data = await AsyncStorage.getItem(PERSISTENT_CHAT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("Local disk sync fallback read fault tracker:", e);
    return [];
  }
}

/**
 * Clears the persistent state cache to support manual session flushes.
 */
export async function clearConversation(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PERSISTENT_CHAT_KEY);
  } catch (e) {
    // ✅ FIXED: Switched to standard console logger to clear compilation arguments mismatch
    console.log("Local session flash wipe exception caught:", e);
  }
}
