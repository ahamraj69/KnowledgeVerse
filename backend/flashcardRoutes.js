const express = require("express");
const { Groq } = require("groq-sdk");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Topic parameter is required." });
    }

    const prompt = `
Generate EXACTLY 5 high-quality learning flashcards based on the following topic.

Topic: ${topic.trim()}

Rules:
- Return ONLY a valid JSON array.
- Do not include markdown code wrappers (like \`\`\`json).
- No explanation or trailing text.

Format must be exactly this array structure:
[
  {
    "front": "Question or term on the front side",
    "back": "Answer, explanation, or concept definition on the back side"
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
      temperature: 0.5,
    });

    const aiResponse = completion.choices[0].message.content.trim();

    try {
      // Direct parsing validates structural array formatting parameters cleanly
      const parsedFlashcards = JSON.parse(aiResponse);
      res.json({ success: true, flashcards: parsedFlashcards });
    } catch (parseError) {
      if (__DEV__) console.log("Flashcard JSON Parsing error:", aiResponse);
      res.status(500).json({ error: "AI response failed JSON validation format check." });
    }

  } catch (error) {
    console.error("Flashcard generation error node caught:", error);
    res.status(500).json({ error: "Internal operational server fault caught." });
  }
});

module.exports = router;
