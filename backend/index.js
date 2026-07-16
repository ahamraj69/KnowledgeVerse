const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Groq } = require("groq-sdk");
// ✅ FIXED: Using pure uniform CommonJS require statements
const pdfRoutes = require("./pdfRoutes");

console.log("1. dotenv loaded");

dotenv.config();

console.log("GROQ KEY STATUS MATCH:", process.env.GROQ_API_KEY ? "Loaded ✅" : "Missing ❌");

const app = express();

console.log("2. express created");

app.use(cors());
app.use(express.json());

console.log("3. middleware loaded");

if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY not found in .env");
  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Test Route
app.get("/", (req, res) => {
  res.send("KnowledgeVerse Backend Running 🚀");
});

// Chat Route
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
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("========== GROQ ERROR ==========");
    console.error(error);
    console.error("================================");

    res.status(500).json({
      reply: "Chat error occurred",
    });
  }
});

// Register PDF routes
app.use("/pdf", pdfRoutes);

console.log("4. before app.listen");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

console.log("5. after app.listen");
