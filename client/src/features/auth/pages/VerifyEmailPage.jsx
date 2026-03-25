// auth/pages/VerifyEmailPage.jsx
import React, { useState } from 'react'
import AuthShell from '../components/AuthShell'
import PageHeading from '../components/PageHeading'
import OTPInput from '../components/OTPInput'
import { SubmitButton, NavLink } from '../components/ui'

export default function VerifyEmailPage({ navigate, email = 'you@example.com' }) {
  const [code, setCode]     = useState(['', '', '', '', '', ''])
  const [loading, setLoad]  = useState(false)
  const [error, setError]   = useState('')
  const [resent, setResent] = useState(false)
  const [countdown, setCD]  = useState(0)

  const handleVerify = () => {
    if (code.join('').length < 6) { setError('Enter all 6 digits'); return }
    setLoad(true)
    setTimeout(() => { setLoad(false); navigate('app') }, 1600)
  }

  const handleResend = () => {
    setResent(true); setCD(30)
    const t = setInterval(() => setCD(v => {
      if (v <= 1) { clearInterval(t); setResent(false); return 0 }
      return v - 1
    }), 1000)
  }

  return (
    <AuthShell>
      <PageHeading
        tag="Email Verification"
        title={<>Verify your<br />email<span style={{ color: '#00D4FF' }}>.</span></>}
        subtitle={
          <>
            We sent a 6-digit code to{' '}
            <span style={{ color: '#00D4FF' }}>{email}</span>
            <br />Enter it below to activate your account.
          </>
        }
      />

      <OTPInput
        code={code}
        onChange={(next) => { setCode(next); setError('') }}
        error={error}
      />

      <SubmitButton isLoading={loading} onClick={handleVerify}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Verify Account
      </SubmitButton>

      <p style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: '#3D4F63', fontFamily: "'IBM Plex Mono',monospace" }}>
        Didn't receive it?{' '}
        {resent
          ? <span style={{ color: 'rgba(0,212,255,0.4)' }}>Resend in {countdown}s</span>
          : <NavLink onClick={handleResend}>Resend code</NavLink>
        }
      </p>

      <p style={{ marginTop: 10, textAlign: 'center', fontSize: 11, color: '#3D4F63', fontFamily: "'IBM Plex Mono',monospace" }}>
        Wrong account?{' '}
        <NavLink onClick={() => navigate('signin')}>Sign out</NavLink>
      </p>
    </AuthShell>
  )
}