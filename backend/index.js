const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Groq } = require("groq-sdk");

// Pure CommonJS module sub-router dependencies registration
const pdfRoutes = require("./pdfRoutes");

console.log("1. Environment variables initialization phase triggered...");

// Initialize environmental configurations
dotenv.config();

// Diagnostic Logger: Verifies .env parameters status in your terminal console instantly
console.log("GROQ KEY STATUS MATCH:", process.env.GROQ_API_KEY ? "Loaded ✅" : "Missing ❌");

const app = express();

console.log("2. Express app client context created");

app.use(cors());
app.use(express.json());

console.log("3. Middleware layers (CORS & JSON parsers) attached successfully");

if (!process.env.GROQ_API_KEY) {
  console.error("❌ Fatal Configuration Blocker: GROQ_API_KEY not found in active .env environment.");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Test Root Route
app.get("/", (req, res) => {
  res.send("KnowledgeVerse Backend Running Successfully 🚀");
});

// AI Tutor Chat Route Pipeline
app.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const messages = [
      {
        role: "system",
        content:
          "You are KnowledgeVerse AI Tutor. Explain concepts step-by-step in simple language suitable for students.",
      },
      ...history.map((item) => ({
        role: item.role === "ai" ? "assistant" : "user",
        content: item.text,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    res.json({
      reply: completion.choices.message.content,
    });
  } catch (error) {
    console.error("========== GROQ TELEMETRY ERROR ==========");
    console.error(error);
    console.error("==========================================");

    res.status(500).json({
      reply: "An internal chat error occurred during prompt generation.",
    });
  }
});

// Registered localized document parsing sub-routers matrix paths
app.use("/pdf", pdfRoutes);

// AI Flashcard Generator Route Inline 
app.post("/flashcards", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        cards: [],
      });
    }

    const prompt = `
Generate exactly 10 educational flashcards.

Topic:
${topic}

Return ONLY valid JSON.

Example:

[
  {
    "question":"...",
    "answer":"..."
  }
]
`;

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      });

    const response = completion.choices.message.content;

    let cards = [];

    try {
      const clean = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      cards = JSON.parse(clean);
    } catch (err) {
      console.log("Flashcard JSON Parse Error:", err);
      cards = [];
    }

    res.json({
      cards,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      cards: [],
    });
  }
});

// ============================================================================
// ✅ FIXED PHASE 41 PART 1: Enhanced AI Assignment Generator Endpoint
// ============================================================================
app.post("/assignment", async (req, res) => {
  try {
    const { topic, type, difficulty } = req.body;

    if (!topic) {
      return res.status(400).json({
        result: "",
      });
    }

    const prompt = `
You are an expert teacher.

Create a ${difficulty} level ${type} about:

${topic}

Rules:
- Write clearly.
- Suitable for students.
- Well formatted.
- Include headings where appropriate.
- Do not include markdown.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.6,
      max_tokens: 1200,
    });

    res.json({
      result: completion.choices[0].message.content,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      result: "Unable to generate assignment.",
    });
  }
});

console.log("4. Operational route endpoints registered. Initializing app.listen...");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Success: Server running cleanly on http://localhost:${PORT}`);
});

console.log("5. Lifecycle boot check completed execution loop.");
