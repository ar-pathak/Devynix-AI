const { OpenAI } = require('openai')
require('dotenv').config()

const GITHUB_API_KEY = process.env.GITHUB_TOKEN
const MAX_MODELS_PER_REQUEST = Math.max(1, Number(process.env.AI_MODELS_PER_PROVIDER || 2))
const ATTEMPT_TIMEOUT_MS = Math.max(3000, Number(process.env.AI_PROVIDER_TIMEOUT_MS || 8000))

const GITHUB_MODELS = [
  'openai/gpt-4o-mini',
  'meta-llama-3.1-8b-instruct',
  'Cohere/command-r',
  'microsoft/Phi-3-mini-4k-instruct',
]

const githubClient = GITHUB_API_KEY
  ? new OpenAI({
      baseURL: 'https://models.github.ai/inference',
      apiKey: GITHUB_API_KEY,
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

function isGithubConfigured() {
  return Boolean(GITHUB_API_KEY)
}

async function callGithub(messages) {
  if (!githubClient) {
    throw new Error('GitHub provider is not configured.')
  }

  const modelsToTry = shuffle(GITHUB_MODELS).slice(0, MAX_MODELS_PER_REQUEST)

  for (const model of modelsToTry) {
    try {
      console.log(`  [GitHub] Trying: ${model}...`)
      const response = await withTimeout(githubClient.chat.completions.create({
        model,
        temperature: 0.1,
        messages,
      }), ATTEMPT_TIMEOUT_MS, `GitHub ${model}`)
      console.log(`  [GitHub] Success -> ${model}`)
      return response.choices[0].message.content
    } catch (error) {
      console.warn(`  [GitHub] ${model} failed: ${error.message}`)
    }
  }

  throw new Error('GitHub exhausted.')
}

module.exports = { callGithub, isGithubConfigured }
