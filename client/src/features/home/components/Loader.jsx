import React from 'react'

export default function Loader({ size = 'md', text }) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-10 h-10 border-[3px]',
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative">
                {/* Outer ring */}
                <div
                    className={`${sizeClasses[size]} rounded-full border-accent/20 border-t-accent animate-spin`}
                />
                {/* Inner glow */}
                <div
                    className={`absolute inset-0 rounded-full bg-accent/10 blur-sm`}
                    style={{ animation: 'pulseAccent 1.5s ease-in-out infinite' }}
                />
            </div>
            {text && (
                <p className="text-text-secondary text-sm font-mono animate-pulse">{text}</p>
            )}
        </div>
    )
}

export function EditorFallback() {
    return (
        <div className="flex items-center justify-center h-full bg-base">
            <Loader size="lg" text="Loading editor..." />
        </div>
    )
}