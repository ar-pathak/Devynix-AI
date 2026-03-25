// auth/pages/ForgotPasswordPage.jsx
import React, { useState } from 'react'
import AuthShell from '../components/AuthShell'
import PageHeading from '../components/PageHeading'
import Input from '../components/Input'
import { Label, SubmitButton, BackLink, AlertBox } from '../components/ui'
import { T } from '../tokens'

const EmailIcon = (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" />
    </svg>
)

function SuccessState({ email, onBack }) {
    return (
        <div style={{ textAlign: 'center', animation: 'fadeUp 0.4s ease-out' }}>
            <div style={{
                width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
                background: T.successDim, border: '1px solid rgba(16,217,160,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 32px rgba(16,217,160,0.1)',
                animation: 'float 3s ease-in-out infinite',
            }}>
                <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={T.success} strokeWidth={1.5}>
                    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" />
                </svg>
            </div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.textPrimary, marginBottom: 10 }}>
                Check your inbox
            </h2>
            <p style={{ fontSize: 12, color: T.textSec, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.7, marginBottom: 20 }}>
                We sent a reset link to<br />
                <span style={{ color: T.accent }}>{email}</span>
            </p>
            <AlertBox variant="success">
                Link expires in 15 minutes. Check spam if you don't see it.
            </AlertBox>
            <div style={{ marginTop: 20 }}>
                <SubmitButton variant="secondary" onClick={onBack}>← Back to Sign In</SubmitButton>
            </div>
        </div>
    )
}

export default function ForgotPasswordPage({ navigate }) {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoad] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = () => {
        if (!email.includes('@')) { setError('Enter a valid email address'); return }
        setLoad(true)
        setTimeout(() => { setLoad(false); setSent(true) }, 1600)
    }

    if (sent) return (
        <AuthShell>
            <SuccessState email={email} onBack={() => navigate('signin')} />
        </AuthShell>
    )

    return (
        <AuthShell>
            <PageHeading
                tag="Password Recovery"
                title={<>Reset your<br />password<span style={{ color: '#00D4FF' }}>.</span></>}
                subtitle="Enter your email and we'll send you a secure reset link."
            />

            <BackLink onClick={() => navigate('signin')} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                    <Label>Email address</Label>
                    <Input
                        type="email" placeholder="you@example.com" autoFocus
                        value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                        error={error} icon={EmailIcon}
                    />
                </div>

                <SubmitButton isLoading={loading} onClick={handleSubmit}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Send Reset Link
                </SubmitButton>
            </div>
        </AuthShell>
    )
}