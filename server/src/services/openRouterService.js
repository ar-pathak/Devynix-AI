const { OpenAI } = require('openai');
require('dotenv').config();

const openrouterClient = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    timeout: 6000,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Devynix Analyzer",
    }
});

// OpenRouter ke best aur hamesha chalne wale FREE models
const OPENROUTER_MODELS = [
    "qwen/qwen-2.5-coder-32b-instruct:free", 
    "google/gemma-2-9b-it:free",              
    "mistralai/mistral-7b-instruct:free",      
    "meta-llama/llama-3.1-8b-instruct:free",
    "stepfun/step-3.5-flash:free",       
    "google/gemma-2-9b-it:free",              
    "mistralai/mistral-7b-instruct:free",      
    "qwen/qwen-2.5-coder-32b-instruct:free", 
    "meta-llama/llama-3.1-8b-instruct:free",
    "nvidia/nemotron-3-super-120b-a12b:free",
    "arcee-ai/trinity-large-preview:free",
    "z-ai/glm-4.5-air:free",
    "nvidia/nemotron-3-nano-30b-a3b:free",
    "liquid/lfm-2.5-1.2b-thinking:free",
    "openai/gpt-oss-20b:free",
    "google/gemma-3n-e2b-it:free",
    "google/gemma-3n-e4b-it:free",
    "google/gemma-3-27b-it:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "meta-llama/llama-3.2-3b-instruct:free",  
];

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function callOpenRouter(messages) {
    const modelsToTry = shuffle([...OPENROUTER_MODELS]);

    for (const model of modelsToTry) {
        try {
            console.log(`  [OpenRouter] Trying: ${model}...`);
            const response = await openrouterClient.chat.completions.create({
                model: model,
                temperature: 0.1,
                messages: messages
            });
            console.log(`  ✅ [OpenRouter] Success -> ${model}`);
            return response.choices[0].message.content;
        } catch (error) {
            console.warn(`  ⚠️ [OpenRouter] ${model} busy.`);
        }
    }
    throw new Error("OpenRouter exhausted.");
}

module.exports = { callOpenRouter };