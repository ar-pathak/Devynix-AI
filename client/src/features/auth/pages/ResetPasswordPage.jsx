// auth/pages/ResetPasswordPage.jsx
import React, { useState } from 'react'
import AuthShell from '../components/AuthShell'
import PageHeading from '../components/PageHeading'
import Input from '../components/Input'
import { PasswordStrength } from '../components/PasswordStrength'
import { Label, SubmitButton, AlertBox } from '../components/ui'
import { T } from '../tokens'

const LockIcon = (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinecap="round" />
  </svg>
)
const ShieldIcon = (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" />
  </svg>
)

function SuccessState({ onSignIn }) {
  return (
    <div style={{ textAlign: 'center', animation: 'fadeUp 0.4s ease-out' }}>
      <div style={{
        width: 72, height: 72, borderRadius: 20, margin: '0 auto 24px',
        background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 32px rgba(0,212,255,0.12)',
      }}>
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth={1.5}>
          <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: T.textPrimary, marginBottom: 10 }}>
        Password updated!
      </h2>
      <p style={{ fontSize: 12, color: T.textSec, fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.7, marginBottom: 24 }}>
        Your password has been reset.<br />Sign in with your new credentials.
      </p>
      <SubmitButton onClick={onSignIn}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Go to Sign In
      </SubmitButton>
    </div>
  )
}

export default function ResetPasswordPage({ navigate }) {
  const [form, setForm]     = useState({ password: '', confirm: '' })
  const [done, setDone]     = useState(false)
  const [loading, setLoad]  = useState(false)
  const [errors, setErrors] = useState({})

  const set = key => e => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const handleSubmit = () => {
    const e = {}
    if (form.password.length < 8)          e.password = 'Minimum 8 characters'
    if (form.password !== form.confirm)    e.confirm  = 'Passwords do not match'
    if (Object.keys(e).length) { setErrors(e); return }
    setLoad(true)
    setTimeout(() => { setLoad(false); setDone(true) }, 1600)
  }

  if (done) return (
    <AuthShell>
      <SuccessState onSignIn={() => navigate('signin')} />
    </AuthShell>
  )

  return (
    <AuthShell>
      <PageHeading
        tag="New Password"
        title={<>Set new<br />password<span style={{ color: '#00D4FF' }}>.</span></>}
        subtitle="Choose a strong password for your account."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <Label>New password</Label>
          <Input type="password" placeholder="Create a strong password" autoFocus value={form.password} onChange={set('password')} error={errors.password} icon={LockIcon} />
          <PasswordStrength password={form.password} />
        </div>

        <div>
          <Label>Confirm new password</Label>
          <Input type="password" placeholder="Repeat new password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} icon={ShieldIcon} />
        </div>

        <AlertBox variant="info">
          All other sessions will be signed out after this reset.
        </AlertBox>

        <SubmitButton isLoading={loading} onClick={handleSubmit}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinecap="round" />
          </svg>
          Update Password
        </SubmitButton>
      </div>
    </AuthShell>
  )
}