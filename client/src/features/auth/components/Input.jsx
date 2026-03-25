// auth/components/Input.jsx
import React, { useState } from 'react'
import { T } from '../tokens'

export default function Input({
  type = 'text', placeholder, value, onChange,
  icon, error, autoFocus, suffix,
}) {
  const [focused, setFocused] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const isPass = type === 'password'
  const inputType = isPass ? (showPass ? 'text' : 'password') : type

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 14px', height: 44,
        background: focused ? 'rgba(0,212,255,0.04)' : 'rgba(8,12,16,0.8)',
        border: `1px solid ${error
          ? 'rgba(248,113,113,0.4)'
          : focused ? 'rgba(0,212,255,0.4)' : T.border}`,
        borderRadius: 12,
        transition: 'all 0.2s',
        boxShadow: focused ? '0 0 0 3px rgba(0,212,255,0.06)' : 'none',
      }}>
        {icon && (
          <span style={{ color: focused ? T.accent : T.textMuted, transition: 'color 0.2s', flexShrink: 0 }}>
            {icon}
          </span>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            fontFamily: "'IBM Plex Mono',monospace", fontSize: 13,
            color: T.textPrimary,
            letterSpacing: isPass && !showPass ? '0.15em' : '0.02em',
          }}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: T.textMuted, lineHeight: 0, flexShrink: 0 }}
          >
            {showPass ? (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" strokeLinecap="round" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" />
              </svg>
            )}
          </button>
        )}
        {suffix && (
          <span style={{ color: T.textMuted, fontSize: 11, flexShrink: 0 }}>{suffix}</span>
        )}
      </div>

      {error && (
        <div style={{
          marginTop: 5, fontSize: 11, color: T.danger,
          fontFamily: "'IBM Plex Mono',monospace",
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width={10} height={10} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}