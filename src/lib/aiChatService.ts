import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    updateDoc,
    where
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface AIChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface AIMessage {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export async function createChat(initialTitle: string = "New Chat"): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const chatRef = collection(db, "aiChats");
  const docRef = await addDoc(chatRef, {
    userId: user.uid,
    title: initialTitle,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  return docRef.id;
}

export async function getChats(): Promise<AIChatSession[]> {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "aiChats"),
    where("userId", "==", user.uid),
    orderBy("updatedAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as AIChatSession));
}

export async function getMessages(chatId: string): Promise<AIMessage[]> {
  const q = query(
    collection(db, "aiMessages"),
    where("chatId", "==", chatId),
    orderBy("createdAt", "asc")
  );

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as AIMessage));
}

export async function sendMessage(chatId: string, role: "user" | "assistant", content: string): Promise<void> {
  await addDoc(collection(db, "aiMessages"), {
    chatId,
    role,
    content,
    createdAt: Date.now()
  });

  const chatDocRef = doc(db, "aiChats", chatId);
  await updateDoc(chatDocRef, {
    updatedAt: Date.now()
  });
}

export async function deleteChat(chatId: string): Promise<void> {
  await deleteDoc(doc(db, "aiChats", chatId));
  
  // Clean up detached messages inside sub-collections asynchronously
  const q = query(collection(db, "aiMessages"), where("chatId", "==", chatId));
  const snap = await getDocs(q);
  const deletePromises = snap.docs.map(d => deleteDoc(doc(db, "aiMessages", d.id)));
  await Promise.all(deletePromises);
}

export async function renameChat(chatId: string, newTitle: string): Promise<void> {
  const chatDocRef = doc(db, "aiChats", chatId);
  await updateDoc(chatDocRef, {
    title: newTitle
  });
}
