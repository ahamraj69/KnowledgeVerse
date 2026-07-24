import { getOverview } from "./analyticsService";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Collections } from "./firebaseCollections";

// ✅ FIXED: Expanded contract structure to declare title, reason, and priority fields required by UI view elements
export interface AISuggestionPayload {
  id: string;
  userId: string;
  suggestionText: string;
  suggestedSubject: string;
  createdAt: number;
  
  // Backward-compatible properties used by local UI component layouts
  title?: string;
  reason?: string;
  priority?: "high" | "medium" | "low";
}

// Export the type alias safely
export type AISuggestion = AISuggestionPayload;

/**
 * Dynamically compiles personalized learning path tips using live analytics overview telemetry indexes.
 */
export async function generatePersonalizedAISuggestions(userId: string): Promise<string> {
  try {
    const stats = await getOverview();
    let recommendation = "Keep exploring courses! Consistent daily practice hardens long-term memory traces.";
    
    if (stats.quizAttempts > 0 && stats.lessonsCompleted > 0) {
      recommendation = "Great job finishing active lessons! Focus on challenging topics via the practice Quiz mode to stabilize your average tracking metrics.";
    } else if (stats.aiChats > 5) {
      recommendation = "You are interacting frequently with your AI Tutor. Try capturing summary notes within your flashcard workspace to prepare for upcoming mock assessments.";
    }

    const suggestionId = `${userId}_suggestion_node`;
    await setDoc(doc(db, Collections.NOTIFICATIONS, suggestionId), {
      userId,
      title: "🤖 Personalized AI Study Tip",
      message: recommendation,
      createdAt: Date.now()
    }, { merge: true });

    return recommendation;
  } catch (e) {
    console.log("Error compiling cognitive learning tracking recommendation models: ", e);
    return "Continue parsing syllabus timelines matching your goals workspace profile.";
  }
}
