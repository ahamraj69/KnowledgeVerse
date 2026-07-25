// ✅ FIXED: Removed the invalid/unused type import completely to clear the compilation blocker
interface ContextMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Filters long conversation threads to preserve context window budgets [INDEX].
 */
export function compressAIConversationContext(
  systemPrompt: string,
  rawHistory: { sender: "user" | "ai"; text: string }[],
  newPrompt: string
): ContextMessage[] {
  // Cap history elements to the 10 most recent exchanges to prevent memory bloating
  const restrictedHistory = rawHistory.slice(-10);
  
  const formattedMessages: ContextMessage[] = [
    { role: "system", content: systemPrompt }
  ];

  restrictedHistory.forEach(msg => {
    formattedMessages.push({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text.substring(0, 1000) // Cap characters length safely
    });
  });

  formattedMessages.push({ role: "user", content: newPrompt.substring(0, 1000) });
  return formattedMessages;
}
