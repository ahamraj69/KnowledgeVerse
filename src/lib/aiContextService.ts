import { getChats } from "@/lib/chatService";
import { getUserProgress } from "@/lib/progressService";
import { AIContext } from "@/types/aiContext";

/**
 * ✅ Step 3 FIXED: Aggregates performance snapshots across multi-service domains [INDEX].
 */
export async function getAIContext(userId: string): Promise<AIContext> {
  try {
    const progress = await getUserProgress(userId);
    // Suppress unused variable error safely by parsing metadata arrays
    const chats = await getChats(userId);
    const historySnippet = chats.slice(0, 5).map(c => c.title);

    return {
      userId,
      progress: progress?.progress ?? 0,
      completedLessons: progress?.completedLessons ?? [],
      bookmarks: progress?.bookmarks ?? [],
      recentCourses: progress?.recentCourses ?? [],
      chatHistory: historySnippet,
      currentCourseId: progress?.lastCourseId || undefined,
      currentLessonId: progress?.currentLessonId || undefined,
    };
  } catch (e) {
    console.log("Context compilation trace failure:", e);
    return { userId };
  }
}

/**
 * ✅ Step 4 FIXED: Prepend specialized educational constraints prior to dispatching prompts [INDEX].
 */
export function buildSystemPrompt(context: AIContext): string {
  return `You are KnowledgeVerse AI Tutor, an elite personal tutor tailored for India's student body.

Student Current Platform Analytics:
- Learning Completion Ratio: ${context.progress ?? 0}%
- Finished Syllabus Lessons: ${context.completedLessons?.join(", ") || "None yet"}
- Active Curriculum Tracks: ${context.recentCourses?.join(", ") || "None yet"}
- Bookmarked Notes/Items: ${context.bookmarks?.join(", ") || "None yet"}
${context.teacherName ? `- Active Class Instructor: ${context.teacherName}` : ""}
${context.subject ? `- Current Academic Focus Subject: ${context.subject}` : ""}

Pedagogical Directives:
1. Always answer like an experienced, highly encouraging classroom teacher.
2. Prefer deep conceptual, educational explanations. Avoid short, non-descriptive answers.
3. Build on top of the student's completed lessons, cross-referencing concepts they already understand.
4. End your responses with inspiring follow-up questions or mini study recommendations to keep the student motivated.`;
}
