import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";

/**
 * Save chat message to Firestore (user-specific memory)
 */
export const saveMessage = async (message: string, reply: string) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("User not logged in");
    }

    await addDoc(collection(db, "chats"), {
      userId: user.uid,
      message,
      reply,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.log("Save message error:", error);
  }
};

/**
 * Get chat history for logged-in user
 */
export const getMessages = async () => {
  try {
    const user = auth.currentUser;

    if (!user) return [];

    const q = query(
      collection(db, "chats"),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);

    const messages = snapshot.docs
      .map((doc) => doc.data())
      .filter((msg: any) => msg.userId === user.uid);

    return messages;
  } catch (error) {
    console.log("Get messages error:", error);
    return [];
  }
};