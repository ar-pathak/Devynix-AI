import React, { useEffect, useMemo, useRef, useState } from 'react'
import CodeEditor from '../components/CodeEditor'
import OutputPanel from '../components/OutputPanel'
import AnalyzeButton from '../components/AnalyzeButton'
import { analyzeCode } from '../services/api'
import { getEditorFilename } from '../config/languages'

const DEFAULT_CODE = {
  javascript: `// Paste or write your code here
async function fetchUser(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Call the function
fetchUser(42).then(user => {
  console.log('User:', user);
});`,
  python: `# Paste or write your code here
import requests

def fetch_user(user_id):
    try:
        response = requests.get(f"/api/users/{user_id}")
        response.raise_for_status()
        return response.json()
    except:
        pass

result = fetch_user(42)
print(result)`,
  default: `// Paste or write your code here\n// Select a language from the navbar\n`,
}

function sanitise(raw) {
  const normalizeItems = (items) => !Array.isArray(items) ? [] : items.map((item) => (
    typeof item === 'string'
      ? { description: item, snippet: '', replacement: '' }
      : {
          description: item.description || '',
          snippet: item.snippet || '',
          replacement: item.replacement || item.fix || item.fixedSnippet || item.improvedSnippet || '',
        }
  ))

  return {
    explanation: raw?.explanation || 'No explanation provided.',
    bugs: normalizeItems(raw?.bugs),
    improvements: normalizeItems(raw?.improvements),
  }
}

function buildDecorationSpec(analysisData, fixedSnippets, hoverSnippet) {
  const spec = []

  if (analysisData) {
    analysisData.bugs?.forEach((bug) => {
      if (bug.snippet) {
        spec.push({ snippet: bug.snippet, kind: 'bug' })
      }
    })

    analysisData.improvements?.forEach((improvement) => {
      if (improvement.snippet) {
        spec.push({ snippet: improvement.snippet, kind: 'improvement' })
      }
    })
  }

  fixedSnippets.forEach((fixedItem) => {
    if (fixedItem) {
      spec.push({ ...fixedItem, kind: 'fixed' })
    }
  })

  if (hoverSnippet) {
    spec.push({ snippet: hoverSnippet, kind: 'hover' })
  }

  return spec
}

function alignReplacementIndentation(replacementSnippet, originalSnippet) {
  const replacementLines = replacementSnippet.split('\n')
  const originalLines = originalSnippet.split('\n')
  const targetIndent = originalLines[0]?.match(/^\s*/)?.[0] || ''
  const nonEmptyReplacementLines = replacementLines.filter((line) => line.trim())

  if (!nonEmptyReplacementLines.length) {
    return replacementSnippet
  }

  const baseIndent = Math.min(...nonEmptyReplacementLines.map((line) => line.match(/^\s*/)[0].length))

  return replacementLines.map((line) => {
    if (!line.trim()) {
      return ''
    }

    const currentIndent = line.match(/^\s*/)[0].length
    return `${targetIndent}${line.slice(Math.min(baseIndent, currentIndent))}`
  }).join('\n')
}

function replaceSnippetInCode(fullCode, originalSnippet, replacementSnippet) {
  if (!originalSnippet?.trim() || !replacementSnippet?.trim()) {
    return null
  }

  const alignedReplacement = alignReplacementIndentation(replacementSnippet, originalSnippet)

  if (fullCode.includes(originalSnippet)) {
      return {
        updatedCode: fullCode.replace(originalSnippet, alignedReplacement),
        appliedSnippet: alignedReplacement,
        appliedRange: {
          startLine: fullCode.slice(0, fullCode.indexOf(originalSnippet)).split('\n').length,
          endLine: fullCode.slice(0, fullCode.indexOf(originalSnippet)).split('\n').length + alignedReplacement.split('\n').length - 1,
        },
      }
  }

  const fullLines = fullCode.split('\n')
  const snippetLines = originalSnippet.split('\n').map((line) => line.trimEnd())
  const snippetLength = snippetLines.length

  for (let index = 0; index <= fullLines.length - snippetLength; index += 1) {
    const windowLines = fullLines.slice(index, index + snippetLength).map((line) => line.trimEnd())

    if (windowLines.join('\n') === snippetLines.join('\n')) {
      return {
        updatedCode: [
          ...fullLines.slice(0, index),
          ...alignedReplacement.split('\n'),
          ...fullLines.slice(index + snippetLength),
        ].join('\n'),
        appliedSnippet: alignedReplacement,
        appliedRange: {
          startLine: index + 1,
          endLine: index + alignedReplacement.split('\n').length,
        },
      }
    }
  }

  return null
}

export default function WorkspacePage({ language }) {
  const [code, setCode] = useState(DEFAULT_CODE.javascript)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysis] = useState(null)
  const [hasAnalyzed, setAnalyzed] = useState(false)
  const [error, setError] = useState(null)
  const [fixingIssue, setFixingIssue] = useState(null)
  const [analysisVersion, setAnalysisVersion] = useState(0)
  const [fixNotice, setFixNotice] = useState(null)
  const [fixedSnippets, setFixedSnippets] = useState([])
  const [hoverSnippet, setHoverSnippet] = useState(null)
  const [focusRange, setFocusRange] = useState(null)

  const activeRequestRef = useRef(null)
  const fixedSnippetTimeoutsRef = useRef([])
  const prevLang = useRef(language)
  const decorationSpec = useMemo(
    () => buildDecorationSpec(analysisData, fixedSnippets, hoverSnippet),
    [analysisData, fixedSnippets, hoverSnippet],
  )

  useEffect(() => {
    return () => {
      activeRequestRef.current?.abort()
      fixedSnippetTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [])

  useEffect(() => {
    if (prevLang.current === language) return

    prevLang.current = language
    activeRequestRef.current?.abort()
    fixedSnippetTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    fixedSnippetTimeoutsRef.current = []

    setCode(DEFAULT_CODE[language] || DEFAULT_CODE.default)
    setAnalysis(null)
    setAnalyzed(false)
    setError(null)
    setFixingIssue(null)
    setFixedSnippets([])
    setHoverSnippet(null)
    setFixNotice(null)
    setFocusRange(null)
  }, [language])

  const runAnalysis = async (nextCode) => {
    const controller = new AbortController()
    activeRequestRef.current?.abort()
    activeRequestRef.current = controller

    setIsLoading(true)
    setError(null)

    try {
      const raw = await analyzeCode(nextCode, language, { signal: controller.signal })

      if (activeRequestRef.current !== controller) {
        return null
      }

      const nextAnalysis = sanitise(raw)
      setAnalysis(nextAnalysis)
      setAnalyzed(true)
      setAnalysisVersion((version) => version + 1)
      return nextAnalysis
    } catch (err) {
      if (controller.signal.aborted) {
        return null
      }

      setAnalysis(null)
      setAnalyzed(false)
      setError(err?.message || 'Analysis failed. Please try again.')
      return null
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null
      }

      setIsLoading(false)
    }
  }

  const flashAppliedSnippet = (appliedChange) => {
    if (!appliedChange?.snippet && !appliedChange?.range) {
      return
    }

    const highlightId = `${Date.now()}-${Math.random()}`
    const highlight = { ...appliedChange, id: highlightId }

    setFixedSnippets((prev) => [...prev, highlight])

    const timeoutId = window.setTimeout(() => {
      setFixedSnippets((prev) => prev.filter((existingHighlight) => existingHighlight.id !== highlightId))
      fixedSnippetTimeoutsRef.current = fixedSnippetTimeoutsRef.current.filter((id) => id !== timeoutId)
    }, 6000)

    fixedSnippetTimeoutsRef.current.push(timeoutId)
  }

  const handleAnalyze = async () => {
    if (!code.trim()) return

    setFixedSnippets([])
    setFixNotice(null)
    setFocusRange(null)
    await runAnalysis(code)
  }

  const handleApplySuggestion = (item, type, index) => {
    const description = item?.description || ''
    const snippet = item?.snippet || ''
    const replacement = item?.replacement || ''
    const collectionKey = type === 'bug' ? 'bugs' : 'improvements'

    setFixingIssue({ type, index, text: description })
    setError(null)
    setFixNotice(null)

    try {
      if (!replacement.trim()) {
        throw new Error('No ready-to-apply suggestion came back for this item. Please run Analyze again.')
      }

      const replacementResult = replaceSnippetInCode(code, snippet, replacement)

      if (!replacementResult) {
        throw new Error('Could not match this suggestion against the current editor content. Please run Analyze again.')
      }

      setCode(replacementResult.updatedCode)
      setHoverSnippet(null)
      setFocusRange({
        ...replacementResult.appliedRange,
        id: `${type}-${index}-${Date.now()}`,
      })
      flashAppliedSnippet({
        snippet: replacementResult.appliedSnippet,
        range: replacementResult.appliedRange,
      })

      setAnalysis((current) => {
        if (!current) {
          return current
        }

        return {
          ...current,
          [collectionKey]: current[collectionKey].filter((_, currentIndex) => currentIndex !== index),
        }
      })

      setFixNotice({
        id: `${type}-${index}-${Date.now()}`,
        type: 'success',
        message: `${type === 'bug' ? 'Fix' : 'Improvement'} applied locally. Run Analyze again to refresh the remaining suggestions.`,
      })
    } catch (err) {
      const message = err?.message || 'Failed to apply the selected suggestion.'
      setError(message)
      setFixNotice({
        id: `${type}-${index}-${Date.now()}`,
        type: 'error',
        message,
      })
    } finally {
      setFixingIssue(null)
    }
  }

  return (
    <div className="flex flex-col md:flex-row flex-1 min-h-0 w-full h-full">
      <div className="flex flex-col w-full md:w-1/2 h-[60vh] md:h-full border-b md:border-b-0 md:border-r border-border">
        <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface/30">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs font-mono text-text-secondary ml-1">{getEditorFilename(language)}</span>
          </div>

          {analysisData && (
            <div className="hidden sm:flex items-center gap-3 font-mono text-[9px]" style={{ color: 'rgba(107,125,148,0.7)' }}>
              {analysisData.bugs?.some((bug) => bug.snippet) && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(245,158,11,0.75)', boxShadow: '0 0 4px rgba(245,158,11,0.4)' }} />
                  Bug
                </span>
              )}

              {analysisData.improvements?.some((improvement) => improvement.snippet) && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(0,212,255,0.75)', boxShadow: '0 0 4px rgba(0,212,255,0.4)' }} />
                  Improve
                </span>
              )}

              {fixedSnippets.length > 0 && (
                <span className="flex items-center gap-1.5" style={{ color: '#10D9A0' }}>
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(16,217,160,0.85)', boxShadow: '0 0 4px rgba(16,217,160,0.5)', animation: 'glowPulse 1.5s ease-in-out infinite' }} />
                  Applied
                </span>
              )}
            </div>
          )}

          <span className="text-xs font-mono text-muted">{code.split('\n').length} lines</span>
        </div>

        <div className="flex-1 min-h-0 relative">
          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            decorationSpec={decorationSpec}
            focusRange={focusRange}
          />
        </div>

        <div className="shrink-0 p-3 border-t border-border bg-surface/20">
          {error && (
            <div
              className="flex items-start gap-2 mb-2 px-3 py-2 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#EF4444' }}>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <p className="text-red-400 text-xs font-mono leading-relaxed">{error}</p>
            </div>
          )}

          <AnalyzeButton
            onClick={handleAnalyze}
            isLoading={isLoading}
            disabled={!code.trim() || fixingIssue !== null}
          />
        </div>
      </div>

      <div className="flex flex-col w-full md:w-1/2 h-[40vh] md:h-full bg-base/40">
        <OutputPanel
          key={`${language}-${analysisVersion}-${hasAnalyzed ? 'ready' : 'idle'}`}
          data={analysisData}
          isLoading={isLoading}
          hasAnalyzed={hasAnalyzed}
          onApplySuggestion={handleApplySuggestion}
          fixingIssue={fixingIssue}
          onHoverSnippet={setHoverSnippet}
          fixNotice={fixNotice}
        />
      </div>
    </div>
  )
}
