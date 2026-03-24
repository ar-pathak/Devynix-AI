import React, { useState } from 'react'
import CodeEditor from '../components/CodeEditor'
import OutputPanel from '../components/OutputPanel'
import AnalyzeButton from '../components/AnalyzeButton'
import { analyzeCode } from '../services/api'

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

export default function WorkspacePage({ language }) {
  const [code, setCode] = useState(DEFAULT_CODE.javascript)
  const [isLoading, setIsLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [error, setError] = useState(null)

  // Update default code when language changes (only if code is default/empty)
  const prevLanguage = React.useRef(language)
  React.useEffect(() => {
    if (prevLanguage.current !== language) {
      prevLanguage.current = language
      const defaultForLang = DEFAULT_CODE[language] || DEFAULT_CODE.default
      setCode(defaultForLang)
      setAnalysisData(null)
      setHasAnalyzed(false)
    }
  }, [language])

  const handleAnalyze = async () => {
    if (!code.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await analyzeCode(code, language)
      setAnalysisData(result)
      setHasAnalyzed(true)
    } catch {
      setError('Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // Yahan h-full add kiya gaya hai
    <div className="flex flex-col md:flex-row flex-1 min-h-0 w-full h-full">

      {/* LEFT — Code Editor Panel */}
      {/* md:h-auto ko md:h-full kar diya hai */}
      <div className="flex flex-col w-full md:w-1/2 h-[60vh] md:h-full border-b md:border-b-0 md:border-r border-border">
        {/* Panel header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface/30">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/60" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <span className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs font-mono text-text-secondary ml-1">
              main.{language === 'python' ? 'py' : language === 'typescript' ? 'ts' : language === 'rust' ? 'rs' : language === 'go' ? 'go' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'csharp' ? 'cs' : 'js'}
            </span>
          </div>
          <span className="text-xs font-mono text-muted">
            {code.split('\n').length} lines
          </span>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 min-h-0 relative">
          <CodeEditor value={code} onChange={setCode} language={language} />
        </div>

        {/* Analyze button footer */}
        <div className="shrink-0 p-3 border-t border-border bg-surface/20">
          {error && (
            <p className="text-red-400 text-xs font-mono mb-2 text-center animate-pulse">{error}</p>
          )}
          <AnalyzeButton onClick={handleAnalyze} isLoading={isLoading} disabled={!code.trim()} />
        </div>
      </div>

      {/* RIGHT — Output Panel */}
      {/* md:h-auto ko md:h-full kar diya hai */}
      <div className="flex flex-col w-full md:w-1/2 h-[40vh] md:h-full bg-base/40">
        <OutputPanel data={analysisData} isLoading={isLoading} hasAnalyzed={hasAnalyzed} />
      </div>
    </div>
  )
}