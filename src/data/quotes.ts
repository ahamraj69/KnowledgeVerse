export interface LearningQuote {
  id: string;
  quote: string;
  author: string;
}

export const learningQuotes: LearningQuote[] = [
  { id: "q_01", quote: "The beautiful thing about learning is nobody can take it away from you.", author: "B.B. King" },
  { id: "q_02", quote: "Success is the sum of small efforts repeated daily.", author: "Robert Collier" },
  { id: "q_03", quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { id: "q_04", quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" }
];
