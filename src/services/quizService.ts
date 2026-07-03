export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number; // index of correct option
}

export interface Quiz {
  lessonId: string;
  questions: Question[];
}

/**
 * 🎯 Mock Quiz Data (replace later with Firestore)
 */
const quizDatabase: Record<string, Quiz> = {
  lesson1: {
    lessonId: "lesson1",
    questions: [
      {
        id: "q1",
        question: "What is React Native?",
        options: [
          "A database",
          "A mobile framework",
          "A backend language",
          "A design tool",
        ],
        answer: 1,
      },
      {
        id: "q2",
        question: "Which language is used?",
        options: [
          "Python",
          "Java",
          "JavaScript",
          "C++",
        ],
        answer: 2,
      },
    ],
  },

  lesson2: {
    lessonId: "lesson2",
    questions: [
      {
        id: "q1",
        question: "What is Expo?",
        options: [
          "Android OS",
          "React Native toolchain",
          "Database",
          "IDE",
        ],
        answer: 1,
      },
    ],
  },
};

/**
 * 📥 Get quiz by lessonId
 */
export const getQuizByLesson = async (
  lessonId: string
): Promise<Quiz | null> => {
  return quizDatabase[lessonId] || null;
};

/**
 * 📊 Calculate score
 */
export const calculateScore = (
  questions: Question[],
  answers: number[]
): number => {
  let score = 0;

  questions.forEach((q, index) => {
    if (answers[index] === q.answer) {
      score++;
    }
  });

  return score;
};