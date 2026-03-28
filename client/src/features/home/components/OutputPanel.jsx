import React, { useEffect, useRef, useState } from 'react'
import Loader from './Loader'

const TABS = [
  {
    id: 'explanation',
    label: 'Explanation',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
    ),
    color: '#00D4FF',
    dimColor: 'rgba(0,212,255,0.08)',
    borderColor: 'rgba(0,212,255,0.25)',
  },
  {
    id: 'bugs',
    label: 'Issues',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
      </svg>
    ),
    color: '#F59E0B',
    dimColor: 'rgba(245,158,11,0.08)',
    borderColor: 'rgba(245,158,11,0.25)',
  },
  {
    id: 'improvements',
    label: 'Improve',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
      </svg>
    ),
    color: '#10D9A0',
    dimColor: 'rgba(16,217,160,0.08)',
    borderColor: 'rgba(16,217,160,0.25)',
  },
]

function Toast({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs"
          style={{
            background: toast.type === 'success'
              ? 'rgba(16,217,160,0.15)'
              : toast.type === 'error'
              ? 'rgba(239,68,68,0.15)'
              : 'rgba(0,212,255,0.12)',
            border: `1px solid ${toast.type === 'success' ? 'rgba(16,217,160,0.4)' : toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(0,212,255,0.3)'}`,
            color: toast.type === 'success' ? '#10D9A0' : toast.type === 'error' ? '#EF4444' : '#00D4FF',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            animation: 'slideInRight 0.3s ease-out',
            pointerEvents: 'none',
          }}
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}

function getPreferredTab(data) {
  if (data?.bugs?.length > 0) {
    return 'bugs'
  }

  if (data?.improvements?.length > 0) {
    return 'improvements'
  }

  return 'explanation'
}

function TypewriterText({ text, speed = 8 }) {
  const [displayedLength, setDisplayedLength] = useState(0)

  useEffect(() => {
    if (!text) return undefined

    let timeoutId

    const tick = () => {
      setDisplayedLength((currentLength) => {
        const nextLength = Math.min(text.length, currentLength + speed)

        if (nextLength < text.length) {
          timeoutId = window.setTimeout(tick, 16)
        }

        return nextLength
      })
    }

    timeoutId = window.setTimeout(tick, 16)

    return () => window.clearTimeout(timeoutId)
  }, [text, speed])

  const displayed = text.slice(0, displayedLength)
  const done = displayedLength >= text.length

  return (
    <span>
      {displayed}
      {!done && (
        <span
          className="inline-block w-1.5 h-4 ml-0.5 align-text-bottom"
          style={{ background: '#00D4FF', animation: 'blink 0.8s step-end infinite' }}
        />
      )}
    </span>
  )
}

function ActionButton({ label, loadingLabel, isActive, isDisabled, onClick, color, dimColor, borderColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all duration-200"
      style={{
        background: isActive ? 'transparent' : dimColor,
        border: `1px solid ${isActive ? 'transparent' : borderColor}`,
        color: isActive ? 'rgba(107,125,148,0.6)' : color,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled && !isActive ? 0.45 : 1,
        minWidth: '72px',
        justifyContent: 'center',
      }}
    >
      {isActive ? (
        <span className="flex items-center gap-1.5">
          <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {loadingLabel}
        </span>
      ) : label}
    </button>
  )
}

function SnippetBlock({ label, value, accent, border }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-mono tracking-widest uppercase" style={{ color: accent }}>
        {label}
      </div>
      <pre
        className="text-[10px] leading-relaxed rounded-md px-3 py-2 overflow-x-auto"
        style={{
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${border}`,
          color: accent,
          fontFamily: "'IBM Plex Mono', monospace",
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {value}
      </pre>
    </div>
  )
}

function SuggestionCard({ item, index, type, fixingIssue, onApplySuggestion, onHoverSnippet }) {
  const isBug = type === 'bug'
  const isApplyingThis = fixingIssue?.type === type && fixingIssue?.index === index
  const anyApplyRunning = fixingIssue !== null
  const description = item.description || ''
  const snippet = item.snippet || ''
  const replacement = item.replacement || ''

  return (
    <div
      className="flex flex-col gap-3 p-3 rounded-lg text-sm font-mono"
      style={{
        background: isApplyingThis ? 'rgba(0,212,255,0.06)' : isBug ? 'rgba(245,158,11,0.05)' : 'rgba(16,217,160,0.04)',
        border: `1px solid ${isApplyingThis ? 'rgba(0,212,255,0.25)' : isBug ? 'rgba(245,158,11,0.15)' : 'rgba(16,217,160,0.12)'}`,
        color: isBug ? '#C4A882' : '#9BBFB0',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={() => onHoverSnippet(snippet)}
      onMouseLeave={() => onHoverSnippet(null)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <span
            className="flex-shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center rounded text-[9px] font-bold"
            style={{ background: isBug ? 'rgba(245,158,11,0.15)' : 'rgba(16,217,160,0.15)', color: isBug ? '#F59E0B' : '#10D9A0' }}
          >
            {index + 1}
          </span>
          <span className="leading-relaxed">{description}</span>
        </div>

        <ActionButton
          label={isBug ? 'AUTO FIX' : 'APPLY'}
          loadingLabel={isBug ? 'FIXING' : 'APPLYING'}
          isActive={isApplyingThis}
          isDisabled={anyApplyRunning || !replacement.trim()}
          onClick={() => onApplySuggestion(item, type, index)}
          color={isBug ? '#F59E0B' : '#10D9A0'}
          dimColor={isBug ? 'rgba(245,158,11,0.1)' : 'rgba(16,217,160,0.1)'}
          borderColor={isBug ? 'rgba(245,158,11,0.3)' : 'rgba(16,217,160,0.3)'}
        />
      </div>

      {snippet ? (
        <SnippetBlock
          label="Current snippet"
          value={snippet}
          accent={isBug ? 'rgba(245,158,11,0.65)' : 'rgba(16,217,160,0.65)'}
          border={isBug ? 'rgba(245,158,11,0.18)' : 'rgba(16,217,160,0.18)'}
        />
      ) : null}

      {replacement ? (
        <SnippetBlock
          label={isBug ? 'Ready fix' : 'Ready improvement'}
          value={replacement}
          accent="rgba(0,212,255,0.72)"
          border="rgba(0,212,255,0.22)"
        />
      ) : null}

      {!replacement.trim() && (
        <div className="text-[10px] font-mono" style={{ color: 'rgba(107,125,148,0.7)' }}>
          No inline replacement was returned for this item yet.
        </div>
      )}
    </div>
  )
}

export default function OutputPanel({ data, isLoading, hasAnalyzed, onApplySuggestion, fixingIssue, onHoverSnippet, fixNotice }) {
  const [activeTab, setActiveTab] = useState(() => getPreferredTab(data))
  const [toasts, setToasts] = useState([])
  const toastIdRef = useRef(0)
  const lastNoticeIdRef = useRef(null)

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = ++toastIdRef.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), duration)
  }

  useEffect(() => {
    if (!fixNotice || lastNoticeIdRef.current === fixNotice.id) {
      return
    }

    lastNoticeIdRef.current = fixNotice.id
    addToast(fixNotice.message, fixNotice.type)
  }, [fixNotice])

  const isBusy = fixingIssue !== null || isLoading

  return (
    <>
      <Toast toasts={toasts} />

      <div className="flex flex-col h-full overflow-hidden" style={{ background: 'rgba(8,12,16,0.6)' }}>
        <div
          className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b"
          style={{ borderColor: 'rgba(30,45,61,0.8)', background: 'rgba(13,17,23,0.5)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00D4FF', boxShadow: '0 0 6px rgba(0,212,255,0.7)', animation: 'glowPulse 2s ease-in-out infinite' }} />
            <span className="text-[11px] font-mono tracking-widest uppercase" style={{ color: 'rgba(107,125,148,0.8)' }}>AI Output</span>
          </div>

          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded transition-all duration-300"
            style={{
              color: isLoading
                ? '#F59E0B'
                : hasAnalyzed
                ? '#10D9A0'
                : 'rgba(107,125,148,0.6)',
              background: isLoading
                ? 'rgba(245,158,11,0.08)'
                : hasAnalyzed
                ? 'rgba(16,217,160,0.08)'
                : 'transparent',
              border: isLoading
                ? '1px solid rgba(245,158,11,0.2)'
                : hasAnalyzed
                ? '1px solid rgba(16,217,160,0.2)'
                : '1px solid transparent',
            }}
          >
            {isLoading ? 'PROCESSING' : hasAnalyzed ? 'READY' : 'STANDBY'}
          </span>
        </div>

        <div
          className="shrink-0 flex gap-1 px-3 py-2 border-b"
          style={{ borderColor: 'rgba(30,45,61,0.5)', background: 'rgba(13,17,23,0.3)' }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            const isDisabled = !hasAnalyzed || isBusy

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200"
                style={{
                  background: isActive ? tab.dimColor : 'transparent',
                  border: `1px solid ${isActive ? tab.borderColor : 'transparent'}`,
                  color: isActive ? tab.color : isDisabled ? 'rgba(61,79,99,0.6)' : '#6B7D94',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled && !isActive ? 0.5 : 1,
                }}
              >
                <span style={{ color: isActive ? tab.color : 'inherit' }}>{tab.icon}</span>
                {tab.label}
                {tab.id === 'bugs' && hasAnalyzed && data?.bugs?.length > 0 && (
                  <span className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>
                    {data.bugs.length}
                  </span>
                )}
                {tab.id === 'improvements' && hasAnalyzed && data?.improvements?.length > 0 && (
                  <span className="ml-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: 'rgba(16,217,160,0.2)', color: '#10D9A0' }}>
                    {data.improvements.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex-1 overflow-auto p-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(30,45,61,1) transparent' }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader size="lg" text="Running analysis" />
              <div className="font-mono text-xs text-center space-y-1" style={{ color: 'rgba(107,125,148,0.5)' }}>
                <div>Generating review comments and ready-to-apply replacements...</div>
              </div>
            </div>
          ) : hasAnalyzed && data ? (
            <div className="animate-fade-in space-y-3">
              {activeTab === 'explanation' && (
                <div
                  className="p-4 rounded-xl text-sm font-mono leading-relaxed"
                  style={{
                    background: 'rgba(0,212,255,0.03)',
                    border: '1px solid rgba(0,212,255,0.1)',
                    color: '#B8C5D6',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
                    <span className="text-[10px] tracking-widest uppercase font-medium" style={{ color: 'rgba(0,212,255,0.5)' }}>// explanation</span>
                  </div>
                  <TypewriterText key={data.explanation} text={data.explanation} />
                </div>
              )}

              {activeTab === 'bugs' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono tracking-widest uppercase mb-3" style={{ color: 'rgba(245,158,11,0.5)' }}>
                    // {data.bugs?.length > 0 ? `${data.bugs.length} issue${data.bugs.length !== 1 ? 's' : ''} found` : 'no issues found'}
                  </div>

                  {data.bugs?.length > 0 ? (
                    data.bugs.map((bug, index) => (
                      <SuggestionCard
                        key={`bug-${index}-${bug.description}`}
                        item={bug}
                        index={index}
                        type="bug"
                        fixingIssue={fixingIssue}
                        onApplySuggestion={onApplySuggestion}
                        onHoverSnippet={onHoverSnippet}
                      />
                    ))
                  ) : (
                    <div
                      className="flex items-center gap-3 p-4 rounded-xl text-sm font-mono"
                      style={{ background: 'rgba(16,217,160,0.05)', border: '1px solid rgba(16,217,160,0.2)', color: '#10D9A0' }}
                    >
                      All clear - no bugs detected
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'improvements' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono tracking-widest uppercase mb-3" style={{ color: 'rgba(16,217,160,0.5)' }}>
                    // {data.improvements?.length > 0 ? `${data.improvements.length} suggestion${data.improvements.length !== 1 ? 's' : ''}` : 'fully optimized'}
                  </div>

                  {data.improvements?.length > 0 ? (
                    data.improvements.map((improvement, index) => (
                      <SuggestionCard
                        key={`improvement-${index}-${improvement.description}`}
                        item={improvement}
                        index={index}
                        type="improvement"
                        fixingIssue={fixingIssue}
                        onApplySuggestion={onApplySuggestion}
                        onHoverSnippet={onHoverSnippet}
                      />
                    ))
                  ) : (
                    <div
                      className="flex items-center gap-3 p-4 rounded-xl text-sm font-mono"
                      style={{ background: 'rgba(16,217,160,0.05)', border: '1px solid rgba(16,217,160,0.2)', color: '#10D9A0' }}
                    >
                      Code is fully optimized!
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-5 animate-slide-up">
              <div
                className="relative flex flex-col items-center gap-3 p-6 rounded-2xl"
                style={{
                  background: 'rgba(13,17,23,0.5)',
                  border: '1px solid rgba(30,45,61,0.8)',
                }}
              >
                <span className="absolute top-2 left-2 w-4 h-4 border-t border-l rounded-tl-lg" style={{ borderColor: 'rgba(0,212,255,0.2)' }} />
                <span className="absolute top-2 right-2 w-4 h-4 border-t border-r rounded-tr-lg" style={{ borderColor: 'rgba(0,212,255,0.2)' }} />
                <span className="absolute bottom-2 left-2 w-4 h-4 border-b border-l rounded-bl-lg" style={{ borderColor: 'rgba(0,212,255,0.2)' }} />
                <span className="absolute bottom-2 right-2 w-4 h-4 border-b border-r rounded-br-lg" style={{ borderColor: 'rgba(0,212,255,0.2)' }} />

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6" style={{ color: 'rgba(0,212,255,0.5)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>

                <div className="text-center space-y-1.5">
                  <p className="text-sm font-mono font-medium" style={{ color: 'rgba(232,237,245,0.6)' }}>
                    Awaiting analysis
                  </p>
                  <p className="text-xs font-mono" style={{ color: 'rgba(107,125,148,0.5)' }}>
                    Run Analyze once to get explanations, issues, and ready-to-apply suggestions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <style>{`
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    </>
  )
}
