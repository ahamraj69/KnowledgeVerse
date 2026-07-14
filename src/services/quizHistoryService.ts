import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface QuizHistory {
  id?: string;
  userId: string;
  topic: string;
  score: number;
  total: number;
  completedAt?: any;
}

export const saveQuizHistory = async (
  history: QuizHistory
) => {
  await addDoc(collection(db, "quizHistory"), {
    ...history,
    completedAt: serverTimestamp(),
  });
};

export const getQuizHistory = async (
  userId: string
): Promise<QuizHistory[]> => {
  const q = query(
    collection(db, "quizHistory"),
    where("userId", "==", userId),
    orderBy("completedAt", "desc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as QuizHistory),
  }));
};