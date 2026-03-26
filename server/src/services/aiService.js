const { callGithub } = require('./githubService');
const { callGroq } = require('./groqService');
const { callGemini } = require('./geminiService');
const { callOpenRouter } = require('./openRouterService');

// Global index track karne ke liye (Round-Robin Logic)
let currentProviderIndex = 0;

function cleanAndParseJSON(text) {
    if (!text) throw new Error("Empty response");
    const cleanedText = text.replace(/```json/i, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
}

async function analyzeWithAI(code, language) {
    const systemPrompt = `You are an expert Senior Software Engineer and Code Analyzer. 
    Analyze the following ${language} code. 
    You MUST respond STRICTLY in the following JSON format. Do not include markdown blocks.
    {
      "explanation": "A clear, concise 2-3 sentence explanation.",
      "bugs": ["Describe bug 1", "Describe bug 2"],
      "improvements": ["Suggest improvement 1"]
    }`;

    const messagesArray = [
        { role: "system", content: systemPrompt },
        { role: "user", content: code }
    ];

    // Array of all providers
    const providers = [
        { name: "GITHUB", fetch: () => callGithub(messagesArray) },
        { name: "GROQ", fetch: () => callGroq(messagesArray) },
        { name: "GEMINI", fetch: () => callGemini(systemPrompt, code) },
        { name: "OPENROUTER", fetch: () => callOpenRouter(messagesArray) }
    ];

    // Round-Robin Queue banana (Har request pe order badal jayega)
    const startIndex = currentProviderIndex;
    currentProviderIndex = (currentProviderIndex + 1) % providers.length; // Agli baar agla provider pehle aayega

    // Is specific request ke liye queue set karna
    const requestQueue = [];
    for (let i = 0; i < providers.length; i++) {
        requestQueue.push(providers[(startIndex + i) % providers.length]);
    }

    console.log(`\n🚦 NEW REQUEST: Starting at Provider [${requestQueue[0].name}]`);

    // Queue mein ek-ek karke try karna
    for (const provider of requestQueue) {
        try {
            console.log(`➡️ Sending to ${provider.name}...`);
            const rawAiText = await provider.fetch();
            return cleanAndParseJSON(rawAiText);
        } catch (e) {
            console.log(`🔴 ${provider.name} failed: Moving to next in queue...`);
        }
    }

    // Agar saare 4 providers (aur unke andar ke 14 models) fail ho jayein!
    throw new Error("All AI systems are currently under heavy load. Please try again in 5 seconds.");
}

module.exports = { analyzeWithAI };