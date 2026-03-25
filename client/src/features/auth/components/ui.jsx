// auth/components/ui.jsx
// ─── Lightweight UI primitives shared across all auth pages ──────────────────
import React, { useState } from 'react'
import { T } from '../tokens'

/* ── Label ─────────────────────────────────────────────────────────────────── */
export function Label({ children }) {
    return (
        <div style={{
            fontSize: 10, fontFamily: "'IBM Plex Mono',monospace",
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: T.textSec, marginBottom: 6,
        }}>
            {children}
        </div>
    )
}

/* ── SubmitButton ───────────────────────────────────────────────────────────── */
export function SubmitButton({ children, isLoading, onClick, variant = 'primary' }) {
    const [hovered, setHovered] = useState(false)
    const isPrimary = variant === 'primary'

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative', width: '100%', height: 46,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                borderRadius: 12,
                border: isPrimary ? '1px solid rgba(0,212,255,0.35)' : `1px solid ${T.border}`,
                background: isPrimary
                    ? (hovered ? 'rgba(0,212,255,0.16)' : 'rgba(0,212,255,0.10)')
                    : (hovered ? 'rgba(255,255,255,0.04)' : 'rgba(8,12,16,0.6)'),
                color: isPrimary ? T.accent : T.textSec,
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 12,
                fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s',
                boxShadow: isPrimary && hovered
                    ? '0 0 24px rgba(0,212,255,0.15)'
                    : isPrimary ? '0 0 12px rgba(0,212,255,0.06)' : 'none',
                overflow: 'hidden',
            }}
        >
            {isPrimary && !isLoading && (
                <span style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(105deg,transparent 35%,rgba(0,212,255,0.07) 50%,transparent 65%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s ease-in-out infinite',
                }} />
            )}
            {isLoading ? (
                <>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                        style={{ animation: 'spin 0.9s linear infinite' }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                    </svg>
                    Processing...
                </>
            ) : children}
        </button>
    )
}

/* ── Divider ────────────────────────────────────────────────────────────────── */
export function Divider({ text = 'or' }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{
                fontSize: 10, letterSpacing: '0.12em', color: T.textMuted,
                fontFamily: "'IBM Plex Mono',monospace",
            }}>
                {text}
            </span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
        </div>
    )
}

/* ── SocialButton ───────────────────────────────────────────────────────────── */
export function SocialButton({ icon, label, onClick }) {
    const [hovered, setHovered] = useState(false)
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                flex: 1, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                borderRadius: 10,
                border: `1px solid ${hovered ? T.borderBright : T.border}`,
                background: hovered ? 'rgba(255,255,255,0.03)' : 'rgba(8,12,16,0.6)',
                color: hovered ? T.textPrimary : T.textSec,
                fontFamily: "'IBM Plex Mono',monospace", fontSize: 11,
                cursor: 'pointer', transition: 'all 0.2s',
            }}
        >
            {icon}
            {label}
        </button>
    )
}

/* ── NavLink ────────────────────────────────────────────────────────────────── */
export function NavLink({ onClick, children }) {
    const [hovered, setHovered] = useState(false)
    return (
        <span
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                color: hovered ? T.accent : 'rgba(0,212,255,0.7)',
                cursor: 'pointer', fontWeight: 500,
                textDecoration: hovered ? 'underline' : 'none',
                transition: 'color 0.15s',
            }}
        >
            {children}
        </span>
    )
}

/* ── Checkbox ───────────────────────────────────────────────────────────────── */
export function Checkbox({ checked, onChange, error, children }) {
    return (
        <div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                <div
                    onClick={onChange}
                    style={{
                        marginTop: 1, width: 16, height: 16, borderRadius: 5, flexShrink: 0,
                        border: `1px solid ${checked ? 'rgba(0,212,255,0.5)' : error ? 'rgba(248,113,113,0.4)' : T.border}`,
                        background: checked ? 'rgba(0,212,255,0.12)' : 'rgba(8,12,16,0.8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s',
                    }}
                >
                    {checked && (
                        <svg width={10} height={10} viewBox="0 0 12 12" fill="none" stroke={T.accent} strokeWidth={2} strokeLinecap="round">
                            <path d="M2 6l3 3 5-5" strokeDasharray={12} style={{ animation: 'checkDraw 0.25s ease-out forwards' }} />
                        </svg>
                    )}
                </div>
                <span style={{ fontSize: 11, color: T.textSec, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.5 }}>
                    {children}
                </span>
            </label>
            {error && (
                <div style={{ marginTop: 4, fontSize: 11, color: T.danger, fontFamily: "'IBM Plex Mono',monospace" }}>
                    {error}
                </div>
            )}
        </div>
    )
}

/* ── BackLink ───────────────────────────────────────────────────────────────── */
export function BackLink({ onClick, children = 'Back to sign in' }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 24,
                cursor: 'pointer', fontSize: 11, fontFamily: "'IBM Plex Mono',monospace",
                color: hovered ? T.accent : T.textSec, transition: 'color 0.15s',
            }}
        >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {children}
        </div>
    )
}

/* ── AlertBox ───────────────────────────────────────────────────────────────── */
export function AlertBox({ variant = 'info', children }) {
    const styles = {
        info: { bg: 'rgba(0,212,255,0.05)', border: 'rgba(0,212,255,0.12)', color: 'rgba(0,212,255,0.5)' },
        success: { bg: 'rgba(16,217,160,0.05)', border: 'rgba(16,217,160,0.2)', color: T.success },
        danger: { bg: 'rgba(248,113,113,0.07)', border: 'rgba(248,113,113,0.2)', color: T.danger },
    }
    const s = styles[variant] || styles.info
    return (
        <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: s.bg, border: `1px solid ${s.border}`,
        }}>
            <p style={{ fontSize: 10, color: s.color, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.6, letterSpacing: '0.04em' }}>
                {children}
            </p>
        </div>
    )
}