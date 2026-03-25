// auth/pages/SignOutPage.jsx
import React, { useState } from 'react'
import AuthShell from '../components/AuthShell'
import { SubmitButton } from '../components/ui'
import { T } from '../tokens'

export default function SignOutPage({ navigate, user = { email: 'jane@devynix.io', plan: 'Pro plan' } }) {
    const [loading, setLoad] = useState(false)
    const [done, setDone] = useState(false)

    const handleSignOut = () => {
        setLoad(true)
        setTimeout(() => {
            setLoad(false)
            setDone(true)
            setTimeout(() => navigate('signin'), 1500)
        }, 1200)
    }

    if (done) return (
        <AuthShell>
            <div style={{ textAlign: 'center', animation: 'fadeUp 0.4s ease-out' }}>
                <div style={{ fontSize: 40, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>👋</div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.textPrimary, marginBottom: 8 }}>
                    Goodbye!
                </h2>
                <p style={{ fontSize: 12, color: T.textSec, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.6 }}>
                    You've been signed out.<br />
                    <span style={{ color: 'rgba(0,212,255,0.5)' }}>Redirecting to sign in...</span>
                </p>
            </div>
        </AuthShell>
    )

    return (
        <AuthShell>
            <div style={{ textAlign: 'center' }}>
                {/* Avatar */}
                <div style={{
                    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
                    background: T.accentDim, border: '1px solid rgba(0,212,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.5}>
                        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" />
                    </svg>
                </div>

                <div style={{ marginBottom: 6, fontSize: 14, fontFamily: "'Syne',sans-serif", fontWeight: 700, color: T.textPrimary }}>
                    {user.email}
                </div>
                <div style={{ marginBottom: 28, fontSize: 11, color: T.textMuted, fontFamily: "'IBM Plex Mono',monospace" }}>
                    Signed in · {user.plan}
                </div>

                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: T.textPrimary, marginBottom: 10 }}>
                    Sign out<span style={{ color: T.accent }}>?</span>
                </h2>
                <p style={{ fontSize: 12, color: T.textSec, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.7, marginBottom: 28 }}>
                    You'll need to sign in again to access<br />your workspace.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <SubmitButton isLoading={loading} onClick={handleSignOut}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Sign Out
                    </SubmitButton>
                    <SubmitButton variant="secondary" onClick={() => navigate('app')}>
                        Cancel — Stay signed in
                    </SubmitButton>
                </div>
            </div>
        </AuthShell>
    )
}