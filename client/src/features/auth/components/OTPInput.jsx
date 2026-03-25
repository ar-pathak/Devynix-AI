import React, { useRef } from 'react'
import { T } from '../tokens'

export default function OTPInput({ code, onChange, error }) {
  const inputs = useRef([])

  const handleDigit = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[i] = v
    onChange(next)
    if (v && i < 5) inputs.current[i + 1]?.focus()
  }

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus()
      const next = [...code]
      next[i - 1] = ''
      onChange(next)
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      onChange(pasted.split(''))
      inputs.current[5]?.focus()
    }
  }

  const filled = code.filter(Boolean).length

  return (
    <div style={{ width: '100%' }}>
      {/* Digit inputs */}
      <div
        style={{ display: 'flex', gap: 'clamp(4px, 2vw, 8px)', justifyContent: 'space-between', margin: '8px 0 16px' }}
        onPaste={handlePaste}
      >
        {code.map((d, i) => (
          <input
            key={i}
            ref={el => inputs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            autoFocus={i === 0}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
            style={{
              flex: '1 1 0', minWidth: 0, maxWidth: 48, height: 56, 
              borderRadius: 12, textAlign: 'center',
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 22, fontWeight: 600,
              color: d ? T.accent : T.textMuted,
              background: d ? 'rgba(0,212,255,0.06)' : 'rgba(8,12,16,0.8)',
              border: `1.5px solid ${d
                ? 'rgba(0,212,255,0.4)'
                : error ? 'rgba(248,113,113,0.3)' : T.border}`,
              outline: 'none', transition: 'all 0.15s',
              boxShadow: d ? '0 0 12px rgba(0,212,255,0.1)' : 'none',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 16 }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            width: i < filled ? 18 : 6, height: 4, borderRadius: 2,
            background: i < filled ? T.accent : T.border,
            transition: 'all 0.2s',
            boxShadow: i < filled ? '0 0 6px rgba(0,212,255,0.4)' : 'none',
          }} />
        ))}
      </div>

      {error && (
        <div style={{
          marginBottom: 8, textAlign: 'center', fontSize: 11,
          color: T.danger, fontFamily: "'IBM Plex Mono',monospace",
        }}>
          {error}
        </div>
      )}
    </div>
  )
}