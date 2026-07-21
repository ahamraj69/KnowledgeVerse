import { AIContext } from "@/types/aiContext";

const API = "http://192.168.1";

/**
 * ✅ Step 5 FIXED: Streams active prompt text paired with rich context data down to the model endpoints [INDEX].
 */
export async function askAI(message: string, context?: Omit<AIContext, "userId">): Promise<string> {
  const payload = {
    message,
    // Safely defaults to fallback values to prevent backend parameter lookups from breaking
    context: context || {
      progress: 0,
      completedLessons: [],
      recentCourses: []
    }
  };

  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Context-aware text execution gateway returned an invalid condition index.");
  }

  const data = await response.json();
  return data.reply;
}
