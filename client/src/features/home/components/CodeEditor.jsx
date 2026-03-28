import React, { Suspense, lazy, useRef, useEffect, useCallback } from 'react'
import { EditorFallback } from './Loader'

const MonacoEditor = lazy(() => import('@monaco-editor/react'))

const LANG_MAP = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  rust: 'rust',
  go: 'go',
  java: 'java',
  cpp: 'cpp',
  csharp: 'csharp',
}

const DECORATION_CSS = `
  .devynix-bug-line {
    background: rgba(245, 158, 11, 0.10) !important;
    border-left: 2px solid rgba(245, 158, 11, 0.8) !important;
  }
  .devynix-bug-gutter {
    background: rgba(245, 158, 11, 0.25) !important;
  }

  .devynix-improvement-line {
    background: rgba(0, 212, 255, 0.08) !important;
    border-left: 2px solid rgba(0, 212, 255, 0.7) !important;
  }
  .devynix-improvement-gutter {
    background: rgba(0, 212, 255, 0.2) !important;
  }

  .devynix-fixed-line {
    background: linear-gradient(90deg, rgba(16, 217, 160, 0.24), rgba(16, 217, 160, 0.12)) !important;
    border-left: 3px solid rgba(16, 217, 160, 1) !important;
    box-shadow: inset 0 0 0 1px rgba(16, 217, 160, 0.18);
  }
  .devynix-fixed-gutter {
    background: rgba(16, 217, 160, 0.45) !important;
  }

  .devynix-hover-line {
    background: rgba(255, 255, 255, 0.04) !important;
    border-left: 2px solid rgba(255,255,255,0.15) !important;
  }
`

function injectCSS() {
  if (document.getElementById('devynix-decoration-css')) return

  const style = document.createElement('style')
  style.id = 'devynix-decoration-css'
  style.textContent = DECORATION_CSS
  document.head.appendChild(style)
}

function findSnippetRange(fullCode, snippet) {
  if (!snippet || !snippet.trim()) return null

  const codeLines = fullCode.split('\n')
  const snippetLines = snippet.split('\n').map((line) => line.trimEnd())
  const snippetLength = snippetLines.length

  for (let index = 0; index <= codeLines.length - snippetLength; index += 1) {
    const windowLines = codeLines.slice(index, index + snippetLength).map((line) => line.trimEnd())

    if (windowLines.join('\n') === snippetLines.join('\n')) {
      return { startLine: index + 1, endLine: index + snippetLength }
    }
  }

  return null
}

function resolveDecorationRange(monaco, code, decoration) {
  if (decoration.range?.startLine && decoration.range?.endLine) {
    return new monaco.Range(decoration.range.startLine, 1, decoration.range.endLine, 1)
  }

  const snippetRange = findSnippetRange(code, decoration.snippet)

  if (!snippetRange) {
    return null
  }

  return new monaco.Range(snippetRange.startLine, 1, snippetRange.endLine, 1)
}

function buildDecorations(monaco, code, decorationSpec) {
  const result = []

  decorationSpec.forEach((decoration) => {
    const { kind } = decoration
    const range = resolveDecorationRange(monaco, code, decoration)

    if (!range) return

    let lineClass
    let gutterClass
    let hoverMessage

    if (kind === 'bug') {
      lineClass = 'devynix-bug-line'
      gutterClass = 'devynix-bug-gutter'
      hoverMessage = 'Bug detected here'
    } else if (kind === 'improvement') {
      lineClass = 'devynix-improvement-line'
      gutterClass = 'devynix-improvement-gutter'
      hoverMessage = 'Improvement suggested here'
    } else if (kind === 'fixed') {
      lineClass = 'devynix-fixed-line'
      gutterClass = 'devynix-fixed-gutter'
      hoverMessage = 'Applied in editor'
    } else {
      lineClass = 'devynix-hover-line'
      gutterClass = ''
      hoverMessage = ''
    }

    result.push({
      range,
      options: {
        isWholeLine: true,
        className: lineClass,
        glyphMarginClassName: gutterClass,
        marginClassName: gutterClass,
        overviewRuler: {
          color: kind === 'bug'
            ? 'rgba(245,158,11,0.7)'
            : kind === 'improvement'
            ? 'rgba(0,212,255,0.7)'
            : kind === 'fixed'
            ? 'rgba(16,217,160,0.95)'
            : 'rgba(255,255,255,0.1)',
          position: 4,
        },
        minimap: {
          color: kind === 'bug'
            ? 'rgba(245,158,11,0.5)'
            : kind === 'improvement'
            ? 'rgba(0,212,255,0.5)'
            : kind === 'fixed'
            ? 'rgba(16,217,160,0.85)'
            : 'rgba(255,255,255,0.15)',
          position: 1,
        },
        ...(hoverMessage ? { hoverMessage: { value: hoverMessage } } : {}),
      },
    })
  })

  return result
}

export default function CodeEditor({ value, onChange, language, decorationSpec = [], onEditorReady }) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const decoIdsRef = useRef([])

  useEffect(() => { injectCSS() }, [])

  const applyDecorations = useCallback(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current

    if (!editor || !monaco) return

    const newDecorations = buildDecorations(monaco, value, decorationSpec)
    decoIdsRef.current = editor.deltaDecorations(decoIdsRef.current, newDecorations)
  }, [value, decorationSpec])

  useEffect(() => {
    applyDecorations()
  }, [applyDecorations])

  const handleMount = (editor, monaco) => {
    editorRef.current = editor
    monacoRef.current = monaco
    applyDecorations()

    if (onEditorReady) {
      onEditorReady(editor, monaco)
    }
  }

  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<EditorFallback />}>
        <MonacoEditor
          height="100%"
          language={LANG_MAP[language] || 'javascript'}
          theme="vs-dark"
          value={value}
          onChange={(nextValue) => onChange(nextValue || '')}
          onMount={handleMount}
          options={{
            minimap: { enabled: true },
            minimapScale: 2,
            fontSize: 13,
            lineHeight: 22,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 20, bottom: 20 },
            fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
            fontLigatures: true,
            renderLineHighlight: 'gutter',
            cursorBlinking: 'phase',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            glyphMargin: true,
            overviewRulerLanes: 3,
          }}
          loading={<EditorFallback />}
        />
      </Suspense>
    </div>
  )
}
