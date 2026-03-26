const { OpenAI } = require('openai');
require('dotenv').config();

const groqClient = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
    timeout: 4000, // Groq is fast, so 4s timeout
});

// Groq ke top models
const GROQ_MODELS = [
    "llama-3.2-3b-preview",
    "llama-3.1-8b-instant",   
    "gemma2-9b-it",            
    "mixtral-8x7b-32768"        
];

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function callGroq(messages) {
    const modelsToTry = shuffle([...GROQ_MODELS]);

    for (const model of modelsToTry) {
        try {
            console.log(`  [Groq] Trying: ${model}...`);
            const response = await groqClient.chat.completions.create({
                model: model,
                temperature: 0.1,
                messages: messages
            });
            console.log(`  ✅ [Groq] Success -> ${model}`);
            return response.choices[0].message.content;
        } catch (error) {
            console.warn(`  ⚠️ [Groq] ${model} busy.`);
        }
    }
    throw new Error("Groq exhausted.");
}

module.exports = { callGroq };