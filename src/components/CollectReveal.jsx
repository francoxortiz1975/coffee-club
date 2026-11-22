import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import '@fontsource/finger-paint/latin-400.css'
import cafes from '../data/cafes.json'
import { useVisitas } from '../context/VisitasContext'
import { paintFoil } from '../lib/foil'
import { beanSVG, cupSVG } from '../lib/beanArt'
import { loyaltyCopyEs as copy } from '../lib/loyaltyCopy'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const SIZE = 220

// Plays once when a café is marked as visited: scratch the kraft foil to reveal the new bean.
function Reveal({ fresh, onClose }) {
  const cafe = cafes.find((c) => c.id === fresh.cafeId)
  const isCup = fresh.n % 10 === 0
  const [done, setDone] = useState(reduced())
  const canvasRef = useRef(null)
  const [art] = useState(() => (isCup ? cupSVG() : beanSVG(fresh.n * 7 + 3, -30)))

  useEffect(() => {
    if (done) return
    const cv = canvasRef.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    cv.width = SIZE * dpr; cv.height = SIZE * dpr
    const ctx = cv.getContext('2d')
    let cancelled = false
    ;(document.fonts ? document.fonts.load('40px "Finger Paint"').catch(() => {}) : Promise.resolve()).then(() => {
      if (cancelled) return
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      paintFoil(ctx, cv.width, cv.height, dpr, { lines: ['scratch', isCup ? 'your cup' : 'your bean'], family: '"Finger Paint"', radius: 28 * dpr })
    })
    let down = false, last = null, tick = 0
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * cv.width, ((e.clientY - r.top) / r.height) * cv.height] }
    const stroke = (a, b) => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = 34 * dpr
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke()
      ctx.globalCompositeOperation = 'source-over'
    }
    const cleared = () => {
      const d = ctx.getImageData(0, 0, cv.width, cv.height).data
      let n = 0, t = 0
      for (let i = 3; i < d.length; i += 64) { t++; if (d[i] < 40) n++ }
      return n / t
    }
    const move = (e) => {
      if (!down) return
      const p = pos(e); stroke(last, p); last = p
      if (++tick % 6 === 0 && cleared() > 0.5) { down = false; setDone(true) }
    }
    const start = (e) => { down = true; last = pos(e); cv.setPointerCapture?.(e.pointerId); stroke(last, last) }
    const end = () => { down = false }
    cv.addEventListener('pointerdown', start); cv.addEventListener('pointermove', move)
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end)
    return () => { cancelled = true; cv.removeEventListener('pointerdown', start); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerup', end); cv.removeEventListener('pointercancel', end) }
  }, [done, isCup])

  useEffect(() => {
    if (done && !reduced()) confetti({ particleCount: 70, spread: 70, origin: { y: 0.55 }, colors: ['#b8d04a', '#f5f0e8', '#6b4c3b'], disableForReducedMotion: true })
  }, [done])

  const left = 10 - (fresh.n % 10 || 10)
  const line = isCup ? copy.c10 : left === 0 ? copy.c9 : fresh.n % 10 === 1 ? copy.c1 : copy.cN.replace('{n}', fresh.n % 10).replace('{r}', left)

  return (
    <div role="dialog" aria-modal="true" aria-label="Collect your bean" className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-[#1b110a]/80 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-3xl bg-[#f5f0e8] p-6 text-center shadow-2xl">
        <p className="font-display font-bold text-cafe-dark text-lg">{cafe?.nombre || 'New visit'}</p>
        <p className="text-sm text-cafe-accent mt-0.5">{done ? line : 'Scratch to collect your bean'}</p>
        <div className="relative mx-auto my-5 rounded-[28px] bg-[#6b4c3b]/15 flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
          <div className="w-28 h-28 [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: art }} />
          {!done && <canvas ref={canvasRef} className="absolute inset-0 rounded-[28px] touch-none" style={{ width: SIZE, height: SIZE }} />}
        </div>
        {done ? (
          <button onClick={onClose} className="min-h-11 px-8 rounded-full bg-cafe-dark text-[#b8d04a] text-sm font-bold active:scale-95 transition-transform">Done</button>
        ) : (
          <button onClick={() => setDone(true)} className="min-h-11 px-4 text-sm text-cafe-accent underline underline-offset-4">Skip</button>
        )}
      </div>
    </div>
  )
}

export default function CollectReveal() {
  const { fresh, clearFresh } = useVisitas()
  return fresh ? <Reveal key={fresh.key} fresh={fresh} onClose={clearFresh} /> : null
}
