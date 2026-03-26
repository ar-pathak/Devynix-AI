const { OpenAI } = require('openai');
require('dotenv').config();

const githubClient = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: process.env.GITHUB_TOKEN,
    timeout: 7000,
});

// GitHub ke top free models ki list
const GITHUB_MODELS = [
    "openai/gpt-4o-mini",
    "meta-llama-3.1-8b-instruct",
    "Cohere/command-r",
    "microsoft/Phi-3-mini-4k-instruct",
];
// Array shuffler (Traffic distribute karne ke liye)
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function callGithub(messages) {
    const modelsToTry = shuffle([...GITHUB_MODELS]); // Har request pe models ka order badal jayega

    for (const model of modelsToTry) {
        try {
            console.log(`  [GitHub] Trying: ${model}...`);
            const response = await githubClient.chat.completions.create({
                model: model,
                temperature: 0.1,
                messages: messages
            });
            console.log(`  ✅ [GitHub] Success -> ${model}`);
            return response.choices[0].message.content;
        } catch (error) {
            console.warn(`  ⚠️ [GitHub] ${model} busy.`);
        }
    }
    throw new Error("GitHub exhausted.");
}

module.exports = { callGithub };