const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const MAX_MODELS_PER_REQUEST = Math.max(1, Number(process.env.AI_MODELS_PER_PROVIDER || 2))
const ATTEMPT_TIMEOUT_MS = Math.max(3000, Number(process.env.AI_PROVIDER_TIMEOUT_MS || 8000))

const GEMINI_MODELS = [
  'gemini-3.1-pro-preview',
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-pro',
]

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

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

function isGeminiConfigured() {
  return Boolean(GEMINI_API_KEY)
}

async function callGemini(systemPrompt, code) {
  if (!genAI) {
    throw new Error('Gemini provider is not configured.')
  }

  const fullPrompt = `${systemPrompt}\n\nCode to analyze:\n\n${code}`
  const modelsToTry = shuffle(GEMINI_MODELS).slice(0, MAX_MODELS_PER_REQUEST)

  for (const modelName of modelsToTry) {
    try {
      console.log(`  [Gemini] Trying: ${modelName}...`)
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await withTimeout(model.generateContent(fullPrompt), ATTEMPT_TIMEOUT_MS, `Gemini ${modelName}`)
      console.log(`  [Gemini] Success -> ${modelName}`)
      return result.response.text()
    } catch (error) {
      console.warn(`  [Gemini] ${modelName} failed: ${error.message}`)
    }
  }

  throw new Error('Gemini exhausted.')
}

module.exports = { callGemini, isGeminiConfigured }
