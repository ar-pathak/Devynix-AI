import React, { useState } from 'react'
import { LANGUAGES, getEditorFilename, getLanguageMeta } from '../config/languages'

export default function Navbar({ language, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const current = getLanguageMeta(language)

  return (
    <header className="shrink-0 relative z-50 flex items-center justify-between px-5 md:px-7 h-14 border-b border-border bg-base-2/80 backdrop-blur-xl">
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.5) 40%, rgba(0,212,255,0.5) 60%, transparent)' }}
      />

      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-lg border border-accent/30 bg-accent-dim" style={{ boxShadow: '0 0 12px rgba(0,212,255,0.15)' }} />
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 relative z-10" style={{ color: '#00D4FF' }}>
            <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="flex flex-col -gap-0.5">
          <span className="font-sans font-700 text-[15px] leading-tight text-text-primary tracking-tight">
            Dev<span style={{ color: '#00D4FF' }}>ynix</span>
          </span>
          <span className="font-mono text-[10px] text-text-muted leading-tight tracking-widest uppercase">
            AI Analyzer
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 font-mono text-xs text-text-muted">
        <span>~/workspace</span>
        <span style={{ color: '#00D4FF' }}>/</span>
        <span style={{ color: 'rgba(0,212,255,0.7)' }}>{getEditorFilename(language)}</span>
        <span className="w-1.5 h-3.5 ml-0.5 inline-block rounded-sm" style={{ background: '#00D4FF', animation: 'blink 1.2s step-end infinite' }} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-sm font-mono transition-all duration-200"
            style={{
              background: 'rgba(13, 17, 23, 0.8)',
              borderColor: isOpen ? 'rgba(0,212,255,0.4)' : 'rgba(30,45,61,1)',
              color: '#E8EDF5',
              boxShadow: isOpen ? '0 0 12px rgba(0,212,255,0.1)' : 'none',
            }}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: current.color, boxShadow: `0 0 6px ${current.color}80` }}
            />
            <span>{current.full}</span>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-text-muted" style={{ transform: isOpen ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }}>
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {isOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-50 animate-fade-in"
              style={{
                background: 'rgba(13, 17, 23, 0.95)',
                border: '1px solid rgba(30,45,61,1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.05)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {LANGUAGES.map((lang, index) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => { onLanguageChange(lang.value); setIsOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-mono text-left transition-colors"
                  style={{
                    color: lang.value === language ? '#00D4FF' : '#6B7D94',
                    background: lang.value === language ? 'rgba(0,212,255,0.07)' : 'transparent',
                    borderBottom: index < LANGUAGES.length - 1 ? '1px solid rgba(30,45,61,0.5)' : 'none',
                  }}
                  onMouseEnter={(event) => {
                    if (lang.value !== language) {
                      event.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    }
                    event.currentTarget.style.color = '#E8EDF5'
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.background = lang.value === language ? 'rgba(0,212,255,0.07)' : 'transparent'
                    event.currentTarget.style.color = lang.value === language ? '#00D4FF' : '#6B7D94'
                  }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: lang.color }} />
                  {lang.full}
                  {lang.value === language && (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 ml-auto" style={{ color: '#00D4FF' }}>
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono"
          style={{
            background: 'rgba(16, 217, 160, 0.08)',
            border: '1px solid rgba(16, 217, 160, 0.2)',
            color: '#10D9A0',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10D9A0', animation: 'pulseAccent 2.5s ease-in-out infinite' }} />
          <span>Online</span>
        </div>
      </div>

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </header>
  )
}
