import React, { Suspense, lazy } from 'react';
import { EditorFallback } from './Loader';

// Lazy load Monaco Editor for fast initial page load
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

export default function CodeEditor({ value, onChange, language }) {
  // Ensure the language matches Monaco's supported language IDs
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
            minimap: { enabled: false }, // Hides minimap for cleaner look
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
          loading={<EditorFallback />}
        />
      </Suspense>
    </div>
  );
}