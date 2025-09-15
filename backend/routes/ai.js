import express from "express";
import axios from "axios";
const router = express.Router();

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

router.post("/chat", async (req, res) => {
  const { messages } = req.body;
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: messages.join("\n") }]
          }
        ]
      }
    );
    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";
    res.json({ text: aiText });
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    res.status(500).json({ text: "AI service error." });
  }
});

export default router;