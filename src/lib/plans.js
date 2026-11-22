// Helpers for "plans": invitations with a date. Dates are YYYY-MM-DD strings, times HH:MM.
export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const isPast = (inv) => !!inv.fecha && inv.fecha < todayISO()
export const isUpcoming = (inv) => !isPast(inv)
// the earliest dated, not-yet-past invitation, or null
export function nextPlan(list) {
  const dated = list.filter((i) => i.fecha && !isPast(i))
  dated.sort((a, b) => (a.fecha + (a.hora || '')).localeCompare(b.fecha + (b.hora || '')))
  return dated[0] || null
}
export function formatWhen(inv) {
  const d = new Date(inv.fecha + 'T12:00:00')
  const day = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
  if (!inv.hora) return day
  const [h, m] = inv.hora.split(':')
  return `${day} · ${+h % 12 || 12}:${m} ${+h >= 12 ? 'pm' : 'am'}`
}
