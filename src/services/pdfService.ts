import { UploadedPdf } from "@/types/pdf";

const API_URL = "http://YOUR_PC_IP:5000";

export async function uploadPdf(
  file: UploadedPdf
) {
  const form = new FormData();

  form.append("file", {
    uri: file.uri,
    type: "application/pdf",
    name: file.name,
  } as any);

  const response = await fetch(
    `${API_URL}/pdf/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  return response.json();
}

export async function askPdfAI(
  pdfId: string,
  question: string
) {
  const response = await fetch(
    `${API_URL}/pdf/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pdfId,
        question,
      }),
    }
  );

  return response.json();
}