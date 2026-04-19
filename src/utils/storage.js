const KEY = 'habitos.v2'
const VERSION = 2

export function loadAppState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function saveAppState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: VERSION, ...state }))
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
}

export function clearAppState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

