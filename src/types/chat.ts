export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  type: "text" | "voice" | "image" | "pdf";
  content: string;
  createdAt: number;
}

// ✅ FIXED: Expanded Bookmark interface contract to clear your BookmarkCard property errors
export interface Bookmark {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  createdAt: any; 
}

// ✅ FIXED: Standardized DownloadItem type mapping definition
export interface DownloadItem {
  id: string;
  userId: string;
  lessonId: string;
  title: string;
  timestamp: number;
}
