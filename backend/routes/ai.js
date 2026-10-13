import express from "express";
import axios from "axios";
const router = express.Router();

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axios.post(
      // ✅ Correct model endpoint (no "models/" prefix, use -latest)
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                // ✅ Safe join in case messages is an array of strings
                text: Array.isArray(messages)
                  ? messages.join("\n")
                  : String(messages),
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand that.";

    res.json({ text: aiText });
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    res.status(500).json({ text: "AI service error." });
  }
});

export default router;
