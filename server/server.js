const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { analyzeWithAI, fixWithAI, getConfiguredProviderNames } = require('./src/services/aiService')

const app = express()
const PORT = process.env.PORT || 5000
const MAX_CODE_SIZE = 150000

app.use(cors())
app.use(express.json({ limit: '2mb' }))

function normalizeLineEndings(value = '') {
  return String(value).replace(/\r\n?/g, '\n')
}

function validateCodePayload(code, language, issue) {
  if (!code || !language) {
    return 'code and language are required.'
  }

  if (typeof code !== 'string' || typeof language !== 'string') {
    return 'code and language must be strings.'
  }

  if (code.length > MAX_CODE_SIZE) {
    return `code exceeds the ${MAX_CODE_SIZE} character limit.`
  }

  if (issue !== undefined && (!issue || typeof issue !== 'string')) {
    return 'issue must be a non-empty string.'
  }

  return null
}

function alignSnippetIndentation(fixedSnippet, originalSnippet) {
  const fixedLines = normalizeLineEndings(fixedSnippet).split('\n')
  const originalLines = normalizeLineEndings(originalSnippet).split('\n')
  const targetIndent = originalLines[0]?.match(/^\s*/)?.[0] || ''
  const nonEmptyFixedLines = fixedLines.filter((line) => line.trim())

  if (!nonEmptyFixedLines.length) {
    return fixedSnippet
  }

  const baseIndent = Math.min(...nonEmptyFixedLines.map((line) => line.match(/^\s*/)[0].length))

  return fixedLines.map((line) => {
    if (!line.trim()) {
      return ''
    }

    const currentIndent = line.match(/^\s*/)[0].length
    return `${targetIndent}${line.slice(Math.min(baseIndent, currentIndent))}`
  }).join('\n')
}

function replaceSnippetInCode(fullCode, originalSnippet, fixedSnippet) {
  const alignedReplacement = alignSnippetIndentation(fixedSnippet, originalSnippet)

  if (fullCode.includes(originalSnippet)) {
    return fullCode.replace(originalSnippet, alignedReplacement)
  }

  const fullLines = fullCode.split('\n')
  const snippetLines = originalSnippet.split('\n').map((line) => line.trimEnd())
  const snippetLength = snippetLines.length

  for (let index = 0; index <= fullLines.length - snippetLength; index += 1) {
    const windowLines = fullLines.slice(index, index + snippetLength).map((line) => line.trimEnd())

    if (windowLines.join('\n') === snippetLines.join('\n')) {
      return [
        ...fullLines.slice(0, index),
        ...alignedReplacement.split('\n'),
        ...fullLines.slice(index + snippetLength),
      ].join('\n')
    }
  }

  return fixedSnippet
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Devynix backend is running.',
    timestamp: new Date().toISOString(),
    configuredProviders: getConfiguredProviderNames(),
  })
})

app.post('/api/analyze', async (req, res) => {
  try {
    const { code, language } = req.body
    const validationError = validateCodePayload(code, language)

    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    const normalizedCode = normalizeLineEndings(code)
    const normalizedLanguage = language.trim()

    console.log(`\n/api/analyze | language=${normalizedLanguage} | lines=${normalizedCode.split('\n').length}`)

    const result = await analyzeWithAI(normalizedCode, normalizedLanguage)
    return res.json(result)
  } catch (error) {
    console.error('/api/analyze error:', error.message)
    return res.status(500).json({ error: 'AI analysis failed.', details: error.message })
  }
})

app.post('/api/fix', async (req, res) => {
  try {
    const { code, language, issue, snippet } = req.body
    const validationError = validateCodePayload(code, language, issue)

    if (validationError) {
      return res.status(400).json({ error: validationError })
    }

    const normalizedCode = normalizeLineEndings(code)
    const normalizedSnippet = normalizeLineEndings(snippet || '')

    console.log(`\n/api/fix | language=${language} | snippetLines=${normalizedSnippet ? normalizedSnippet.split('\n').length : 0}`)

    const { fixedSnippet, hasSnippet } = await fixWithAI(normalizedCode, language, issue, normalizedSnippet)

    if (!fixedSnippet?.trim()) {
      return res.status(500).json({ error: 'AI returned an empty fix. Please try again.' })
    }

    const finalCode = hasSnippet && normalizedSnippet.trim()
      ? replaceSnippetInCode(normalizedCode, normalizedSnippet, fixedSnippet)
      : fixedSnippet

    console.log(`  Fix complete | outputLines=${finalCode.split('\n').length}`)
    return res.json({ fixedCode: finalCode })
  } catch (error) {
    console.error('/api/fix error:', error.message)
    return res.status(500).json({ error: 'Failed to apply fix.', details: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`\nDevynix server -> http://localhost:${PORT}\n`)
})
