import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { OUTLINE_D, SEINE_D, ISLANDS, LANDMARKS, WORLD, WORLD_VIEWBOX, project } from '../lib/parisMap'
import MapPins from './MapPins'
import MapDecor from './MapDecor'
import './parisMap.css'

/* The treasure map: Paris on parchment, ink outline, the Seine, a few landmarks, and an X for every café.
   Drag to move, pinch or use the buttons to zoom. Pins are plain buttons placed over the map so they stay
   the same size and easy to tap at every zoom level. Visited cafés get an olive wax stamp. */

const BASE_W = 900
const PU = BASE_W / WORLD.w // pixels per map unit at zoom 1
const BASE_H = WORLD.h * PU
const K_MAX = 7
const px = (x, y) => ({ x: (x - WORLD.minX) * PU, y: (y - WORLD.minY) * PU })

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

// A small ink doodle for each landmark, drawn around (0,0) in roughly +-10 units
const DOODLES = {
  eiffel: 'M-6 11L0-14 6 11M-4 4H4M-3-4H3M-6 11H6',
  arc: 'M-8 8V-4h16V8M-4 8V1a4 4 0 0 1 8 0V8M-8-4H8',
  notredame: 'M-8 6V-3h4V6M4 6V-3h4V6M-8-3l2-3 2 3M4-3l2-3 2 3M-4 1H4',
  sacrecoeur: 'M-8 8H8M-6 8V2M6 8V2M-5 2a5 5 0 0 1 10 0M-1-3a1.6 1.6 0 0 1 2 0M0-5V-3',
  louvre: 'M-9 7L0-7 9 7ZM-5 7L0-1 5 7',
  bastille: 'M-1.6 9V-9M1.6 9V-9M-4 9H4M0-9V-13M-2-11H2',
}

export default function ParisMap({ cafes, stamped, mode, selectedId, onSelect }) {
  const boxRef = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [view, setView] = useState({ k: 1, tx: 0, ty: 0 })
  const viewRef = useRef(view)
  const pointers = useRef(new Map())
  const gesture = useRef(null)
  const inited = useRef(false)

  const kMin = size.w ? Math.min(size.w / BASE_W, size.h / BASE_H) : 0.3

  // café positions in screen-independent map pixels
  const pins = useMemo(() => cafes.map((c) => ({ c, ...px(project(c.lat, c.lng).x, project(c.lat, c.lng).y) })), [cafes])

  // keep the map from being dragged away completely, and center it if it is smaller than the box
  const clampView = useCallback((v, s = size) => {
    const k = clamp(v.k, kMin, K_MAX)
    const mw = BASE_W * k, mh = BASE_H * k, m = 60
    const tx = mw <= s.w ? (s.w - mw) / 2 : clamp(v.tx, s.w - mw - m, m)
    const ty = mh <= s.h ? (s.h - mh) / 2 : clamp(v.ty, s.h - mh - m, m)
    return { k, tx, ty }
  }, [kMin, size])

  const apply = useCallback((v) => { const nv = clampView(v); viewRef.current = nv; setView(nv) }, [clampView])

  // measure the box
  useEffect(() => {
    const el = boxRef.current
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // frame some pins (with some of the city around them)
  const fitPins = useCallback((list) => {
    if (!size.w || list.length === 0) return
    const xs = list.map((p) => p.x), ys = list.map((p) => p.y)
    const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys)
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2
    const tw = Math.max(bw * 1.7, 26 * PU), th = Math.max(bh * 1.7, 26 * PU * (size.h / size.w))
    const k = clamp(Math.min(size.w / tw, size.h / th), kMin, K_MAX)
    apply({ k, tx: size.w / 2 - cx * k, ty: size.h / 2 - cy * k })
  }, [size, kMin, apply])
  const fitCafes = useCallback(() => fitPins(pins), [fitPins, pins])

  useEffect(() => {
    if (size.w && !inited.current) { inited.current = true; apply({ k: kMin, tx: 0, ty: 0 }) } // start on all of Paris
  }, [size, kMin, apply])

  // choosing a café also nudges the map so the pin is not hidden behind the card at the bottom
  const select = (id, x, y) => {
    const v = viewRef.current
    const sx = v.tx + x * v.k, sy = v.ty + y * v.k
    const top = 70, bottom = size.h - 230
    if (id !== selectedId && (sy < top || sy > bottom || sx < 24 || sx > size.w - 24)) {
      apply({ k: v.k, tx: v.tx + (size.w / 2 - sx), ty: v.ty + (Math.max(top, (top + bottom) / 2) - sy) })
    }
    onSelect(id)
  }

  const showAll = () => apply({ k: kMin, tx: 0, ty: 0 })

  const zoomAt = useCallback((factor, cx, cy) => {
    const v = viewRef.current
    const k = clamp(v.k * factor, kMin, K_MAX)
    const wx = (cx - v.tx) / v.k, wy = (cy - v.ty) / v.k
    apply({ k, tx: cx - wx * k, ty: cy - wy * k })
  }, [kMin, apply])

  // mouse wheel / trackpad (needs a non-passive listener so the page does not scroll)
  useEffect(() => {
    const el = boxRef.current
    const onWheel = (e) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(Math.exp(-e.deltaY * 0.0016), e.clientX - r.left, e.clientY - r.top)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  // one finger / mouse drags, two fingers pinch
  const snapshot = () => {
    const pts = [...pointers.current.values()]
    const v = viewRef.current
    if (pts.length === 1) gesture.current = { type: 'pan', x: pts[0].x, y: pts[0].y, ...v }
    else if (pts.length >= 2) {
      const [a, b] = pts
      gesture.current = { type: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y) || 1, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, ...v }
    } else gesture.current = null
  }
  const local = (e) => { const r = boxRef.current.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  const onPointerDown = (e) => {
    boxRef.current.setPointerCapture?.(e.pointerId)
    pointers.current.set(e.pointerId, local(e))
    snapshot()
  }
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, local(e))
    const g = gesture.current
    if (!g) return
    const pts = [...pointers.current.values()]
    if (g.type === 'pan' && pts.length === 1) {
      apply({ k: g.k, tx: g.tx + (pts[0].x - g.x), ty: g.ty + (pts[0].y - g.y) })
    } else if (g.type === 'pinch' && pts.length >= 2) {
      const [a, b] = pts
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1
      const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2
      const k = clamp(g.k * (d / g.d), kMin, K_MAX)
      const wx = (g.cx - g.tx) / g.k, wy = (g.cy - g.ty) / g.k
      apply({ k, tx: cx - wx * k, ty: cy - wy * k })
    }
  }
  const onPointerUp = (e) => { pointers.current.delete(e.pointerId); snapshot() }

  // pin positions on screen
  const items = useMemo(() => pins.map((p) => ({ c: p.c, x: view.tx + p.x * view.k, y: view.ty + p.y * view.k, mx: p.x, my: p.y })), [pins, view])

  // sizes that should stay the same on screen, converted to map units
  const u = 1 / (PU * view.k)
  const showLabels = view.k > kMin * 12

  // dotted trail: a nearest-neighbour walk through the cafés, starting in the west
  const trail = useMemo(() => {
    if (mode !== 'explore' || pins.length < 2) return ''
    const left = [...pins].sort((a, b) => a.x - b.x)
    const path = [left.shift()]
    while (left.length) {
      const last = path[path.length - 1]
      left.sort((a, b) => Math.hypot(a.x - last.x, a.y - last.y) - Math.hypot(b.x - last.x, b.y - last.y))
      path.push(left.shift())
    }
    return 'M' + path.map((p) => `${(p.x / PU + WORLD.minX).toFixed(2)} ${(p.y / PU + WORLD.minY).toFixed(2)}`).join('L')
  }, [pins, mode])

  const woods = [
    { t: 'Bois de Boulogne', ...project(48.8625, 2.2490) },
    { t: 'Bois de Vincennes', ...project(48.8290, 2.4390) },
  ]

  return (
    <div
      ref={boxRef}
      className="pm-box"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="pm-paper" />
      <div className="pm-map" style={{ width: BASE_W, height: BASE_H, transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.k})` }}>
        <svg viewBox={WORLD_VIEWBOX} width={BASE_W} height={BASE_H} aria-hidden="true">
          <defs>
            <filter id="pm-rough" x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="fractalNoise" baseFrequency=".22" numOctaves="2" seed="5" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale=".5" />
            </filter>
            <clipPath id="pm-clip"><path d={OUTLINE_D} /></clipPath>
          </defs>
          <path d={OUTLINE_D} fill="#efdcad" opacity=".85" />
          <g clipPath="url(#pm-clip)">
            <path d={SEINE_D} fill="none" stroke="#6d8a93" strokeWidth={8 * u} strokeLinecap="round" opacity=".85" />
            <path d={SEINE_D} fill="none" stroke="#a9c1c4" strokeWidth={3.2 * u} strokeLinecap="round" opacity=".95" />
            {ISLANDS.map((i, n) => (
              <ellipse key={n} cx={i.x} cy={i.y} rx={i.rx} ry={i.ry} transform={`rotate(${i.rot} ${i.x} ${i.y})`} fill="#e9cf96" stroke="#3b2410" strokeWidth={1 * u} />
            ))}
          </g>
          <path d={OUTLINE_D} fill="none" stroke="#6b4a26" strokeWidth={7 * u} opacity=".16" />
          <path d={OUTLINE_D} fill="none" stroke="#3b2410" strokeWidth={2.2 * u} strokeLinejoin="round" filter="url(#pm-rough)" />
          {woods.map((w) => (
            <text key={w.t} x={w.x} y={w.y} textAnchor="middle" fontFamily="Parisienne, cursive" fontSize={15 * u} fill="#5a3a1a" opacity=".6">{w.t}</text>
          ))}
          {LANDMARKS.map((l) => (
            <g key={l.id} transform={`translate(${l.x} ${l.y}) scale(${0.9 * u})`} fill="none" stroke="#3b2410" strokeWidth={1.4 / 0.9} strokeLinecap="round" strokeLinejoin="round" opacity=".8">
              <path d={DOODLES[l.id]} />
            </g>
          ))}
          {trail && <path d={trail} fill="none" stroke="#8a2b1c" strokeWidth={1.8 * u} strokeDasharray={`${1.2 * u} ${5 * u}`} strokeLinecap="round" opacity=".8" />}
        </svg>
      </div>

      <MapPins
        items={items}
        stamped={stamped}
        mode={mode}
        selectedId={selectedId}
        showLabels={showLabels}
        onCluster={(members) => fitPins(members.map((m) => ({ x: m.mx, y: m.my })))}
        onSelect={(id, it) => select(id, it.mx, it.my)}
      />
      <MapDecor onZoomIn={() => zoomAt(1.6, size.w / 2, size.h / 2)} onZoomOut={() => zoomAt(1 / 1.6, size.w / 2, size.h / 2)} onFit={fitCafes} onAll={showAll} />
    </div>
  )
}
