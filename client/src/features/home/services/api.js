const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '')
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 90000)

function combineSignals(signals) {
  const validSignals = signals.filter(Boolean)

  if (validSignals.length === 1) {
    return validSignals[0]
  }

  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any(validSignals)
  }

  const controller = new AbortController()
  const abort = () => controller.abort()

  validSignals.forEach((signal) => {
    if (signal.aborted) {
      abort()
      return
    }

    signal.addEventListener('abort', abort, { once: true })
  })

  return controller.signal
}

async function requestJson(path, { method = 'GET', body, signal, timeout = DEFAULT_TIMEOUT_MS } = {}) {
  const timeoutController = new AbortController()
  const timeoutId = window.setTimeout(() => timeoutController.abort(), timeout)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: combineSignals([signal, timeoutController.signal]),
    })

    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(payload.details || payload.error || 'Request failed. Please try again.')
    }

    return payload
  } catch (error) {
    if (timeoutController.signal.aborted && !signal?.aborted) {
      throw new Error(`Request timed out after ${Math.round(timeout / 1000)} seconds.`)
    }

    if (error?.name === 'AbortError') {
      throw error
    }

    if (error instanceof TypeError) {
      throw new Error('Unable to reach the API server. Check that the backend is running.')
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export function analyzeCode(code, language, options = {}) {
  return requestJson('/analyze', {
    ...options,
    method: 'POST',
    body: { code, language },
  })
}
