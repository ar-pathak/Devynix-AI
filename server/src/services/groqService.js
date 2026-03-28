const { OpenAI } = require('openai')
require('dotenv').config()

const GROQ_API_KEY = process.env.GROQ_API_KEY
const MAX_MODELS_PER_REQUEST = Math.max(1, Number(process.env.AI_MODELS_PER_PROVIDER || 2))
const ATTEMPT_TIMEOUT_MS = Math.max(3000, Number(process.env.AI_PROVIDER_TIMEOUT_MS || 8000))

const GROQ_MODELS = [
  'llama-3.2-3b-preview',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
  'mixtral-8x7b-32768',
]

const groqClient = GROQ_API_KEY
  ? new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: GROQ_API_KEY,
      timeout: ATTEMPT_TIMEOUT_MS,
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

function isGroqConfigured() {
  return Boolean(GROQ_API_KEY)
}

async function callGroq(messages) {
  if (!groqClient) {
    throw new Error('Groq provider is not configured.')
  }

  const modelsToTry = shuffle(GROQ_MODELS).slice(0, MAX_MODELS_PER_REQUEST)

  for (const model of modelsToTry) {
    try {
      console.log(`  [Groq] Trying: ${model}...`)
      const response = await withTimeout(groqClient.chat.completions.create({
        model,
        temperature: 0.1,
        messages,
      }), ATTEMPT_TIMEOUT_MS, `Groq ${model}`)
      console.log(`  [Groq] Success -> ${model}`)
      return response.choices[0].message.content
    } catch (error) {
      console.warn(`  [Groq] ${model} failed: ${error.message}`)
    }
  }

  throw new Error('Groq exhausted.')
}

module.exports = { callGroq, isGroqConfigured }
