import React, { useState } from 'react'
import Navbar from '../features/home/components/Navbar'
import WorkspacePage from '../features/home/components/Workspacepage'

export default function App() {
  const [language, setLanguage] = useState('javascript')

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: '#080C10', fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {/* ── Background layers ── */}

      {/* Deep radial glow — top left */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-20%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 65%)',
          zIndex: 0,
        }}
      />
      {/* Deep radial glow — bottom right */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-20%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(16,217,160,0.03) 0%, transparent 65%)',
          zIndex: 0,
        }}
      />

      {/* Fine grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 0,
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
          zIndex: 0,
        }}
      />

      {/* ── App Layout ── */}
      <div className="relative flex flex-col h-full" style={{ zIndex: 1 }}>
        <Navbar language={language} onLanguageChange={setLanguage} />

        <main className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
          <WorkspacePage language={language} />
        </main>

        {/* Status bar */}
        <div
          className="shrink-0 flex items-center justify-between px-5 py-1.5 border-t"
          style={{
            borderColor: 'rgba(30,45,61,0.8)',
            background: 'rgba(8,12,16,0.9)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-4 font-mono text-[10px]" style={{ color: 'rgba(107,125,148,0.6)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10D9A0', boxShadow: '0 0 4px rgba(16,217,160,0.7)' }} />
              <span style={{ color: 'rgba(16,217,160,0.7)' }}>Connected</span>
            </span>
            <span>Devynix AI v0.2.0</span>
            <span style={{ color: 'rgba(0,212,255,0.4)' }}>claude-sonnet-4</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px]" style={{ color: 'rgba(107,125,148,0.4)' }}>
            <span>UTF-8</span>
            <span>LF</span>
            <span style={{ color: 'rgba(0,212,255,0.5)' }}>{language.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}