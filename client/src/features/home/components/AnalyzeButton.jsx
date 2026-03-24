import React from 'react'
import Loader from './Loader'

export default function AnalyzeButton({ onClick, isLoading, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative flex items-center justify-center gap-2 w-full
        px-5 py-2.5 rounded-xl font-sans font-semibold text-sm
        transition-all duration-200 overflow-hidden
        ${
          isLoading || disabled
            ? 'bg-accent/40 text-white/50 cursor-not-allowed'
            : 'bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 animate-pulse-accent'
        }
      `}
    >
      {/* Shimmer effect on hover */}
      {!isLoading && !disabled && (
        <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
      )}

      {isLoading ? (
        <>
          <Loader size="sm" />
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
          </svg>
          <span>Analyze Code</span>
        </>
      )}
    </button>
  )
}