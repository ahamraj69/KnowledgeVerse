import { ChatMessage } from "@/types/chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PERSISTENT_FAVORITES_KEY = "favorite_chats_manifest";

/**
 * Pulls all bookmarked conversation responses from storage [INDEX].
 */
export async function loadFavorites(): Promise<ChatMessage[]> {
  try {
    const data = await AsyncStorage.getItem(PERSISTENT_FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.log("Favorites storage lookup tracking exception:", e);
    return [];
  }
}

/**
 * Appends a specific text response item into the user's bookmark list [INDEX].
 */
export async function saveFavorite(message: ChatMessage): Promise<void> {
  try {
    const currentFavorites = await loadFavorites();
    
    // Prevent duplicate entries from populating the collection array matrix
    if (currentFavorites.some(fav => docRefMatches(fav.id, message.id))) return;

    currentFavorites.push(message);
    await AsyncStorage.setItem(PERSISTENT_FAVORITES_KEY, JSON.stringify(currentFavorites));
  } catch (e) {
    console.log("Favorites storage commit tracking exception:", e);
  }
}

function docRefMatches(aId: string, bId: string): boolean {
  return aId === bId;
}
