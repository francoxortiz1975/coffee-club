import { useEffect, useRef, useState } from 'react'

// All Geist, nothing else (already bundled for the app).
// The public face of sumayclub.app for now: a very quiet "we open soon" screen. The full landing page lives on at /landing-full.
const OPENS = { date: '2026-11-24', label: '18:00 CET' }   // Paris time (CET in winter)

function parisToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date()) // YYYY-MM-DD
}
function days() { return Math.round((Date.parse(OPENS.date) - Date.parse(parisToday())) / 86400000) }
// "Invitations open from tomorrow, Tuesday 24 November." The wording follows the calendar, so it is never out of date.
function inviteLine() {
  const d = days()
  if (d < 0) return 'Invitations are open.'
  const day = new Date(`${OPENS.date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  return `Invitations open from ${d === 1 ? 'tomorrow, ' : d === 0 ? 'today, ' : ''}${day}.`
}

const clamp = (n) => Math.max(0, Math.min(1, n))
const stage = (p, a, b) => { const t = clamp((p - a) / (b - a)); return 1 - Math.pow(1 - t, 4) }   // 0..1, a long soft landing

// A printed bar that draws itself from the left, like a rule being laid on a hang tag.
function Bar({ t, thick = true, color = '#2a1a10' }) {
  return <span className="block origin-left" style={{ height: thick ? 'calc(var(--u) * 0.12)' : 'max(2px, calc(var(--u) * 0.03))', background: color, transform: `scaleX(${t})` }} />
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

  const rise = stage(p, 0.84, 0.98)
  const darkH = 3.2 * rise   // the brown strip is only a sliver at the foot

  return (
    <div ref={wrapRef} style={{ height: reduce ? '100dvh' : '340dvh', background: '#e3e3e0' }}>
      <main className="sticky top-0 h-dvh overflow-hidden text-[#2a1a10]" style={{ fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif", '--u': 'clamp(2.7rem, 12.5vw, 4.6rem)' }}>
        <section className="absolute inset-x-0 top-0 flex flex-col justify-end px-6 pb-8" style={{ height: `${100 - darkH}%`, background: '#e3e3e0' }}>
          <Bar t={stage(p, 0.04, 0.16)} />
          <h1 className="mt-4 font-normal text-[length:var(--u)] leading-[0.94] tracking-[-0.055em]">
            <Rise t={stage(p, 0.12, 0.26)}>Sumay,</Rise>
            <Rise t={stage(p, 0.2, 0.34)}>the Coffee Club.</Rise>
          </h1>
          <div className="mt-4"><Bar t={stage(p, 0.34, 0.44)} thick={false} /></div>
          <Rise t={stage(p, 0.4, 0.52)} className="mt-3 text-[clamp(1rem,4.2vw,1.3rem)] tracking-[-0.03em] text-[#4a342a]">Starting in Paris.</Rise>
          <div className="mt-6 text-[clamp(1.3rem,5.6vw,1.9rem)] leading-[1.02] tracking-[-0.045em]">
            <Rise t={stage(p, 0.6, 0.76)}>{inviteLine()}</Rise>
            <Rise t={stage(p, 0.66, 0.82)} className="mt-1 text-[0.65em] text-[#4a342a]">{OPENS.label}</Rise>
          </div>
          <p className="absolute left-0 right-0 top-6 text-center text-[11px] font-medium tracking-[0.22em] text-[#4a342a]" style={{ opacity: 1 - clamp(p / 0.06) }} aria-hidden="true">SCROLL</p>
        </section>

        <section className="absolute inset-x-0 bottom-0 flex items-center justify-center text-[#f5f0e8]" style={{ height: `${darkH}%`, background: '#2a1a10', overflow: 'hidden' }}>
          <p className="text-[11px] font-medium tracking-[0.22em] text-[#f5f0e8]/85" style={{ opacity: stage(p, 0.9, 1) }}>SUMAYCLUB.APP</p>
        </section>
      </main>
    </div>
  )
}
