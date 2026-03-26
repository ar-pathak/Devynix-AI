const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Gemini ke models
const GEMINI_MODELS = [
    "gemini-3.1-pro-preview",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-pro"
];

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function callGemini(systemPrompt, code) {
    const fullPrompt = `${systemPrompt}\n\nCode to analyze:\n\n${code}`;
    const modelsToTry = shuffle([...GEMINI_MODELS]);

    for (const modelName of modelsToTry) {
        try {
            console.log(`  [Gemini] Trying: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(fullPrompt);
            console.log(`  ✅ [Gemini] Success -> ${modelName}`);
            return result.response.text();
        } catch (error) {
            console.warn(`  ⚠️ [Gemini] ${modelName} busy.`);
        }
    }
    throw new Error("Gemini exhausted.");
}

module.exports = { callGemini };