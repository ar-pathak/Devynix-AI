import React from 'react'
import { Outlet } from 'react-router'

export default function App() {
  return (
    <div
      className="flex flex-col min-h-screen overflow-y-auto overflow-x-hidden relative"
      style={{ background: '#080C10', fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {/* ── Background layers ── */}
      {/* Deep radial glow — top left */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-20%', left: '-10%', width: '60vw', height: '60vw',
          background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 65%)',
          zIndex: 0,
        }}
      />
      {/* Deep radial glow — bottom right */}
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-20%', right: '-10%', width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(16,217,160,0.03) 0%, transparent 65%)',
          zIndex: 0,
        }}
      />

      {/* Fine grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          zIndex: 0,
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
          zIndex: 0,
        }}
      />

      {/* ── App Layout ── */}
      <div className="relative z-10 w-full">
        <Outlet />
      </div>
    </div>
  )
}