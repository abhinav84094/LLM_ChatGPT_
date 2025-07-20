import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBA4wpULJqhtpjByJu_eBYreqV3WJZkxnQ", // Replace this
});

const History = [];

app.post("/chat", async (req, res) => {
  try {
    const userProblem = req.body.message;

    if (!userProblem) {
      return res.status(400).json({ error: "Message is required" });
    }

    History.push({
      role: "user",
      parts: [{ text: userProblem }],
    });

    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents:History
      });

    const responseText = result.text || "⚠️ Gemini gave no response.";

    History.push({
      role: "model",
      parts: [{ text: responseText }],
    });

    console.log("Gemini Response:\n", responseText);

    res.json({ text: responseText });
  } catch (err) {
    console.error("Error in Gemini request:", err);
    res.status(500).json({ error: "Gemini request failed." });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
