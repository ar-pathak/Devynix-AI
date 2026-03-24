import React, { useState } from 'react'
import Navbar from '../features/home/components/Navbar'
import WorkspacePage from '../features/home/components/Workspacepage'

export default function App() {
  const [language, setLanguage] = useState('javascript')

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-base">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* App layout */}
      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* Main workspace fills remaining height */}
      <main className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
        <WorkspacePage language={language} />
      </main>

      {/* Footer status bar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-1.5 border-t border-border bg-surface/40 text-xs font-mono text-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Connected
          </span>
          <span>CodeSage AI v0.1.0</span>
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>{language}</span>
        </div>
      </div>
    </div>
  )
}