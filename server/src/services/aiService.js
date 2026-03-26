const { OpenAI } = require("openai");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// ─── ENV DEBUG (IMPORTANT) ─────────────────────────
console.log("GEMINI:", process.env.GEMINI_API_KEY ? "OK" : "MISSING");
console.log("OPENROUTER:", process.env.OPENROUTER_API_KEY ? "OK" : "MISSING");
console.log("GROQ:", process.env.GROQ_API_KEY ? "OK" : "MISSING");
console.log("GITHUB:", process.env.GITHUB_TOKEN ? "OK" : "MISSING");

// ─── CLIENTS ───────────────────────────────────────

// GitHub Models
const githubClient = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: process.env.GITHUB_TOKEN,
    timeout: 7000,
});

// Groq
const groqClient = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
    timeout: 5000,
});

// OpenRouter (FIXED)
const openrouterClient = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    timeout: 8000,
    defaultHeaders: {
        "HTTP-Referer": "https://yourdomain.com", // 🔥 change this in prod
        "X-Title": "Devynix Analyzer",
    },
});

// Gemini (FIXED MODEL)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── SAFE JSON PARSER ──────────────────────────────
function cleanAndParseJSON(text) {
    if (!text) throw new Error("Empty response from AI");

    const cleanedText = text
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim();

    try {
        return JSON.parse(cleanedText);
    } catch (err) {
        console.error("❌ Invalid JSON received:\n", cleanedText);
        throw new Error("AI returned invalid JSON");
    }
}

// ─── MAIN FUNCTION ─────────────────────────────────
async function analyzeWithAI(code, language) {
    const systemPrompt = `You are an expert Senior Software Engineer and Code Analyzer.

Analyze the following ${language} code.

You MUST respond STRICTLY in JSON format:

{
  "explanation": "2-3 sentence explanation",
  "bugs": ["bug1", "bug2"],
  "improvements": ["improvement1", "improvement2"]
}

No markdown. No extra text. Only JSON.`;

    const messagesArray = [
        { role: "system", content: systemPrompt },
        { role: "user", content: code },
    ];

    // ─── ATTEMPT 1: GITHUB ─────────────────────────
      try {
        console.log("🟢 GitHub Models...");
        const response = await githubClient.chat.completions.create({
          model: "openai/gpt-4o-mini",
          temperature: 0.1,
          messages: messagesArray,
        });

        return cleanAndParseJSON(response.choices[0].message.content);
      } catch (e) {
        console.warn("⚠️ GitHub failed:", e.message);
      }

    // ─── ATTEMPT 2: GROQ ───────────────────────────
      try {
        console.log("🟡 Groq...");
        const response = await groqClient.chat.completions.create({
          model: "llama-3.1-8b-instant",
          temperature: 0.1,
          messages: messagesArray,
        });

        return cleanAndParseJSON(response.choices[0].message.content);
      } catch (e) {
        console.warn("⚠️ Groq failed:", e.message);
      }

    // ─── ATTEMPT 3: GEMINI (FIXED) ─────────────────
    try {
        console.log("🟠 Gemini...");
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
        });

        const fullPrompt = `${systemPrompt}\n\nCode:\n${code}`;

        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();

        return cleanAndParseJSON(text);
    } catch (e) {
        console.warn("⚠️ Gemini failed:", e.message);
    }

    // ─── ATTEMPT 4: OPENROUTER (FIXED) ─────────────
    try {
        console.log("🔴 OpenRouter...");
        const response = await openrouterClient.chat.completions.create({
            model: "nvidia/nemotron-3-super-120b-a12b:free",
            temperature: 0.1,
            messages: messagesArray,
        });

        return cleanAndParseJSON(response.choices[0].message.content);
    } catch (e) {
        console.error("❌ OpenRouter failed:", e.message);
        throw new Error(
            "All AI providers failed. Try again in a few seconds."
        );
    }
}

module.exports = { analyzeWithAI };