import { ChatMessage } from "@/types/chat";

/**
 * Evaluates dialogue parameters locally using case-insensitive text matching lookups [INDEX].
 */
export function searchMessages(messages: ChatMessage[], keyword: string): ChatMessage[] {
  const cleanKeyword = keyword.trim().toLowerCase();
  if (!cleanKeyword) return messages;

  return messages.filter((message) =>
    message.content.toLowerCase().includes(cleanKeyword)
  );
}
