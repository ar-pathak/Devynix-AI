import React from 'react'

const LANGUAGES = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
]

export default function Navbar({ language, onLanguageChange }) {
    return (
        <header className="shrink-0 flex items-center justify-between px-4 md:px-6 h-14 border-b border-border bg-surface/60 backdrop-blur-md">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                </div>
                <span className="font-sans font-semibold text-text-primary tracking-tight">
                    Dev<span className="text-accent">ynix</span>{' '}
                    <span className="text-text-secondary font-normal text-sm">AI</span>
                </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Language selector */}
                <div className="relative">
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                        className="appearance-none bg-base border border-border text-text-primary text-sm font-mono rounded-lg pl-3 pr-8 py-1.5 cursor-pointer hover:border-accent/50 transition-colors focus:outline-none focus:ring-1 focus:ring-accent/50"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                    <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3.5 h-3.5 text-text-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>

                {/* Badge */}
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    Beta
                </span>
            </div>
        </header>
    )
}