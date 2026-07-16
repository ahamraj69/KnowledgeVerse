import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Flashcard {
  question: string;
  answer: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  createdAt?: any;
  cards: Flashcard[];
}

/**
 * Saves an AI-generated flashcard set.
 */
export const saveFlashcardSet = async (
  userId: string,
  title: string,
  cards: Flashcard[]
): Promise<void> => {
  await addDoc(
    collection(db, "users", userId, "flashcards"),
    {
      title,
      cards,
      createdAt: serverTimestamp(),
    }
  );
};

/**
 * Retrieves all saved flashcard sets.
 */
export const getFlashcardSets = async (
  userId: string
): Promise<FlashcardSet[]> => {
  const q = query(
    collection(db, "users", userId, "flashcards"),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<FlashcardSet, "id">),
  }));
};