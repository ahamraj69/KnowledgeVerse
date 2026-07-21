import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getCache, setCache } from "./cache";

export interface Question {
  id: string;
  questionText: string;
  question?: string; // ✅ Match front-end key query parameters
  options: string[];
  correctAnswerIndex: number;
  answer?: number; // ✅ Match front-end key query parameters
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  score: number;
  total: number;
}

export const getQuizByLesson = async (lessonId: string): Promise<Quiz | null> => {
  const cacheKey = `quiz_lesson_${lessonId}`;
  const cached = getCache<Quiz>(cacheKey);
  if (cached) return cached;

  const snap = await getDocs(query(collection(db, "quizzes"), where("lessonId", "==", lessonId)));
  if (snap.empty) return null;

  const docItem = snap.docs[0];
  const data = docItem.data();
  
  const rawQuestions = data.questions || [];
  const normalizedQuestions = rawQuestions.map((q: any, idx: number) => ({
    id: q.id || idx.toString(),
    questionText: q.questionText || q.question || "",
    question: q.question || q.questionText || "",
    options: q.options || [],
    correctAnswerIndex: q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : q.answer || 0,
    answer: q.answer !== undefined ? q.answer : q.correctAnswerIndex || 0,
  }));

  const quiz: Quiz = {
    id: docItem.id,
    lessonId: data.lessonId,
    title: data.title || "Lesson Quiz",
    questions: normalizedQuestions
  };

  setCache(cacheKey, quiz);
  return quiz;
};
