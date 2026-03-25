import React from 'react'
import Loader from './Loader'

export default function AnalyzeButton({ onClick, isLoading, disabled }) {
  const isDisabled = isLoading || disabled

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="relative flex items-center justify-center gap-2.5 w-full px-5 py-2.5 rounded-xl font-sans font-600 text-sm transition-all duration-300 overflow-hidden"
      style={
        isDisabled
          ? {
              background: 'rgba(0, 212, 255, 0.06)',
              border: '1px solid rgba(0, 212, 255, 0.1)',
              color: 'rgba(0, 212, 255, 0.3)',
              cursor: 'not-allowed',
            }
          : {
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,184,224,0.1) 100%)',
              border: '1px solid rgba(0,212,255,0.4)',
              color: '#00D4FF',
              boxShadow: '0 0 20px rgba(0,212,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
              animation: 'borderGlow 3s ease-in-out infinite',
            }
      }
      onMouseEnter={e => {
        if (!isDisabled) {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,212,255,0.22) 0%, rgba(0,184,224,0.16) 100%)'
          e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.25), 0 -2px 0 rgba(0,212,255,0.4) inset, inset 0 1px 0 rgba(255,255,255,0.08)'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }
      }}
      onMouseLeave={e => {
        if (!isDisabled) {
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,184,224,0.1) 100%)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
          e.currentTarget.style.transform = 'translateY(0)'
        }
      }}
    >
      {/* Shimmer sweep */}
      {!isDisabled && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(0,212,255,0.08) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />
      )}

      {/* Corner decorations */}
      {!isDisabled && (
        <>
          <span className="absolute top-0 left-0 w-3 h-3 border-t border-l rounded-tl-xl pointer-events-none" style={{ borderColor: 'rgba(0,212,255,0.4)' }} />
          <span className="absolute top-0 right-0 w-3 h-3 border-t border-r rounded-tr-xl pointer-events-none" style={{ borderColor: 'rgba(0,212,255,0.4)' }} />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l rounded-bl-xl pointer-events-none" style={{ borderColor: 'rgba(0,212,255,0.4)' }} />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r rounded-br-xl pointer-events-none" style={{ borderColor: 'rgba(0,212,255,0.4)' }} />
        </>
      )}

      {isLoading ? (
        <>
          <Loader size="sm" />
          <span className="font-mono tracking-wider text-xs">ANALYZING</span>
          <span className="font-mono text-xs opacity-60 animate-pulse">...</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
          <span className="font-mono tracking-widest text-xs font-medium">ANALYZE CODE</span>
        </>
      )}
    </button>
  )
}