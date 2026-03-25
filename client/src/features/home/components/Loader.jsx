import React from 'react'

export default function Loader({ size = 'md', text }) {
    const sizes = {
        sm: { outer: 16, border: 1.5 },
        md: { outer: 24, border: 2 },
        lg: { outer: 40, border: 2.5 },
    }
    const s = sizes[size]

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="relative" style={{ width: s.outer, height: s.outer }}>
                {/* Outer ring */}
                <svg
                    className="animate-spin"
                    style={{ animationDuration: '1s' }}
                    viewBox={`0 0 ${s.outer} ${s.outer}`}
                    fill="none"
                    width={s.outer}
                    height={s.outer}
                >
                    <circle
                        cx={s.outer / 2}
                        cy={s.outer / 2}
                        r={s.outer / 2 - s.border}
                        stroke="rgba(0,212,255,0.12)"
                        strokeWidth={s.border}
                    />
                    <circle
                        cx={s.outer / 2}
                        cy={s.outer / 2}
                        r={s.outer / 2 - s.border}
                        stroke="rgba(0,212,255,0.9)"
                        strokeWidth={s.border}
                        strokeLinecap="round"
                        strokeDasharray={`${(s.outer - s.border * 2) * Math.PI * 0.25} ${(s.outer - s.border * 2) * Math.PI * 0.75}`}
                    />
                </svg>
                {/* Center dot */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                        width: s.outer * 0.25,
                        height: s.outer * 0.25,
                        background: '#00D4FF',
                        boxShadow: '0 0 8px rgba(0,212,255,0.8)',
                        animation: 'glowPulse 1.5s ease-in-out infinite',
                    }}
                />
            </div>
            {text && (
                <p
                    className="text-xs font-mono tracking-widest uppercase animate-pulse"
                    style={{ color: 'rgba(0,212,255,0.6)', letterSpacing: '0.15em' }}
                >
                    {text}
                </p>
            )}
        </div>
    )
}

export function EditorFallback() {
    return (
        <div className="flex items-center justify-center h-full" style={{ background: '#080C10' }}>
            <Loader size="lg" text="Loading editor" />
        </div>
    )
}