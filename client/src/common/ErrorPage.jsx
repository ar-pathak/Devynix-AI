import { isRouteErrorResponse, useRouteError } from 'react-router'

const ErrorPage = () => {
  const error = useRouteError()
  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went wrong'
  const message = isRouteErrorResponse(error)
    ? error.data?.message || 'The requested page could not be loaded.'
    : error?.message || 'The application hit an unexpected runtime error.'

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
        className="w-full max-w-lg rounded-2xl p-6"
        style={{
          background: 'rgba(13,17,23,0.82)',
          border: '1px solid rgba(239,68,68,0.24)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        }}
      >
        <div className="text-xs tracking-[0.35em]" style={{ color: '#EF4444' }}>
          ROUTE ERROR
        </div>
        <h1 className="mt-4 text-2xl font-semibold" style={{ color: '#E8EDF5' }}>
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(232,237,245,0.72)' }}>
          {message}
        </p>
        <button
          type="button"
          className="mt-6 rounded-xl px-4 py-2 text-sm"
          style={{
            background: 'rgba(0,212,255,0.08)',
            border: '1px solid rgba(0,212,255,0.22)',
            color: '#00D4FF',
          }}
          onClick={() => window.location.assign('/')}
        >
          Return Home
        </button>
      </div>
    </div>
  )
}

export default ErrorPage
