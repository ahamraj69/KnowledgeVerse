const express = require("express");
const fs = require("fs");
const multer = require("multer");
const PDFParser = require("pdf2json");
const { Groq } = require("groq-sdk");
// ✅ Option 1 FIXED: Mounted independent isolated environment configurations loader block
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname
    );
  },
});

const upload = multer({ storage });

const pdfStore = {};

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: "No file uploaded." });
      }

      const parsedText = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
          const rawText = pdfParser.getRawTextContent();
          resolve(rawText);
        });

        pdfParser.loadPDF(req.file.path);
      });

      const pdfId = Date.now().toString();
      pdfStore[pdfId] = parsedText;

      res.json({
        success: true,
        pdfId,
      });
    } catch (err) {
      console.error("PDF Upload processing exception caught:", err);
      res.status(500).json({
        success: false,
      });
    }
  }
);

router.post("/chat", async (req, res) => {
  try {
    const { pdfId, question } = req.body;
    const text = pdfStore[pdfId];

    if (!text) {
      return res.status(404).json({
        answer: "PDF context map target not found.",
      });
    }

    const prompt = `
Answer the student's question using ONLY the provided PDF text block references.

PDF Content:
${text}

Question:
${question}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    res.json({
      answer: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("PDF Chat operational fault caught:", err);
    res.status(500).json({
      answer: "Something went wrong during prompt evaluation.",
    });
  }
});

module.exports = router;
