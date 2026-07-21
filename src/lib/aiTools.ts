const API = "http://YOUR_BACKEND_IP:5000";

async function post(endpoint: string, body: any) {
  const response = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Server Error");
  }

  return response.json();
}

export async function askPDF(question: string, documentId: string) {
  return post("/pdf/chat", {
    question,
    documentId,
  });
}

export async function analyzeImage(imageUrl: string, prompt: string) {
  return post("/image/chat", {
    imageUrl,
    prompt,
  });
}

export async function generateAssignment(topic: string, grade: string) {
  return post("/assignment/generate", {
    topic,
    grade,
  });
}

export async function generateQuiz(topic: string, difficulty: string) {
  return post("/quiz/generate", {
    topic,
    difficulty,
  });
}