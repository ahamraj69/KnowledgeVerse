import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";
import { Collections } from "./firebaseCollections";
import { ChatMessage, ChatSession } from "@/types/chat";

/**
 * ✅ Step 4: Commits a fresh conversation session document to Firestore [INDEX].
 */
export async function createChat(userId: string): Promise<string> {
  const ref = await addDoc(collection(db, Collections.AI_CHATS), {
    userId,
    title: "New Chat",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return ref.id;
}

/**
 * ✅ Step 5: Pulls chronological chat sessions assigned to a target user [INDEX].
 */
export async function getChats(userId: string): Promise<ChatSession[]> {
  const q = query(
    collection(db, Collections.AI_CHATS),
    where("userId", "==", userId),
    orderBy("updatedAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ChatSession, "id">),
  }));
}

/**
 * ✅ Step 6: Dispatches prompt matrices cleanly down to message sub-collections [INDEX].
 */
export async function saveMessage(
  chatId: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  await addDoc(collection(db, Collections.AI_MESSAGES), {
    chatId,
    role,
    content,
    createdAt: Date.now(),
  });

  // Automatically update the parent session's last active timestamp index
  await updateDoc(doc(db, Collections.AI_CHATS, chatId), {
    updatedAt: Date.now(),
  });
}

/**
 * Extracts a thread's message timeline securely in chronological order [INDEX].
 */
export async function getMessages(chatId: string): Promise<ChatMessage[]> {
  const q = query(
    collection(db, Collections.AI_MESSAGES),
    where("chatId", "==", chatId),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<ChatMessage, "id">),
  }));
}

/**
 * Modifies the title attribute on an existing conversation session node [INDEX].
 */
export async function renameChat(chatId: string, title: string): Promise<void> {
  await updateDoc(doc(db, Collections.AI_CHATS, chatId), { title });
}

/**
 * Tears down a conversation session and erases its attached messages from cloud storage [INDEX].
 */
export async function deleteChat(chatId: string): Promise<void> {
  await deleteDoc(doc(db, Collections.AI_CHATS, chatId));

  const q = query(collection(db, Collections.AI_MESSAGES), where("chatId", "==", chatId));
  const snapshot = await getDocs(q);
  const deleteBatch = snapshot.docs.map((d) => deleteDoc(doc(db, Collections.AI_MESSAGES, d.id)));
  await Promise.all(deleteBatch);
}
