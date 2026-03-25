import React, { Suspense, lazy } from 'react';
import { EditorFallback } from './Loader';

// Lazy load Monaco Editor for fast initial page load
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

export default function CodeEditor({ value, onChange, language }) {
  const getMonacoLanguage = (lang) => {
    const map = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      rust: 'rust',
      go: 'go',
      java: 'java',
      cpp: 'cpp',
      csharp: 'csharp'
    };
    return map[lang] || 'javascript';
  };

  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<EditorFallback />}>
        <MonacoEditor
          height="100%"
          language={getMonacoLanguage(language)}
          theme="vs-dark"
          value={value}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: false },
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
          }}
          loading={<EditorFallback />}
        />
      </Suspense>
    </div>
  );
}