import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { question, goals = [] } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    // Get Gemini API key from .env
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: "Gemini API key is missing",
      });
    }

    // Create Gemini client AFTER environment variables are loaded
    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    // Convert savings goals into text
    const goalsText = goals
      .map(
        (goal) =>
          `Goal: ${goal.name}, Target: ${goal.targetAmount}, Current: ${goal.currentAmount}, Progress: ${goal.progress}%`,
      )
      .join("\n");

    // Prompt for Gemini
    const prompt = `
You are a helpful personal finance assistant.

Answer the user's question clearly and simply.

User's savings goals:
${goalsText || "No savings goals available."}

User question:
${question}

Give practical financial guidance.
Do not invent financial data that was not provided.
`;

    // Send request to Gemini
   const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: prompt,
  config: {
    temperature: 0.2,
    maxOutputTokens: 200,
  },
});

    const answer = response.text;

    return res.json({
      answer: answer || "I could not generate a response.",
    });
  } catch (error) {
    console.error("Gemini assistant error:", error);

    return res.status(500).json({
      message:
        error?.message || "Unable to connect to the finance assistant.",
    });
  }
});

export default router;