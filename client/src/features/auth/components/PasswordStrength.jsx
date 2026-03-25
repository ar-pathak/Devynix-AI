import React from 'react'
import { T } from '../tokens'

const CHECKS = [
  { label: '8+ chars',  test: (p) => p.length >= 8         },
  { label: 'Uppercase', test: (p) => /[A-Z]/.test(p)       },
  { label: 'Number',    test: (p) => /[0-9]/.test(p)       },
  { label: 'Symbol',    test: (p) => /[^A-Za-z0-9]/.test(p)},
]
const BAR_COLORS  = ['', '#F87171', '#F59E0B', '#F59E0B', '#10D9A0', '#10D9A0']
const SCORE_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']

export function PasswordStrength({ password }) {
  if (!password) return null
  const score = CHECKS.filter(c => c.test(password)).length

  return (
    <div style={{ marginTop: 8 }}>
      {/* Bars */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < score ? BAR_COLORS[score] : T.border,
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Rule hints */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, rowGap: 4, flexWrap: 'wrap', flex: 1 }}>
          {CHECKS.map(c => (
            <span key={c.label} style={{
              fontSize: 9, letterSpacing: '0.1em',
              fontFamily: "'IBM Plex Mono',monospace",
              color: c.test(password) ? T.success : T.textMuted,
              display: 'flex', alignItems: 'center', gap: 3, whiteSpace: 'nowrap'
            }}>
              {c.test(password) ? '✓' : '○'} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span style={{ fontSize: 9, fontFamily: "'IBM Plex Mono',monospace", color: BAR_COLORS[score], letterSpacing: '0.1em', flexShrink: 0 }}>
            {SCORE_LABELS[score]}
          </span>
        )}
      </div>
    </div>
  )
}