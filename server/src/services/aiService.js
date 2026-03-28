const { callGithub, isGithubConfigured } = require('./githubService')
const { callGroq, isGroqConfigured } = require('./groqService')
const { callGemini, isGeminiConfigured } = require('./geminiService')
const { callOpenRouter, isOpenRouterConfigured } = require('./openRouterService')

let currentProviderIndex = 0

function cleanAndParseJSON(text) {
  if (!text) {
    throw new Error('Empty response')
  }

  let cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()

  const jsonStart = cleaned.indexOf('{')
  const jsonEnd = cleaned.lastIndexOf('}')

  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1)
  }

  return JSON.parse(cleaned)
}

function cleanRawCode(text) {
  if (!text) {
    return ''
  }

  return text
    .replace(/^```[a-z]*\n?/gim, '')
    .replace(/```\s*$/gim, '')
    .trim()
}

function getProviderQueue(providers) {
  if (!providers.length) {
    throw new Error('No AI provider is configured. Add at least one server API key.')
  }

  const startIndex = currentProviderIndex % providers.length
  currentProviderIndex = (currentProviderIndex + 1) % providers.length

  const queue = []

  for (let index = 0; index < providers.length; index += 1) {
    queue.push(providers[(startIndex + index) % providers.length])
  }

  return queue
}

function getConfiguredProviderNames() {
  return [
    isGithubConfigured() && 'github',
    isGroqConfigured() && 'groq',
    isGeminiConfigured() && 'gemini',
    isOpenRouterConfigured() && 'openrouter',
  ].filter(Boolean)
}

function buildProviderQueue(messagesArray, systemPrompt, content) {
  return getProviderQueue([
    isGithubConfigured() && { name: 'GITHUB', fetch: () => callGithub(messagesArray) },
    isGroqConfigured() && { name: 'GROQ', fetch: () => callGroq(messagesArray) },
    isGeminiConfigured() && { name: 'GEMINI', fetch: () => callGemini(systemPrompt, content) },
    isOpenRouterConfigured() && { name: 'OPENROUTER', fetch: () => callOpenRouter(messagesArray) },
  ].filter(Boolean))
}

function normaliseSuggestionItems(items) {
  if (!Array.isArray(items)) {
    return []
  }

  return items.map((item) => {
    if (typeof item === 'string') {
      return { description: item, snippet: '', replacement: '' }
    }

    return {
      description: item.description || item.text || '',
      snippet: item.snippet || item.code || '',
      replacement: item.replacement || item.fix || item.fixedSnippet || item.improvedSnippet || item.suggestedSnippet || '',
    }
  })
}

async function analyzeWithAI(code, language) {
  const systemPrompt = `You are an expert Senior Software Engineer and code review assistant.
Analyze the following ${language} code.

You MUST respond with valid JSON only. No markdown. No prose outside JSON. No code fences.

Schema:
{
  "explanation": "2-3 sentence summary of what this code does.",
  "bugs": [
    {
      "description": "Short description of the bug or risk.",
      "snippet": "The EXACT verbatim lines from the user code that contain the bug.",
      "replacement": "A ready-to-apply replacement snippet that fixes the bug. Return only the replacement code for the snippet, not the full file."
    }
  ],
  "improvements": [
    {
      "description": "Short description of the improvement opportunity.",
      "snippet": "The EXACT verbatim lines from the user code to improve.",
      "replacement": "A ready-to-apply replacement snippet that improves the original snippet. Return only the replacement code for the snippet, not the full file."
    }
  ]
}

Rules:
- "snippet" must be copied character-for-character from the input code.
- "replacement" must be a drop-in replacement for the snippet, preserving indentation style.
- Do not include explanations inside "replacement".
- If no bugs exist, return "bugs": []
- If no improvements exist, return "improvements": []
- If you cannot safely suggest a replacement for an item, keep "replacement" as an empty string.
- Return raw JSON only.`

  const messagesArray = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: code },
  ]

  const queue = buildProviderQueue(messagesArray, systemPrompt, code)
  console.log(`\n[ANALYZE] Starting at ${queue[0].name}`)

  for (const provider of queue) {
    try {
      console.log(`  Trying ${provider.name}...`)
      const raw = await provider.fetch()
      const parsed = cleanAndParseJSON(raw)

      console.log(`  ${provider.name} succeeded`)
      return {
        explanation: parsed.explanation || '',
        bugs: normaliseSuggestionItems(parsed.bugs),
        improvements: normaliseSuggestionItems(parsed.improvements),
      }
    } catch (error) {
      console.log(`  ${provider.name} failed: ${error.message}`)
    }
  }

  throw new Error('All configured AI providers are busy. Please try again.')
}

async function fixWithAI(fullCode, language, issueDescription, buggySnippet) {
  const hasSnippet = Boolean(buggySnippet && buggySnippet.trim())

  const systemPrompt = hasSnippet
    ? `You are an expert Senior Software Engineer fixing ${language} code.

Issue to fix: "${issueDescription}"

The EXACT snippet that needs fixing:
\`\`\`
${buggySnippet}
\`\`\`

Rules:
1. Return only the corrected replacement snippet.
2. Do not return the full file.
3. Do not include markdown code fences.
4. Do not add explanations or comments.
5. Preserve the original indentation style.`
    : `You are an expert Senior Software Engineer fixing ${language} code.

Issue to fix: "${issueDescription}"

Rules:
1. Return only the fully corrected source file.
2. Do not include markdown code fences.
3. Do not add explanations.`

  const userContent = hasSnippet
    ? `Full file for context (do not output this):\n\n${fullCode}`
    : fullCode

  const messagesArray = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userContent },
  ]

  const queue = buildProviderQueue(messagesArray, systemPrompt, userContent)
  console.log(`\n[FIX] Starting at ${queue[0].name} | snippet=${hasSnippet}`)

  for (const provider of queue) {
    try {
      console.log(`  Trying ${provider.name}...`)
      const raw = await provider.fetch()
      const fixedSnippet = cleanRawCode(raw)

      if (!fixedSnippet) {
        throw new Error('Empty response')
      }

      console.log(`  ${provider.name} succeeded`)
      return { fixedSnippet, hasSnippet }
    } catch (error) {
      console.log(`  ${provider.name} failed: ${error.message}`)
    }
  }

  throw new Error('All configured AI providers are busy. Could not apply fix.')
}

module.exports = { analyzeWithAI, fixWithAI, getConfiguredProviderNames }
