export interface PdfChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface UploadedPdf {
  id: string;
  name: string;
  uri: string;
}

export interface PdfChatResponse {
  answer: string;
}