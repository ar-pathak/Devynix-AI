// auth/components/PageHeading.jsx
import React from 'react'
import { T } from '../tokens'

export default function PageHeading({ title, subtitle, tag }) {
  return (
    <div style={{ marginBottom: 28 }}>
      {tag && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(0,212,255,0.6)', fontFamily: "'IBM Plex Mono',monospace",
          marginBottom: 10,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: T.accent,
            animation: 'glowPulse 2s ease-in-out infinite',
            boxShadow: '0 0 6px rgba(0,212,255,0.5)',
          }} />
          {tag}
        </div>
      )}
      <h1 style={{
        fontFamily: "'Syne',sans-serif", fontWeight: 800,
        fontSize: 26, lineHeight: 1.15, color: T.textPrimary, marginBottom: 8,
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontSize: 12, color: T.textSec,
          fontFamily: "'IBM Plex Mono',monospace", lineHeight: 1.6,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}