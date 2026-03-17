const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

// ── Helper: Call Groq API (Free, Fast, No Credit Card) ────────
async function callGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert Indian agricultural advisor helping farmers with crop recommendations, fertilizer advice, disease detection, and government schemes. Always give practical, specific advice for Indian farming conditions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Groq API error");
  }

  return data.choices?.[0]?.message?.content || "";
}

// ─────────────────────────────────────────────────────────────
// POST /api/ai/crop-recommendation
// ─────────────────────────────────────────────────────────────
router.post("/crop-recommendation", protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const text = await callGroq(prompt);

    if (text) res.json({ success: true, text });
    else res.status(500).json({ success: false, message: "No response from AI" });
  } catch (err) {
    console.error("Crop recommendation error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/fertilizer-advice
// ─────────────────────────────────────────────────────────────
router.post("/fertilizer-advice", protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const text = await callGroq(prompt);

    if (text) res.json({ success: true, text });
    else res.status(500).json({ success: false, message: "No response from AI" });
  } catch (err) {
    console.error("Fertilizer advice error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/disease-detection (with base64 image support)
// ─────────────────────────────────────────────────────────────
router.post("/disease-detection", protect, async (req, res) => {
  try {
    const { prompt, imageBase64, mimeType } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    let text = "";

    // If image provided — use Groq vision model
    if (imageBase64) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType || "image/jpeg"};base64,${imageBase64}`,
                  },
                },
                {
                  type: "text",
                  text: prompt,
                },
              ],
            },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Groq vision error");
      text = data.choices?.[0]?.message?.content || "";

    } else {
      // No image — use text-only model
      text = await callGroq(prompt);
    }

    if (text) res.json({ success: true, text });
    else res.status(500).json({ success: false, message: "No response from AI" });

  } catch (err) {
    console.error("Disease detection error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/government-schemes
// ─────────────────────────────────────────────────────────────
router.post("/government-schemes", protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const text = await callGroq(prompt);

    if (text) res.json({ success: true, text });
    else res.status(500).json({ success: false, message: "No response from AI" });
  } catch (err) {
    console.error("Government schemes error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/community-reply
// ─────────────────────────────────────────────────────────────
router.post("/community-reply", protect, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    const text = await callGroq(prompt);

    if (text) res.json({ success: true, text });
    else res.status(500).json({ success: false, message: "No response from AI" });
  } catch (err) {
    console.error("Community reply error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;