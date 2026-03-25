import React from 'react'
import { T } from '../tokens'

const CORNERS = ['tl', 'tr', 'bl', 'br']

function CornerBracket({ pos }) {
    const color = 'rgba(0,212,255,0.25)'
    return (
        <span style={{
            position: 'absolute', width: 14, height: 14,
            borderTop: pos.startsWith('t') ? `1px solid ${color}` : 'none',
            borderBottom: pos.startsWith('b') ? `1px solid ${color}` : 'none',
            borderLeft: pos.endsWith('l') ? `1px solid ${color}` : 'none',
            borderRight: pos.endsWith('r') ? `1px solid ${color}` : 'none',
            top: pos.startsWith('t') ? 8 : 'auto',
            bottom: pos.startsWith('b') ? 8 : 'auto',
            left: pos.endsWith('l') ? 8 : 'auto',
            right: pos.endsWith('r') ? 8 : 'auto',
            borderRadius:
                pos === 'tl' ? '6px 0 0 0' :
                    pos === 'tr' ? '0 6px 0 0' :
                        pos === 'bl' ? '0 0 0 6px' : '0 0 6px 0',
            pointerEvents: 'none',
        }} />
    )
}

export default function AuthShell({ children, wide = false }) {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(16px, 4vw, 24px) 16px', position: 'relative',
        }}>
            {/* Brand */}
            <div style={{
                position: 'relative', zIndex: 1, marginBottom: 32,
                animation: 'fadeUp 0.5s ease-out',
                display: 'flex', alignItems: 'center', gap: 10,
            }}>
                <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)',
                    boxShadow: '0 0 16px rgba(0,212,255,0.12)',
                }}>
                    <svg viewBox="0 0 24 24" fill="none" width={16} height={16} stroke={T.accent} strokeWidth={1.5}>
                        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3" strokeLinecap="round" />
                        <circle cx={12} cy={12} r={2.5} stroke={T.accent} strokeWidth={1.5} />
                    </svg>
                </div>
                <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 17, color: T.textPrimary, lineHeight: 1.1 }}>
                        Dev<span style={{ color: T.accent }}>ynix</span>
                    </div>
                    <div style={{ fontSize: 9, letterSpacing: '0.18em', color: T.textMuted, textTransform: 'uppercase', lineHeight: 1 }}>
                        AI Analyzer
                    </div>
                </div>
            </div>

            {/* Card */}
            <div style={{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: wide ? 480 : 420,
                background: 'rgba(13,17,23,0.85)',
                border: `1px solid ${T.border}`,
                borderRadius: 20,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,255,0.04)',
                animation: 'fadeUp 0.55s ease-out',
                overflow: 'hidden',
            }}>
                {/* Top accent line */}
                <div style={{
                    height: 1,
                    background: 'linear-gradient(90deg,transparent,rgba(0,212,255,0.6) 40%,rgba(0,212,255,0.6) 60%,transparent)',
                }} />

                {CORNERS.map(c => <CornerBracket key={c} pos={c} />)}

                {/* Fluid Padding Here */}
                <div style={{ padding: 'clamp(24px, 6vw, 32px) clamp(20px, 8vw, 36px)' }}>
                    {children}
                </div>
            </div>

            {/* Footer */}
            <div style={{
                position: 'relative', zIndex: 1, marginTop: 24,
                fontSize: 10, fontFamily: "'IBM Plex Mono',monospace",
                color: T.textMuted, letterSpacing: '0.08em',
                animation: 'fadeIn 0.8s ease-out',
            }}>
                © 2025 Devynix — All rights reserved
            </div>
        </div>
    )
}