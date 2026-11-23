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
const stage = (p, a, b) => { const t = clamp((p - a) / (b - a)); return 1 - Math.pow(1 - t, 4) }   // 0..1, a long soft landing

// A printed bar that draws itself from the left, like a rule being laid on a hang tag.
function Bar({ t, thick = true, color = '#2a1a10' }) {
  return <span className="block origin-left" style={{ height: thick ? 9 : 3, background: color, transform: `scaleX(${t})` }} />
}
// Text that comes up from behind an invisible edge, one line at a time.
function Rise({ t, children, className = '' }) {
  return (
    <span className={`block overflow-hidden ${className}`} style={{ paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
      <span className="block will-change-transform" style={{ transform: `translateY(${(1 - t) * 112}%)` }}>{children}</span>
    </span>
  )
}

// Scroll to reveal: plain plaster first. Scrolling lays the bars and brings the name up line by line, then the dark half
// rises with the date. With reduced motion everything is simply there.
export default function ComingSoon() {
  const wrapRef = useRef(null)
  const reduce = useState(() => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)[0]
  const [p, setP] = useState(reduce ? 1 : 0)

  useEffect(() => { document.title = 'Sumay, the Coffee Club' }, [])
  useEffect(() => {
    if (reduce) return undefined
    let raf = 0
    const update = () => {
      raf = 0
      const max = wrapRef.current.offsetHeight - window.innerHeight
      setP(max > 0 ? clamp(window.scrollY / max) : 1)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [reduce])

  const rise = stage(p, 0.58, 0.86)
  const darkH = 40 * rise

  return (
    <div ref={wrapRef} style={{ height: reduce ? '100dvh' : '340dvh', background: '#f1f1ee' }}>
      <main className="sticky top-0 h-dvh overflow-hidden text-[#2a1a10]" style={{ fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <section className="absolute inset-x-0 top-0 flex flex-col justify-end px-6 pb-8" style={{ height: `${100 - darkH}%`, background: `#f1f1ee url('/landing/plaster.webp') center ${p * 60}%/cover` }}>
          <Bar t={stage(p, 0.04, 0.16)} />
          <h1 className="mt-4 font-normal text-[clamp(2.7rem,12.5vw,4.6rem)] leading-[0.94] tracking-[-0.055em]">
            <Rise t={stage(p, 0.12, 0.26)}>Sumay,</Rise>
            <Rise t={stage(p, 0.2, 0.34)}>the Coffee Club.</Rise>
          </h1>
          <div className="mt-4"><Bar t={stage(p, 0.34, 0.44)} thick={false} /></div>
          <Rise t={stage(p, 0.4, 0.52)} className="mt-3 text-[clamp(1rem,4.2vw,1.3rem)] tracking-[-0.03em] text-[#4a342a]">Starting in Paris.</Rise>
          <div className="mt-3"><Bar t={stage(p, 0.48, 0.58)} /></div>
          <p className="absolute left-0 right-0 top-6 text-center text-[11px] font-medium tracking-[0.22em] text-[#4a342a]" style={{ opacity: 1 - clamp(p / 0.06) }} aria-hidden="true">SCROLL</p>
        </section>

        <section className="absolute inset-x-0 bottom-0 text-[#f5f0e8]" style={{ height: `${darkH}%`, background: 'linear-gradient(160deg, #3d2b27, #2a1d1b 70%, #261918)', overflow: 'hidden' }}>
          <div className="h-[40dvh] flex flex-col justify-between px-6 pt-6 pb-7">
            <div>
              <Bar t={stage(p, 0.8, 0.9)} color="#f5f0e8" />
              <h2 className="mt-3 font-normal text-[clamp(1.7rem,7.6vw,2.5rem)] leading-[0.98] tracking-[-0.05em]">
                <Rise t={stage(p, 0.84, 0.95)}>{when()}</Rise>
              </h2>
            </div>
            <div>
              <Bar t={stage(p, 0.9, 1)} thick={false} color="#f5f0e8" />
              <Rise t={stage(p, 0.93, 1)} className="mt-3 text-[12px] font-medium tracking-[0.2em] text-[#f5f0e8]/85">SUMAYCLUB.APP</Rise>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
