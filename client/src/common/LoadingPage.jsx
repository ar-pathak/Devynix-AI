const LoadingPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        background: '#080C10',
        color: '#E8EDF5',
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 text-center"
        style={{
          background: 'rgba(13,17,23,0.78)',
          border: '1px solid rgba(0,212,255,0.16)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        }}
      >
        <div className="flex items-center justify-center gap-3 text-xs tracking-[0.35em]" style={{ color: '#00D4FF' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: '#00D4FF', boxShadow: '0 0 12px rgba(0,212,255,0.75)' }} />
          LOADING WORKSPACE
        </div>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(232,237,245,0.72)' }}>
          Preparing the Devynix AI interface.
        </p>
      </div>
    </div>
  )
}

export default LoadingPage
