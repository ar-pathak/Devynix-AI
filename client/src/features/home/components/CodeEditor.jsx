import React, { Suspense, lazy, useRef, useEffect, useCallback } from 'react';
import { EditorFallback } from './Loader';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

const LANG_MAP = {
  javascript: 'javascript', typescript: 'typescript', python: 'python',
  rust: 'rust', go: 'go', java: 'java', cpp: 'cpp', csharp: 'csharp',
};

// ─── CSS injected once into Monaco's shadow DOM ───────────────────────────────
const DECORATION_CSS = `
  /* Bug lines — amber glow, like VS Code error highlight */
  .devynix-bug-line {
    background: rgba(245, 158, 11, 0.10) !important;
    border-left: 2px solid rgba(245, 158, 11, 0.8) !important;
  }
  .devynix-bug-gutter {
    background: rgba(245, 158, 11, 0.25) !important;
  }

  /* Improvement lines — cyan/blue, like Copilot suggestion */
  .devynix-improvement-line {
    background: rgba(0, 212, 255, 0.08) !important;
    border-left: 2px solid rgba(0, 212, 255, 0.7) !important;
  }
  .devynix-improvement-gutter {
    background: rgba(0, 212, 255, 0.2) !important;
  }

  /* Fixed lines — green, exactly like GitHub Copilot accepted diff */
  .devynix-fixed-line {
    background: rgba(16, 217, 160, 0.13) !important;
    border-left: 2px solid rgba(16, 217, 160, 0.9) !important;
  }
  .devynix-fixed-gutter {
    background: rgba(16, 217, 160, 0.3) !important;
  }

  /* Hover preview — softer tint */
  .devynix-hover-line {
    background: rgba(255, 255, 255, 0.04) !important;
    border-left: 2px solid rgba(255,255,255,0.15) !important;
  }
`;

function injectCSS() {
  if (document.getElementById('devynix-decoration-css')) return;
  const style = document.createElement('style');
  style.id = 'devynix-decoration-css';
  style.textContent = DECORATION_CSS;
  document.head.appendChild(style);
}

// ─── Find line range of a snippet inside full code ───────────────────────────
// Returns { startLine, endLine } (1-based) or null if not found
function findSnippetRange(fullCode, snippet) {
  if (!snippet || !snippet.trim()) return null;

  const codeLines    = fullCode.split('\n');
  const snippetLines = snippet.split('\n').map(l => l.trimEnd());
  const snippetLen   = snippetLines.length;

  for (let i = 0; i <= codeLines.length - snippetLen; i++) {
    const window = codeLines.slice(i, i + snippetLen).map(l => l.trimEnd());
    if (window.join('\n') === snippetLines.join('\n')) {
      return { startLine: i + 1, endLine: i + snippetLen };
    }
  }
  return null;
}

// ─── Build Monaco delta decorations array ────────────────────────────────────
function buildDecorations(monaco, code, decorationSpec) {
  const result = [];

  decorationSpec.forEach(({ snippet, kind }) => {
    const range = findSnippetRange(code, snippet);
    if (!range) return;

    let lineClass, gutterClass, hoverMessage;
    if (kind === 'bug') {
      lineClass   = 'devynix-bug-line';
      gutterClass = 'devynix-bug-gutter';
      hoverMessage = '⚠ Bug detected here';
    } else if (kind === 'improvement') {
      lineClass   = 'devynix-improvement-line';
      gutterClass = 'devynix-improvement-gutter';
      hoverMessage = '✦ Improvement suggested here';
    } else if (kind === 'fixed') {
      lineClass   = 'devynix-fixed-line';
      gutterClass = 'devynix-fixed-gutter';
      hoverMessage = '✓ Fixed by Devynix AI';
    } else {
      lineClass   = 'devynix-hover-line';
      gutterClass = '';
      hoverMessage = '';
    }

    result.push({
      range: new monaco.Range(range.startLine, 1, range.endLine, 1),
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
            ? 'rgba(16,217,160,0.9)'
            : 'rgba(255,255,255,0.1)',
          position: 4,
        },
        minimap: {
          color: kind === 'bug'
            ? 'rgba(245,158,11,0.5)'
            : kind === 'improvement'
            ? 'rgba(0,212,255,0.5)'
            : 'rgba(16,217,160,0.7)',
          position: 1,
        },
        ...(hoverMessage ? { hoverMessage: { value: hoverMessage } } : {}),
      },
    });
  });

  return result;
}

// ─── CodeEditor Component ─────────────────────────────────────────────────────
// Props:
//   value, onChange, language   — standard
//   decorationSpec              — Array<{ snippet: string, kind: 'bug'|'improvement'|'fixed'|'hover' }>
//   onEditorReady               — callback(editor, monaco) — optional
export default function CodeEditor({ value, onChange, language, decorationSpec = [], onEditorReady }) {
  const editorRef    = useRef(null);
  const monacoRef    = useRef(null);
  const decoIdsRef   = useRef([]); // current active decoration ids

  // Inject CSS once
  useEffect(() => { injectCSS(); }, []);

  // Apply / update decorations whenever spec or value changes
  const applyDecorations = useCallback(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    const newDecos = buildDecorations(monaco, value, decorationSpec);
    decoIdsRef.current = editor.deltaDecorations(decoIdsRef.current, newDecos);
  }, [value, decorationSpec]);

  useEffect(() => {
    applyDecorations();
  }, [applyDecorations]);

  const handleMount = (editor, monaco) => {
    editorRef.current  = editor;
    monacoRef.current  = monaco;
    applyDecorations();
    if (onEditorReady) onEditorReady(editor, monaco);
  };

  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<EditorFallback />}>
        <MonacoEditor
          height="100%"
          language={LANG_MAP[language] || 'javascript'}
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleMount}
          options={{
            minimap: { enabled: true },          // keep on so minimap colors show
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
            glyphMargin: true,                   // needed for gutter colour
            overviewRulerLanes: 3,
          }}
          loading={<EditorFallback />}
        />
      </Suspense>
    </div>
  );
}