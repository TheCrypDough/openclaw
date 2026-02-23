/*
 * AUTO ANNOTATION
 * File: assets/chrome-extension/options.js
 * Purpose: File in assets area for project orchestration/configuration/data.
 * Module area: Static visual and branding assets
 * System effect: Change can influence static visual and branding assets and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const DEFAULT_PORT = 18792

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function clampPort(value) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const n = Number.parseInt(String(value || ''), 10)
  if (!Number.isFinite(n)) return DEFAULT_PORT
  if (n <= 0 || n > 65535) return DEFAULT_PORT
  return n
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function updateRelayUrl(port) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const el = document.getElementById('relay-url')
  if (!el) return
  el.textContent = `http://127.0.0.1:${port}/`
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function relayHeaders(token) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const t = String(token || '').trim()
  if (!t) return {}
  return { 'x-openclaw-relay-token': t }
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function setStatus(kind, message) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const status = document.getElementById('status')
  if (!status) return
  status.dataset.kind = kind || ''
  status.textContent = message || ''
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
async function checkRelayReachable(port, token) {
  const url = `http://127.0.0.1:${port}/json/version`
  const trimmedToken = String(token || '').trim()
  if (!trimmedToken) {
    setStatus('error', 'Gateway token required. Save your gateway token to connect.')
    return
  }
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 1200)
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: relayHeaders(trimmedToken),
      signal: ctrl.signal,
    })
    if (res.status === 401) {
      setStatus('error', 'Gateway token rejected. Check token and save again.')
      return
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    setStatus('ok', `Relay reachable and authenticated at http://127.0.0.1:${port}/`)
  } catch {
    setStatus(
      'error',
      `Relay not reachable/authenticated at http://127.0.0.1:${port}/. Start OpenClaw browser relay and verify token.`,
    )
  } finally {
    clearTimeout(t)
  }
}

async function load() {
  const stored = await chrome.storage.local.get(['relayPort', 'gatewayToken'])
  const port = clampPort(stored.relayPort)
  const token = String(stored.gatewayToken || '').trim()
  document.getElementById('port').value = String(port)
  document.getElementById('token').value = token
  updateRelayUrl(port)
  await checkRelayReachable(port, token)
}

async function save() {
  const portInput = document.getElementById('port')
  const tokenInput = document.getElementById('token')
  const port = clampPort(portInput.value)
  const token = String(tokenInput.value || '').trim()
  await chrome.storage.local.set({ relayPort: port, gatewayToken: token })
  portInput.value = String(port)
  tokenInput.value = token
  updateRelayUrl(port)
  await checkRelayReachable(port, token)
}

document.getElementById('save').addEventListener('click', () => void save())
void load()
