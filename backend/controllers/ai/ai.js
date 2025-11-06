import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateTitle = async (req, res) => {
  const { name, market } = req.body;
  if (!name) return res.status(400).json({ error: "Product name is required" });

  const region = "Sri Lanka"; // Fixed region for Daraz LK

  try {
    const prompt = `
You are a professional Daraz SEO listing expert for ${region}.
Generate 3 optimized and unique Daraz product titles for this product:

${name}

Strict Daraz Title Rules:
--------------------------------------------------------
Language: British English (Sri Lanka – use "Colour" instead of "Color")
Each title must be 90–120 characters
Every title must have a different structure — vary word order and phrasing
Do NOT repeat the same key phrases or structure across titles

✅ Title format: [Brand] [Product Type] [Key Feature] [Size/Colour/Pack]
✅ Use Title Case (Capitalize Each Word)
✅ Keep the most important keywords in the first 60 characters
✅ Include relevant search terms customers would use
✅ Output only:
1. ...
2. ...
3. ...

❌ Do NOT include:
- Promotional terms (Buy Now, Offer, Deal, Discount, Free Shipping, Sale, Best Price)
- Condition words (New, Used, Refurbished, Pre-Owned)
- Subjective adjectives (Beautiful, Stylish, Perfect, Premium, High Quality)
- Emojis or symbols (!@#$%^&*)
- ALL CAPS
- Repeated or meaningless filler words

✅ Example good titles:
1. LEDSONE 18W Ceiling LED Light Round Warm White – Energy Saving Indoor Lighting
2. Samsung 25W Fast Charger Type-C – Original Adaptive Power Adapter for Galaxy Series
3. Philips LED Bulb 12W B22 Base – Cool Daylight Energy Efficient Pack of 2
--------------------------------------------------------
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    let text = "";
    if (response?.candidates?.length) {
      text = response.candidates[0]?.content?.parts?.[0]?.text?.trim() || "";
    } else if (typeof response.text === "function") {
      text = await response.text();
    }

    if (!text) {
      console.log("Gemini raw output:", JSON.stringify(response, null, 2));
      return res.status(500).json({ error: "No title generated" });
    }

    // Clean up and format results
    text = text
      .replace(/Here are.*?:/gi, "")
      .replace(/based on.*?:/gi, "")
      .replace(/for the .* market.*?:/gi, "")
      .replace(/\(\d+\/\d+\)/g, "")
      .replace(/titles?[:\-]?/gi, "")
      .trim();

    let titles = text
      .split(/\d+\./)
      .map((t) => t.trim())
      .filter((t) => t.length > 3);

    const forbidden = [
      "new",
      "used",
      "refurbished",
      "preowned",
      "pre-owned",
      "buy",
      "offer",
      "deal",
      "discount",
      "sale",
      "shipping",
      "price",
      "limited",
      "stock",
      "best",
      "free",
      "quality",
      "premium",
      "stylish",
      "perfect",
      "beautiful",
    ];

    const seenPhrases = new Set();

    titles = titles
      .map((title) => {
        const words = title.split(/\s+/);
        const seen = new Set();
        const cleanWords = [];

        for (let word of words) {
          const lower = word.toLowerCase().replace(/[^\w]/g, "");
          if (forbidden.includes(lower)) continue;
          if (!seen.has(lower) && lower !== "") {
            seen.add(lower);
            cleanWords.push(word);
          }
        }

        let cleanTitle = cleanWords.join(" ").trim();

        cleanTitle = cleanTitle
          .replace(/[!@#$%^&*(),.?":{}|<>]/g, "")
          .replace(/\s{2,}/g, " ");

        if (cleanTitle.length > 120) {
          const wordsArr = cleanTitle.split(" ");
          let finalTitle = "";
          for (let w of wordsArr) {
            if ((finalTitle + " " + w).trim().length <= 120) {
              finalTitle = (finalTitle + " " + w).trim();
            } else break;
          }
          cleanTitle = finalTitle.trim();
        }

        if (cleanTitle.length < 90) {
          const lastWords = cleanTitle.split(" ").slice(-3).join(" ");
          while (cleanTitle.length < 90 && cleanTitle.length < 120) {
            cleanTitle += " " + lastWords;
          }
          cleanTitle = cleanTitle.trim();
        }

        const phraseSignature = cleanTitle
          .toLowerCase()
          .split(" ")
          .slice(0, 5)
          .join(" ");

        if (seenPhrases.has(phraseSignature)) return null;
        seenPhrases.add(phraseSignature);

        return cleanTitle;
      })
      .filter((t) => t && t.length >= 90 && t.length <= 120);

    const uniqueTitles = [...new Set(titles)];

    if (!uniqueTitles.length)
      return res.status(500).json({ error: "No valid Daraz LK titles generated" });

    res.json({ market: region, titles: uniqueTitles });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({
      error: "Error generating Daraz LK title",
      details: err.message,
    });
  }
};
