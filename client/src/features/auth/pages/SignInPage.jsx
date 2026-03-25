// auth/pages/SignInPage.jsx
import React, { useState } from 'react'
import AuthShell from '../components/AuthShell'
import PageHeading from '../components/PageHeading'
import Input from '../components/Input'
import SocialRow from '../components/SocialRow'
import { Label, SubmitButton, Divider, NavLink, Checkbox } from '../components/ui'

const EmailIcon = (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" />
  </svg>
)
const LockIcon = (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinecap="round" />
  </svg>
)

function validate(email, password) {
  const errors = {}
  if (!email.includes('@'))   errors.email    = 'Enter a valid email address'
  if (password.length < 6)    errors.password = 'Password must be at least 6 characters'
  return errors
}

export default function SignInPage({ navigate }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})

  const handleSubmit = () => {
    const e = validate(email, password)
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('app') }, 1800)
  }

  const clear = (key) => setErrors(prev => ({ ...prev, [key]: '' }))

  return (
    <AuthShell>
      <PageHeading
        tag="Secure Access"
        title={<>Welcome<br />back<span style={{ color: '#00D4FF' }}>.</span></>}
        subtitle="Sign in to continue to your workspace."
      />

      <SocialRow />
      <Divider text="or continue with email" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <Label>Email address</Label>
          <Input
            type="email" placeholder="you@example.com" autoFocus
            value={email} onChange={e => { setEmail(e.target.value); clear('email') }}
            error={errors.email} icon={EmailIcon}
          />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Label>Password</Label>
            <span
              onClick={() => navigate('forgot')}
              style={{ fontSize: 10, color: 'rgba(0,212,255,0.6)', cursor: 'pointer', fontFamily: "'IBM Plex Mono',monospace" }}
              onMouseEnter={e => e.currentTarget.style.color = '#00D4FF'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,212,255,0.6)'}
            >
              Forgot password?
            </span>
          </div>
          <Input
            type="password" placeholder="Enter your password"
            value={password} onChange={e => { setPassword(e.target.value); clear('password') }}
            error={errors.password} icon={LockIcon}
          />
        </div>

        <Checkbox checked={remember} onChange={() => setRemember(v => !v)}>
          Remember this device
        </Checkbox>

        <SubmitButton isLoading={loading} onClick={handleSubmit}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Sign In
        </SubmitButton>
      </div>

      <p style={{ marginTop: 22, textAlign: 'center', fontSize: 11, color: '#3D4F63', fontFamily: "'IBM Plex Mono',monospace" }}>
        No account yet?{' '}
        <NavLink onClick={() => navigate('signup')}>Create one →</NavLink>
      </p>
    </AuthShell>
  )
}