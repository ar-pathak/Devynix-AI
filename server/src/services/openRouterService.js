const { OpenAI } = require('openai')
require('dotenv').config()

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const MAX_MODELS_PER_REQUEST = Math.max(1, Number(process.env.AI_MODELS_PER_PROVIDER || 2))
const ATTEMPT_TIMEOUT_MS = Math.max(3000, Number(process.env.AI_PROVIDER_TIMEOUT_MS || 8000))

const OPENROUTER_MODELS = [
  'qwen/qwen-2.5-coder-32b-instruct:free',
  'google/gemma-2-9b-it:free',
  'mistralai/mistral-7b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'stepfun/step-3.5-flash:free',
  'google/gemma-2-9b-it:free',
  'mistralai/mistral-7b-instruct:free',
  'qwen/qwen-2.5-coder-32b-instruct:free',
  'meta-llama/llama-3.1-8b-instruct:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'arcee-ai/trinity-large-preview:free',
  'z-ai/glm-4.5-air:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'liquid/lfm-2.5-1.2b-thinking:free',
  'openai/gpt-oss-20b:free',
  'google/gemma-3n-e2b-it:free',
  'google/gemma-3n-e4b-it:free',
  'google/gemma-3-27b-it:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
]

const openrouterClient = OPENROUTER_API_KEY
  ? new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: OPENROUTER_API_KEY,
      timeout: ATTEMPT_TIMEOUT_MS,
      defaultHeaders: {
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'Devynix Analyzer',
      },
    })
  : null

function shuffle(array) {
  const items = [...array]

  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[items[index], items[swapIndex]] = [items[swapIndex], items[index]]
  }

  return items
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    }),
  ])
}

function isOpenRouterConfigured() {
  return Boolean(OPENROUTER_API_KEY)
}

async function callOpenRouter(messages) {
  if (!openrouterClient) {
    throw new Error('OpenRouter provider is not configured.')
  }

  const modelsToTry = shuffle(OPENROUTER_MODELS).slice(0, MAX_MODELS_PER_REQUEST)

  for (const model of modelsToTry) {
    try {
      console.log(`  [OpenRouter] Trying: ${model}...`)
      const response = await withTimeout(openrouterClient.chat.completions.create({
        model,
        temperature: 0.1,
        messages,
      }), ATTEMPT_TIMEOUT_MS, `OpenRouter ${model}`)
      console.log(`  [OpenRouter] Success -> ${model}`)
      return response.choices[0].message.content
    } catch (error) {
      console.warn(`  [OpenRouter] ${model} failed: ${error.message}`)
    }
  }

  throw new Error('OpenRouter exhausted.')
}

module.exports = { callOpenRouter, isOpenRouterConfigured }
