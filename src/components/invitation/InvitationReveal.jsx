import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import '@fontsource/pinyon-script/latin-400.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import './invitation.css'

/* The invitation reveal: a cream silk envelope sealed with an olive wax stamp.
   The stamp is the scratch surface: rub it away (it leaves traces), the rest vanishes, the flap opens,
   the letter rises, confetti, and the letter takes the screen.
   Phases: idle -> vanish -> open -> rise -> reveal -> done. */

const W = 300
const H = 204
const FLAP_H = 140

// Flap outline (rounded tip, like a euro flap). Front face: apex points down. Liner face is the same shape mirrored.
const FLAP_FRONT = `M0 0 L${W} 0 L${W / 2 + 22} 118 Q${W / 2} 142 ${W / 2 - 22} 118 Z`
const FLAP_BACK = `M0 ${FLAP_H} L${W} ${FLAP_H} L${W / 2 + 22} 22 Q${W / 2} -2 ${W / 2 - 22} 22 Z`
const LINER = `M11 ${FLAP_H - 3} L${W - 11} ${FLAP_H - 3} L${W / 2 + 17} 33 Q${W / 2} 16 ${W / 2 - 17} 33 Z`

const TEXT_CHUNK = 'ivr'

function SilkDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${TEXT_CHUNK}-fd`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".008 1.4" numOctaves="3" seed="3" />
          <feColorMatrix values="0 0 0 0 .42  0 0 0 0 .30  0 0 0 0 .16  0 0 0 1.1 -.28" />
        </filter>
        <filter id={`${TEXT_CHUNK}-fl`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".01 1.9" numOctaves="3" seed="9" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 .97  0 0 0 0 .88  0 0 0 1 -.2" />
        </filter>
        <filter id={`${TEXT_CHUNK}-blur`} x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id={`${TEXT_CHUNK}-wob`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
        </filter>
        <filter id={`${TEXT_CHUNK}-emb`}>
          <feDropShadow dx="-.8" dy="-.9" stdDeviation=".4" floodColor="#d8e28a" floodOpacity=".7" />
          <feDropShadow dx=".9" dy="1.1" stdDeviation=".5" floodColor="#1d2308" floodOpacity=".8" />
        </filter>
        <radialGradient id={`${TEXT_CHUNK}-wg`} cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor="#8e9a42" /><stop offset=".45" stopColor="#626d27" /><stop offset="1" stopColor="#3a4316" />
        </radialGradient>
        <radialGradient id={`${TEXT_CHUNK}-wd`} cx="50%" cy="50%" r="50%">
          <stop offset=".7" stopColor="#2c3310" stopOpacity="0" /><stop offset="1" stopColor="#2c3310" stopOpacity=".55" />
        </radialGradient>
        <linearGradient id={`${TEXT_CHUNK}-sheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fffaf0" stopOpacity=".7" /><stop offset=".58" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${TEXT_CHUNK}-fg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbf5e6" /><stop offset="1" stopColor="#eadcbc" /></linearGradient>
        <linearGradient id={`${TEXT_CHUNK}-pl`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f1e8d3" /><stop offset="1" stopColor="#dccba6" /></linearGradient>
        <linearGradient id={`${TEXT_CHUNK}-pr`} x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4ecd9" /><stop offset="1" stopColor="#d8c69f" /></linearGradient>
        <linearGradient id={`${TEXT_CHUNK}-pb`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#e6d8b8" /><stop offset="1" stopColor="#fbf4e4" /></linearGradient>
        <linearGradient id={`${TEXT_CHUNK}-ln`} x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#1c4a36" /><stop offset="1" stopColor="#0d2a1d" /></linearGradient>
        <linearGradient id={`${TEXT_CHUNK}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dfae" /><stop offset=".5" stopColor="#c9a15a" /><stop offset="1" stopColor="#ecd49a" />
        </linearGradient>
        <pattern id={`${TEXT_CHUNK}-lat`} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M14 0 L28 14 L14 28 L0 14Z" fill="none" stroke="#d9b878" strokeOpacity=".38" strokeWidth=".7" />
          <circle cx="14" cy="14" r="1" fill="#d9b878" fillOpacity=".5" />
        </pattern>
        <clipPath id={`${TEXT_CHUNK}-body`}><rect width={W} height={H} rx="4" /></clipPath>
        <clipPath id={`${TEXT_CHUNK}-panels`}>
          <path d={`M0 0 L${W / 2} 114 L0 ${H} Z M${W} 0 L${W / 2} 114 L${W} ${H} Z M0 ${H} L${W / 2} 96 L${W} ${H} Z`} />
        </clipPath>
        <clipPath id={`${TEXT_CHUNK}-flapc`}><path d={FLAP_FRONT} /></clipPath>
        <clipPath id={`${TEXT_CHUNK}-flapb`}><path d={FLAP_BACK} /></clipPath>
      </defs>
    </svg>
  )
}

const u = (id) => `url(#${TEXT_CHUNK}-${id})`

// Silk: fine diagonal fibres, a warm shade and a light grain, plus a soft sheen band
function Silk({ w, h, clip }) {
  return (
    <g clipPath={clip} className="iv-silk">
      <g style={{ mixBlendMode: 'multiply' }} opacity=".6">
        <rect x="-120" y="-120" width={w + 240} height={h + 240} transform={`rotate(-33 ${w / 2} ${h / 2})`} filter={u('fd')} />
      </g>
      <g style={{ mixBlendMode: 'soft-light' }} opacity=".9">
        <rect x="-120" y="-120" width={w + 240} height={h + 240} transform={`rotate(-33 ${w / 2} ${h / 2})`} filter={u('fl')} />
        <rect width={w} height={h} fill={u('sheen')} />
      </g>
    </g>
  )
}

function Wax({ size, className, style, pf = TEXT_CHUNK }) {
  const f = (id) => `url(#${pf}-${id})`
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="-50 -50 100 100" aria-hidden="true">
      <ellipse cx="2" cy="7" rx="42" ry="38" fill="#000" opacity=".45" style={{ filter: 'blur(4px)' }} />
      <g filter={f('wob')}>
        <circle r="42" fill={f('wg')} />
        <circle r="42" fill={f('wd')} />
      </g>
      <circle r="30" fill="none" stroke="#2f3711" strokeOpacity=".6" strokeWidth="2.4" transform="translate(.8 1)" />
      <circle r="30" fill="none" stroke="#c7d27a" strokeOpacity=".5" strokeWidth="1.6" />
      <g filter={f('emb')}>
        <text y="13" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontSize="42" fontWeight="600" fill="#59641f">S</text>
      </g>
    </svg>
  )
}

// ---- the stamp is the scratch surface -------------------------------------------
// Scratching rubs the wax away and leaves traces on the paper (a faint stain and little flecks).
const STAMP = 112
const FLECKS = ['#6b7829', '#4a5520', '#8e9a42', '#3a4316', '#59641f']

function paintStamp(ctx, S, dpr) {
  const c = S / 2, R = 42 * (S / 104)
  ctx.save(); ctx.scale(dpr, dpr)
  const ph = [0.7, 2.1, 4.0, 5.3]
  const rad = (t) => R * (1 + 0.03 * Math.sin(3 * t + ph[0]) + 0.026 * Math.sin(5 * t + ph[1]) + 0.016 * Math.sin(9 * t + ph[2]) + 0.01 * Math.sin(17 * t + ph[3]))
  ctx.beginPath()
  for (let i = 0; i <= 120; i++) {
    const t = (i / 120) * Math.PI * 2, r = rad(t)
    const x = c + Math.cos(t) * r, y = c + Math.sin(t) * r
    if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y)
  }
  ctx.closePath()
  const g = ctx.createRadialGradient(c - R * 0.3, c - R * 0.44, 0, c - R * 0.1, c - R * 0.1, R * 1.5)
  g.addColorStop(0, '#8e9a42'); g.addColorStop(0.45, '#626d27'); g.addColorStop(1, '#3a4316')
  ctx.fillStyle = g; ctx.fill()
  ctx.save(); ctx.clip()
  const d = ctx.createRadialGradient(c, c, R * 0.7, c, c, R * 1.05)
  d.addColorStop(0, 'rgba(44,51,16,0)'); d.addColorStop(1, 'rgba(44,51,16,.55)')
  ctx.fillStyle = d; ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 220; i++) {
    ctx.globalAlpha = 0.08 + Math.random() * 0.16
    ctx.fillStyle = i % 2 ? '#c7d27a' : '#2c3310'
    ctx.fillRect(c + (Math.random() - 0.5) * 2 * R, c + (Math.random() - 0.5) * 2 * R, 1.2, 1.2)
  }
  ctx.restore()
  const rr = R * 0.715
  ctx.lineWidth = 2.4; ctx.strokeStyle = 'rgba(47,55,17,.6)'
  ctx.beginPath(); ctx.arc(c + 0.8, c + 1, rr, 0, 7); ctx.stroke()
  ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(199,210,122,.5)'
  ctx.beginPath(); ctx.arc(c, c, rr, 0, 7); ctx.stroke()
  ctx.font = `600 ${R}px "Cormorant Garamond", Georgia, serif`; ctx.textAlign = 'center'
  const y = c + R * 0.31
  ctx.fillStyle = 'rgba(216,226,138,.7)'; ctx.fillText('S', c - 0.8, y - 0.9)
  ctx.fillStyle = 'rgba(29,35,8,.8)'; ctx.fillText('S', c + 0.9, y + 1.1)
  ctx.fillStyle = '#59641f'; ctx.fillText('S', c, y)
  ctx.restore()
}

function StampScratch({ onDone }) {
  const ref = useRef(null)
  const trace = useRef(null)
  const state = useRef({ down: false, x: 0, y: 0, n: 0, done: false })

  useEffect(() => {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    for (const c of [ref.current, trace.current]) c.width = c.height = STAMP * dpr
    const ctx = ref.current.getContext('2d', { willReadFrequently: true })
    paintStamp(ctx, STAMP, dpr)
    // repaint once the serif is ready so the monogram never shows in a fallback font
    document.fonts?.load('600 42px "Cormorant Garamond"').then(() => {
      if (state.current.n === 0) { ctx.clearRect(0, 0, ref.current.width, ref.current.height); paintStamp(ctx, STAMP, dpr) }
    }).catch(() => {})
  }, [])

  function pos(e) {
    const r = ref.current.getBoundingClientRect()
    return [((e.clientX - r.left) / r.width) * ref.current.width, ((e.clientY - r.top) / r.height) * ref.current.height]
  }
  function cleared() {
    const c = ref.current, ctx = c.getContext('2d', { willReadFrequently: true })
    const { data } = ctx.getImageData(0, 0, c.width, c.height)
    const R = c.width / 2, lim = (R * 0.8) ** 2
    let total = 0, gone = 0
    for (let y = 0; y < c.height; y += 4) for (let x = 0; x < c.width; x += 4) {
      if ((x - R) ** 2 + (y - R) ** 2 > lim) continue
      total++
      if (data[(y * c.width + x) * 4 + 3] < 30) gone++
    }
    return total ? gone / total : 0
  }
  function scratch(from, to) {
    const c = ref.current, ctx = c.getContext('2d')
    const dpr = c.width / STAMP
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = 17 * dpr
    ctx.beginPath(); ctx.moveTo(from[0], from[1]); ctx.lineTo(to[0], to[1]); ctx.stroke()
    ctx.globalCompositeOperation = 'source-over'
    // traces left on the paper: fine wax crumbs and a few short smears, only where the stamp was
    const t = trace.current.getContext('2d')
    const dx = to[0] - from[0], dy = to[1] - from[1]
    const steps = Math.max(1, Math.floor(Math.hypot(dx, dy) / (2.5 * dpr)))
    const R = c.width / 2
    for (let i = 0; i < steps; i++) {
      const cx = from[0] + (dx * i) / steps, cy = from[1] + (dy * i) / steps
      for (let k = 0; k < 2; k++) {
        if (Math.random() > 0.55) continue
        const a = Math.random() * Math.PI * 2, d = Math.random() * 11 * dpr
        const px = cx + Math.cos(a) * d, py = cy + Math.sin(a) * d
        if ((px - R) ** 2 + (py - R) ** 2 > (R * 0.82) ** 2) continue
        t.fillStyle = FLECKS[Math.floor(Math.random() * FLECKS.length)]
        if (Math.random() < 0.12) {
          const ang = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2, len = (2.5 + Math.random() * 4) * dpr
          t.globalAlpha = 0.3 + Math.random() * 0.25
          t.strokeStyle = t.fillStyle; t.lineWidth = (0.8 + Math.random() * 0.9) * dpr; t.lineCap = 'round'
          t.beginPath(); t.moveTo(px, py); t.lineTo(px + Math.cos(ang) * len, py + Math.sin(ang) * len); t.stroke()
        } else {
          t.globalAlpha = 0.5 + Math.random() * 0.45
          t.beginPath(); t.arc(px, py, (0.35 + Math.random() * 0.9) * dpr, 0, 7); t.fill()
        }
      }
    }
    t.globalAlpha = 1
  }
  function down(e) {
    if (state.current.done) return
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const p = pos(e)
    state.current.down = true; state.current.x = p[0]; state.current.y = p[1]
    scratch(p, [p[0] + 0.1, p[1]])
  }
  function move(e) {
    const s = state.current
    if (!s.down || s.done) return
    const p = pos(e)
    scratch([s.x, s.y], p)
    s.x = p[0]; s.y = p[1]
    if (++s.n % 6 === 0 && cleared() > 0.5) finish()
  }
  function up() { state.current.down = false }
  function finish() {
    if (state.current.done) return
    state.current.done = true
    navigator.vibrate?.(14)
    onDone()
  }

  return (
    <>
      <canvas ref={trace} className="iv-trace" aria-hidden="true" />
      <canvas ref={ref} className="iv-stampc" aria-hidden="true" />
      {/* a generous touch area around the stamp, so a finger that starts a little off it still scratches */}
      <div className="iv-pad" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
    </>
  )
}

// ---- the letter -------------------------------------------------------------
const LP = 'ivl' // the letter carries its own defs so the share image (which copies only the letter) keeps the frame and the stamp
const DECO = (
  <svg className="iv-frame" viewBox="0 0 248 440" fill="none" stroke={`url(#${LP}-gold)`} strokeLinecap="round" aria-hidden="true">
    <rect x="10" y="10" width="228" height="420" strokeWidth="1.2" /><rect x="16" y="16" width="216" height="408" strokeWidth=".5" />
    <path d="M16 62 L62 16 M16 76 L76 16" strokeWidth=".6" /><path d="M232 62 L186 16 M232 76 L172 16" strokeWidth=".6" />
    <path d="M16 378 L62 424 M16 364 L76 424" strokeWidth=".6" /><path d="M232 378 L186 424 M232 364 L172 424" strokeWidth=".6" />
    <path d="M16 38 L38 16 M232 38 L210 16 M16 402 L38 424 M232 402 L210 424" strokeWidth="1.4" />
    <path d="M92 16 L124 40 L156 16" strokeWidth=".9" /><path d="M92 424 L124 400 L156 424" strokeWidth=".9" />
    <rect x="119.5" y="379" width="9" height="9" transform="rotate(45 124 383.5)" strokeWidth=".9" />
  </svg>
)

function LetterDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${LP}-wob`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" />
        </filter>
        <filter id={`${LP}-emb`}>
          <feDropShadow dx="-.8" dy="-.9" stdDeviation=".4" floodColor="#d8e28a" floodOpacity=".7" />
          <feDropShadow dx=".9" dy="1.1" stdDeviation=".5" floodColor="#1d2308" floodOpacity=".8" />
        </filter>
        <radialGradient id={`${LP}-wg`} cx="35%" cy="28%" r="85%">
          <stop offset="0" stopColor="#8e9a42" /><stop offset=".45" stopColor="#626d27" /><stop offset="1" stopColor="#3a4316" />
        </radialGradient>
        <radialGradient id={`${LP}-wd`} cx="50%" cy="50%" r="50%">
          <stop offset=".7" stopColor="#2c3310" stopOpacity="0" /><stop offset="1" stopColor="#2c3310" stopOpacity=".55" />
        </radialGradient>
        <linearGradient id={`${LP}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dfae" /><stop offset=".5" stopColor="#c9a15a" /><stop offset="1" stopColor="#ecd49a" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function dateParts(fecha) {
  if (!fecha) return null
  const d = new Date(fecha + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return null
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
    day: d.getDate(),
    month: d.toLocaleDateString('en-US', { month: 'long' }),
  }
}

function formatTime(h) {
  if (!h) return null
  const [hh, mm] = h.split(':')
  return `${+hh % 12 || 12}:${mm} ${+hh >= 12 ? 'pm' : 'am'}`
}

// Fit the café name to the letter: one line at up to 44px, shrinking for longer names.
// Very long names stop shrinking at 28px and wrap to two lines instead of becoming unreadable.
function useFitName(text) {
  const ref = useRef(null)
  const fit = useCallback(() => {
    const el = ref.current
    if (!el) return
    const box = el.parentElement, cs = getComputedStyle(box)
    const room = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 6 // keeps clear of the gold frame
    el.style.whiteSpace = 'nowrap'
    el.style.fontSize = '44px'
    const natural = el.scrollWidth
    let size = Math.min(44, Math.floor((44 * room) / natural))
    if (size < 28) { size = 30; el.style.whiteSpace = 'normal' }
    el.style.fontSize = `${size}px`
  }, [])
  useLayoutEffect(() => {
    fit()
    document.fonts?.ready.then(fit).catch(() => {})
  }, [fit, text])
  return ref
}

function Letter({ cafe, nombre, receptor, fecha, hora }) {
  const parts = dateParts(fecha)
  const time = formatTime(hora)
  const nameRef = useFitName(cafe.nombre)
  return (
    <div className="iv-letter">
      <LetterDefs />
      {DECO}
      <div className="iv-inner">
        <Wax size={50} className="iv-stampsm" pf={LP} />
        <div className="iv-from">{nombre ? <><b>{nombre}</b> invites you to</> : <>You are invited to</>}</div>
        <div ref={nameRef} className="iv-name" role="heading" aria-level={1}>{cafe.nombre}</div>
        <div className="iv-hair"><i /><u /><i /></div>
        <div className="iv-where">{cafe.barrio}</div>
        {(parts || time) && (
          <div className="iv-when">
            {parts && (
              <div className="iv-date"><span>{parts.weekday}</span><b>{parts.day}</b><span>{parts.month}</span></div>
            )}
            {time && <div className="iv-time">{parts ? <><em>at</em> {time}</> : time}</div>}
          </div>
        )}
        {receptor && <div className="iv-for">For {receptor}</div>}
      </div>
    </div>
  )
}

// ---- the whole reveal ---------------------------------------------------------
// contained: the scene lives inside a smaller box (the landing phone) instead of the whole screen,
// so it sizes itself to that box and keeps its confetti inside it. reserve: pixels kept free below the letter.
export default function InvitationReveal({ cafe, nombre, receptor, fecha, hora, onPhase, onZoom, contained = false, reserve = 260 }) {
  const [phase, setPhase] = useState('idle')
  const [behind, setBehind] = useState(false) // flap has passed vertical: now it sits behind the letter
  const [scale, setScale] = useState(1)
  const [zscale, setZscale] = useState(1.4)
  const [es, setEs] = useState(1) // how much the 300px envelope has to shrink to fit its box
  const rootRef = useRef(null)
  const confRef = useRef(null)
  const canvasRef = useRef(null)
  const [zoom, setZoom] = useState(false) // the letter is blown up to fill the screen
  const timers = useRef([])
  const started = useRef(false)
  const onPhaseRef = useRef(onPhase)
  const onZoomRef = useRef(onZoom)
  useEffect(() => { onPhaseRef.current = onPhase; onZoomRef.current = onZoom })

  useEffect(() => {
    const root = rootRef.current
    const fit = () => {
      const w = root.clientWidth || window.innerWidth, h = root.clientHeight || window.innerHeight
      const e = Math.min(1, (w - 24) / W)
      setEs(e)
      // card scales are in screen pixels, but the frame they live in is already shrunk by e
      setScale(Math.max(0.74, Math.min(1.28, (h - reserve) / 440, (w - 44) / 248)) / e)
      setZscale(Math.max(0.9, Math.min((h - 28) / 440, (w - 20) / 248)) / e)
    }
    fit()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null
    ro?.observe(root)
    window.addEventListener('resize', fit)
    const list = timers.current
    return () => { ro?.disconnect(); window.removeEventListener('resize', fit); list.forEach(clearTimeout) }
  }, [reserve])

  useEffect(() => {
    if (!contained || !canvasRef.current) return undefined
    confRef.current = confetti.create(canvasRef.current, { resize: true, useWorker: false })
    return () => { confRef.current?.reset?.(); confRef.current = null }
  }, [contained])

  const toggleZoom = useCallback(() => {
    setZoom((z) => { onZoomRef.current?.(!z); return !z })
  }, [])
  useEffect(() => {
    if (!zoom) return undefined
    const onKey = (e) => { if (e.key === 'Escape') { setZoom(false); onZoomRef.current?.(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  const at = (ms, fn) => { timers.current.push(setTimeout(fn, ms)) }

  const burst = useCallback(() => {
    const colors = ['#d9b878', '#f3e3b8', '#b8d04a', '#e8c872', '#fff6df', '#c9a45a']
    const base = { colors, shapes: ['circle', 'square'], scalar: 0.9, gravity: 0.85, ticks: 220, disableForReducedMotion: true }
    const fire = (o) => (confRef.current || confetti)(o)
    fire({ ...base, particleCount: 70, spread: 75, origin: { x: 0.5, y: 0.42 }, startVelocity: 42 })
    setTimeout(() => fire({ ...base, particleCount: 40, angle: 62, spread: 55, origin: { x: 0, y: 0.7 } }), 160)
    setTimeout(() => fire({ ...base, particleCount: 40, angle: 118, spread: 55, origin: { x: 1, y: 0.7 } }), 160)
  }, [])

  const start = useCallback(() => {
    if (started.current) return
    started.current = true
    onPhaseRef.current?.('abriendo')
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setBehind(true); setPhase('done'); onPhaseRef.current?.('abierta')
      return
    }
    setPhase('vanish')
    at(380, () => setPhase('open'))
    at(700, () => setBehind(true))
    at(840, burst)
    at(1360, () => setPhase('rise'))
    at(2510, () => setPhase('reveal'))
    at(3610, () => { setPhase('done'); onPhaseRef.current?.('abierta') })
  }, [burst])

  const idle = phase === 'idle'
  const flapOpen = phase !== 'idle' && phase !== 'vanish'

  return (
    <div
      ref={rootRef}
      className={`iv-root ${contained ? 'iv-contained' : ''}`}
      data-phase={phase}
      data-behind={behind}
      data-zoom={zoom}
      style={{ '--cs': scale, '--cz': zscale, '--es': es, '--fy': `${-26 / es}px` }}
    >
      <div className="iv-glow" />
      {contained && <canvas ref={canvasRef} className="iv-conf" aria-hidden="true" />}
      <SilkDefs />

      <div className={`iv-hello ${idle ? '' : 'iv-out'}`}>
        {receptor && (
          <>
            <div className="iv-hello-for">For</div>
            <div className="iv-hello-name">{receptor.toUpperCase()}</div>
          </>
        )}
      </div>

      <div className="iv-frame-box">
        {/* back of the envelope + dark inside */}
        <div className="iv-pc iv-z1">
          <svg viewBox={`0 0 ${W} ${H}`} className="iv-layer" aria-hidden="true">
            <ellipse cx={W / 2 + 6} cy={H + 14} rx={W * 0.5} ry="14" fill="#000" opacity=".6" filter={u('blur')} />
            <g clipPath={u('body')}><rect width={W} height={H} fill="#0a1d14" /></g>
          </svg>
        </div>

        {/* flap: front face is the cream silk, back face is the green liner */}
        <div className={`iv-pc iv-flapw ${behind ? 'iv-z2' : 'iv-z5'}`}>
          <div className="iv-flap" style={{ transform: `rotateX(${flapOpen ? -180 : 0}deg)` }}>
            <svg viewBox={`0 0 ${W} ${FLAP_H}`} className="iv-face" aria-hidden="true">
              <path d={FLAP_FRONT} fill="#000" opacity=".35" transform="translate(0 6)" style={{ filter: 'blur(4px)' }} />
              <path d={FLAP_FRONT} fill={u('fg')} stroke="#f6edd8" strokeWidth="3" strokeLinejoin="round" />
              <Silk w={W} h={FLAP_H} clip={u('flapc')} />
              <path d="M2 1 L172 119 Q150 141 128 119 L298 1" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
            <svg viewBox={`0 0 ${W} ${FLAP_H}`} className="iv-face iv-faceb" aria-hidden="true">
              <path d={FLAP_BACK} fill="#e9dcbd" stroke="#e9dcbd" strokeWidth="3" strokeLinejoin="round" />
              <Silk w={W} h={FLAP_H} clip={u('flapb')} />
              <path d={LINER} fill={u('ln')} />
              <path d={LINER} fill={u('lat')} />
              <path d={LINER} fill="none" stroke="#d9b878" strokeOpacity=".6" strokeWidth=".7" />
            </svg>
          </div>
        </div>

        {/* the letter, clipped so it never shows below the envelope until it takes the screen */}
        <div className="iv-clip iv-z3">
          <div
            className="iv-card"
            {...(phase === 'done'
              ? {
                  role: 'button',
                  tabIndex: 0,
                  'aria-label': zoom ? 'Shrink the invitation' : 'Enlarge the invitation',
                  onClick: toggleZoom,
                  onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleZoom() } },
                }
              : {})}
          >
            <Letter cafe={cafe} nombre={nombre} receptor={receptor} fecha={fecha} hora={hora} />
          </div>
        </div>

        {/* front of the envelope: the three folded panels */}
        <div className="iv-pc iv-z4">
          <svg viewBox={`0 0 ${W} ${H}`} className="iv-layer" aria-hidden="true">
            <g clipPath={u('body')}>
              <path d={`M0 0 L${W / 2} 114 L0 ${H}Z`} fill={u('pl')} />
              <path d={`M${W} 0 L${W / 2} 114 L${W} ${H}Z`} fill={u('pr')} />
              <path d={`M0 ${H} L${W / 2} 96 L${W} ${H}Z`} fill={u('pb')} />
              <path d={`M0 ${H} L${W / 2} 96 L${W} ${H}`} fill="none" stroke="#fff" strokeOpacity=".5" />
              <path d={`M0 ${H} L${W / 2} 96 L${W} ${H}`} fill="none" stroke="#000" strokeOpacity=".14" strokeWidth="2.4" transform="translate(0 -1.6)" />
              <path d={`M0 0 L${W / 2} 114 M${W} 0 L${W / 2} 114`} stroke="#000" strokeOpacity=".12" />
            </g>
            <g clipPath={u('body')}><Silk w={W} h={H} clip={u('panels')} /></g>
            <path d={`M0 0 V${H - 4} Q0 ${H} 4 ${H} H${W - 4} Q${W} ${H} ${W} ${H - 4} V0`} fill="none" stroke="#fff" strokeOpacity=".4" />
            {receptor && (
              <text x={W / 2} y="190" textAnchor="middle" fontFamily="'Pinyon Script', cursive" fontSize="21" fill="#4a3a24" opacity=".85">
                for {receptor}
              </text>
            )}
          </svg>
        </div>

        {/* the wax stamp: scratch it away and it leaves traces on the paper */}
        <div className="iv-stamp">
          <StampScratch onDone={start} />
        </div>

        <div className="iv-sheen" />
      </div>

      <div className={`iv-hint ${idle ? '' : 'iv-out'}`}>
        <div className="iv-hint-text">Scratch the stamp to open</div>
        <button type="button" onClick={start}>or tap here</button>
      </div>
    </div>
  )
}
