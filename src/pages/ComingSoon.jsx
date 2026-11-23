import { useEffect, useRef, useState } from 'react'

// All Geist, nothing else (already bundled for the app).
// The public face of sumayclub.app for now: a very quiet "we open soon" screen. The full landing page lives on at /landing-full.
const OPENS = { date: '2026-11-24', label: '18:00 CET' }   // Paris time (CET in winter)

function parisToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date()) // YYYY-MM-DD
}
function when() {
  const days = Math.round((Date.parse(OPENS.date) - Date.parse(parisToday())) / 86400000)
  const word = days === 1 ? 'Tomorrow' : days === 0 ? 'Today' : days < 0 ? null : new Date(`${OPENS.date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
  return word ? `${word} · ${OPENS.label}` : 'Now open'
}

const clamp = (n) => Math.max(0, Math.min(1, n))
const stage = (p, a, b) => { const t = clamp((p - a) / (b - a)); return 1 - Math.pow(1 - t, 3) }   // 0..1, easing out

// Scroll to reveal: the page starts as plain plaster. Scrolling writes the name line by line, then the dark half rises
// with the date. With reduced motion everything is simply there.
export default function ComingSoon() {
  const wrapRef = useRef(null)
  const [p, setP] = useState(() => (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 1 : 0))
  const still = p === 1 && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => { document.title = 'Sumay, the Coffee Club' }, [])
  useEffect(() => {
    if (still) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const el = wrapRef.current
      const max = el.offsetHeight - window.innerHeight
      setP(max > 0 ? clamp(window.scrollY / max) : 1)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [still])

  const line = (a, b) => { const t = stage(p, a, b); return { opacity: t, transform: `translateY(${(1 - t) * 26}px)` } }
  const rise = stage(p, 0.6, 0.88)             // the dark half comes up
  const darkH = 42 * rise                       // percent of the screen
  const dateT = stage(p, 0.82, 0.98)

  return (
    <div ref={wrapRef} style={{ height: still ? '100dvh' : '330dvh', background: '#f1f1ee' }}>
      <main className="sticky top-0 h-dvh overflow-hidden text-[#2a1a10]" style={{ fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <section className="absolute inset-x-0 top-0 flex flex-col justify-end px-7 pb-9" style={{ height: `${100 - darkH}%`, background: `#f1f1ee url('/landing/plaster.webp') center ${p * 100}%/cover` }}>
          <h1 className="font-normal tracking-tight leading-[1] text-[clamp(3rem,15vw,5.2rem)]">
            <span className="block" style={line(0.05, 0.22)}>Sumay,</span>
            <span className="block" style={line(0.17, 0.34)}>the Coffee</span>
            <span className="block" style={line(0.29, 0.46)}>Club.</span>
          </h1>
          <p className="text-[clamp(1.1rem,4.6vw,1.5rem)] mt-4 text-[#6b4c3b]" style={line(0.46, 0.6)}>Starting in Paris.</p>
          <p className="absolute left-0 right-0 bottom-7 text-center text-[11px] tracking-[0.22em] text-[#6b4c3b]" style={{ opacity: 1 - clamp(p / 0.08) }} aria-hidden="true">
            SCROLL<span className="block mx-auto mt-2 w-px h-8 bg-[#6b4c3b]/60" />
          </p>
        </section>

        <section className="absolute inset-x-0 bottom-0 text-[#f5f0e8]" style={{ height: `${darkH}%`, background: 'linear-gradient(160deg, #3d2b27, #2a1d1b 70%, #261918)', overflow: 'hidden' }}>
          <div className="h-[42dvh] flex flex-col items-start justify-between px-7 pt-8 pb-8">
          <p className="font-normal tracking-tight text-[clamp(1.8rem,8vw,2.6rem)] leading-tight" style={{ opacity: dateT, transform: `translateY(${(1 - dateT) * 18}px)` }}>{when()}</p>
          <p className="self-center text-[12px] tracking-[0.22em] text-[#f5f0e8]/80" style={{ opacity: dateT }}>SUMAYCLUB.APP</p>
          </div>
        </section>
      </main>
    </div>
  )
}
