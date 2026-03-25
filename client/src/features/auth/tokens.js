
// ─── Shared design tokens for the Terminal Noir auth system ───────────────────

export const T = {
  base:         '#080C10',
  base2:        '#0D1117',
  surface:      '#111820',
  surface2:     '#161E28',
  border:       '#1E2D3D',
  borderBright: '#2A3F55',

  accent:       '#00D4FF',
  accentDim:    'rgba(0,212,255,0.10)',
  accentGlow:   'rgba(0,212,255,0.30)',
  accentLight:  '#7EEEFF',

  success:      '#10D9A0',
  successDim:   'rgba(16,217,160,0.10)',

  warn:         '#F59E0B',
  warnDim:      'rgba(245,158,11,0.10)',

  danger:       '#F87171',
  dangerDim:    'rgba(248,113,113,0.10)',

  textPrimary:  '#E8EDF5',
  textSec:      '#6B7D94',
  textMuted:    '#3D4F63',
}

export const LANGUAGES_COLORS = {
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  python:     '#3776AB',
  rust:       '#CE422B',
  go:         '#00ADD8',
  java:       '#ED8B00',
  cpp:        '#00599C',
  csharp:     '#9B4F96',
}

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'IBM Plex Mono', monospace;
    background: ${T.base};
    color: ${T.textPrimary};
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: rgba(0,212,255,0.18); color: #7EEEFF; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.borderBright}; border-radius: 2px; }

  @keyframes fadeUp    { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn    { from{opacity:0;} to{opacity:1;} }
  @keyframes blink     { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes spin      { to{transform:rotate(360deg);} }
  @keyframes glowPulse { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
  @keyframes shimmer   { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
  @keyframes float     { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
  @keyframes checkDraw { from{stroke-dashoffset:30;} to{stroke-dashoffset:0;} }
  @keyframes borderGlow {
    0%,100%{box-shadow:0 0 0 1px rgba(0,212,255,0.2);}
    50%{box-shadow:0 0 0 1px rgba(0,212,255,0.5),0 0 20px rgba(0,212,255,0.08);}
  }
`