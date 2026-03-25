// auth/pages/SignUpPage.jsx
import React, { useState } from 'react'
import AuthShell from '../components/AuthShell'
import PageHeading from '../components/PageHeading'
import Input from '../components/Input'
import SocialRow from '../components/SocialRow'
import { PasswordStrength } from '../components/PasswordStrength'
import { Label, SubmitButton, Divider, NavLink, Checkbox } from '../components/ui'

const icons = {
  user: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" /></svg>,
  email: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" /></svg>,
  lock: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" strokeLinecap="round" /></svg>,
  shield: <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" strokeLinecap="round" /></svg>,
}

function validate(form, agreed) {
  const e = {}
  if (!form.name.trim())               e.name     = 'Full name is required'
  if (!form.email.includes('@'))        e.email    = 'Enter a valid email'
  if (form.password.length < 8)        e.password = 'Minimum 8 characters'
  if (form.password !== form.confirm)  e.confirm  = 'Passwords do not match'
  if (!agreed)                         e.agree    = 'You must accept the terms'
  return e
}

export default function SignUpPage({ navigate }) {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [agreed, setAgreed]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState({})

  const set = key => e => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const handleSubmit = () => {
    const e = validate(form, agreed)
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('verify') }, 1800)
  }

  return (
    <AuthShell wide>
      <PageHeading
        tag="New Account"
        title={<>Create your<br />workspace<span style={{ color: '#00D4FF' }}>.</span></>}
        subtitle="Start analyzing code with AI in under a minute."
      />

      <SocialRow />
      <Divider text="or sign up with email" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <div>
          <Label>Full name</Label>
          <Input placeholder="Jane Doe" autoFocus value={form.name} onChange={set('name')} error={errors.name} icon={icons.user} />
        </div>

        <div>
          <Label>Work email</Label>
          <Input type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} error={errors.email} icon={icons.email} />
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" placeholder="Create a strong password" value={form.password} onChange={set('password')} error={errors.password} icon={icons.lock} />
          <PasswordStrength password={form.password} />
        </div>

        <div>
          <Label>Confirm password</Label>
          <Input type="password" placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} icon={icons.shield} />
        </div>

        <Checkbox checked={agreed} onChange={() => setAgreed(v => !v)} error={errors.agree}>
          I agree to the{' '}
          <span onClick={() => {}} style={{ color: 'rgba(0,212,255,0.7)', cursor: 'pointer' }}>Terms of Service</span>
          {' '}and{' '}
          <span onClick={() => {}} style={{ color: 'rgba(0,212,255,0.7)', cursor: 'pointer' }}>Privacy Policy</span>
        </Checkbox>

        <SubmitButton isLoading={loading} onClick={handleSubmit}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Create Account
        </SubmitButton>
      </div>

      <p style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: '#3D4F63', fontFamily: "'IBM Plex Mono',monospace" }}>
        Already have an account?{' '}
        <NavLink onClick={() => navigate('signin')}>Sign in →</NavLink>
      </p>
    </AuthShell>
  )
}