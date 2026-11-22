import { useMemo } from 'react'
import './parisMap.css'

export function Stamp() {
  return (
    <svg width="26" height="26" viewBox="-13 -13 26 26" aria-hidden="true">
      <circle r="11" fill="#626d27" stroke="#3a4316" strokeWidth="1.2" />
      <circle r="7.6" fill="none" stroke="#c7d27a" strokeOpacity=".65" strokeWidth="1" />
      <path d="M-3.6 2.6C-1.8-5.8 1.8 5.8 3.6-2.6" stroke="#eef5b8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  )
}
export function XMark() {
  return (
    <svg width="24" height="24" viewBox="-12 -12 24 24" aria-hidden="true">
      <g stroke="#8a2b1c" strokeWidth="3.4" strokeLinecap="round"><path d="M-6.5-6.5L6.5 6.5M6.5-6.5L-6.5 6.5" /></g>
    </svg>
  )
}

/* The café pins, drawn as buttons over any map. items are [{ c, x, y }] in screen pixels.
   Pins closer than ~34px merge into a numbered badge (the selected café always stays on its own). */
export default function MapPins({ items, stamped, mode, selectedId, onSelect, onCluster, showLabels }) {
  const clusters = useMemo(() => {
    const out = []
    items.forEach((p, idx) => {
      const it = { ...p, idx }
      const solo = p.c.id === selectedId
      const near = solo ? null : out.find((g) => !g.solo && Math.hypot(g.x - p.x, g.y - p.y) < 34)
      if (near) {
        near.members.push(it)
        near.x = near.members.reduce((a, m) => a + m.x, 0) / near.members.length
        near.y = near.members.reduce((a, m) => a + m.y, 0) / near.members.length
      } else out.push({ members: [it], x: p.x, y: p.y, solo })
    })
    return out
  }, [items, selectedId])

  return clusters.map((g) => {
    if (g.members.length > 1) {
      const allIn = g.members.every((m) => stamped.has(m.c.id))
      return (
        <button
          key={g.members.map((m) => m.c.id).join('+')}
          type="button"
          className="pm-pin pm-cluster"
          style={{ left: g.x, top: g.y }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onCluster(g.members)}
          aria-label={`${g.members.length} coffee shops here, zoom in`}
        >
          <span className={allIn ? 'pm-in' : ''}>{g.members.length}</span>
        </button>
      )
    }
    const { c, x, y, idx } = g.members[0]
    const visited = stamped.has(c.id)
    const dim = mode === 'mine' && !visited
    const sel = c.id === selectedId
    return (
      <button
        key={c.id}
        type="button"
        className={`pm-pin ${sel ? 'pm-sel' : ''} ${idx % 2 ? 'pm-up' : ''}`}
        style={{ left: x, top: y, opacity: dim ? 0.38 : 1 }}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => onSelect(c.id, g.members[0])}
        aria-label={`${c.nombre}${visited ? ', visited' : ''}`}
        aria-pressed={sel}
      >
        {visited ? <Stamp /> : <XMark />}
        {(showLabels || sel) && <span className="pm-label">{c.nombre}</span>}
      </button>
    )
  })
}
