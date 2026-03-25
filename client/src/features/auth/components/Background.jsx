// auth/components/Background.jsx
import React from 'react'

export default function Background() {
  return (
    <>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)',
      }} />
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%',
        width: '55vw', height: '55vw', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle,rgba(0,212,255,0.05) 0%,transparent 65%)',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%',
        width: '45vw', height: '45vw', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle,rgba(16,217,160,0.04) 0%,transparent 65%)',
      }} />
    </>
  )
}