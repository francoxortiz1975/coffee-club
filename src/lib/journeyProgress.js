// Which lessons you have read, kept on this device.
const KEY = 'sumay_journey_read'
export function getRead() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch { return new Set() }
}
export function markRead(id) {
  try {
    const s = getRead()
    if (s.has(id)) return
    s.add(id)
    localStorage.setItem(KEY, JSON.stringify([...s]))
  } catch { /* private mode */ }
}
