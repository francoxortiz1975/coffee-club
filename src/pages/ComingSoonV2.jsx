import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Steps, Screen, Cafes, Join, Footer } from './ComingSoonSections'
import './comingSoon.css'

// PROPOSAL (open it at /landing-v2): one idea per screen. The opening is only the name; scrolling lifts it away and the
// pitch takes its place alone; then the app, three short steps, the cafés as a carousel, and the invitation at the end.
const clamp = (n) => Math.max(0, Math.min(1, n))
const stage = (p, a, b) => { const t = clamp((p - a) / (b - a)); return 1 - Math.pow(1 - t, 4) }
const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function Bar({ t, thick = true }) {
  return <span className="block origin-left" style={{ height: thick ? 'calc(var(--u) * 0.12)' : 'max(2px, calc(var(--u) * 0.03))', background: '#2a1a10', transform: `scaleX(${t})` }} />
}
function Rise({ t, children, className = '' }) {
  return (
    <span className={`block overflow-hidden ${className}`} style={{ paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
      <span className="block will-change-transform" style={{ transform: `translateY(${(1 - t) * 112}%)` }}>{children}</span>
    </span>
  )
}

export default function ComingSoonV2() {
  const wrapRef = useRef(null)
  const textRef = useRef(null)
  const still = useState(reduced)[0]
  const [p, setP] = useState(still ? 1 : 0)
  const [pull, setPull] = useState(0)
  const [showBtn, setShowBtn] = useState(false)

  useEffect(() => { document.title = 'Sumay Coffee Club' }, [])
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = wrapRef.current.offsetHeight - window.innerHeight
      if (!still) setP(max > 0 ? clamp(window.scrollY / max) : 1)
      setShowBtn(window.scrollY > 240)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [still])

  // The last scene leaves empty screen under its text; the next section is pulled up to sit a breath below it.
  useLayoutEffect(() => {
    const measure = () => { const el = textRef.current; if (el) setPull(Math.max(0, window.innerHeight - (el.offsetTop + el.offsetHeight) - 56)) }
    measure()
    const ro = new ResizeObserver(measure); ro.observe(textRef.current)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  const out = still ? 1 : stage(p, 0.36, 0.5)         // scene one lifts away
  const goTo = () => document.getElementById('request')?.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' })

  return (
    <>
      <div ref={wrapRef} style={{ height: still ? '100dvh' : '240dvh', background: '#e3e3e0' }}>
        <main className="sticky top-0 h-dvh overflow-hidden text-[#2a1a10]" style={{ fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif", '--u': 'clamp(2.7rem, 12.5vw, 4.6rem)' }}>
          {/* scene one: just the name */}
          {!still && (
            <section className="absolute inset-x-0 top-0 px-6 pt-[13dvh]" style={{ opacity: 1 - out, transform: `translateY(${-out * 70}px)` }}>
              <div className="mx-auto w-full max-w-4xl">
              <Bar t={stage(p, 0.02, 0.1)} />
              <h1 className="mt-4 font-normal text-[length:var(--u)] leading-[0.94] tracking-[-0.055em]">
                <Rise t={stage(p, 0.06, 0.16)}>Sumay</Rise>
                <Rise t={stage(p, 0.12, 0.22)}>Coffee Club.</Rise>
              </h1>
              <div className="mt-4"><Bar t={stage(p, 0.2, 0.28)} thick={false} /></div>
              <Rise t={stage(p, 0.25, 0.34)} className="mt-3 text-[clamp(1rem,4.2vw,1.3rem)] tracking-[-0.03em] text-[#4a342a]">Starting in Paris.</Rise>
              </div>
            </section>
          )}
          {/* scene two: the pitch, alone */}
          <section className="absolute inset-x-0 top-0 px-6 pt-[13dvh]">
            <div ref={textRef} className="mx-auto w-full max-w-4xl">
              <Bar t={still ? 1 : stage(p, 0.5, 0.58)} />
              <p className="mt-4 text-[clamp(1.9rem,7.4vw,3.4rem)] leading-[1.02] tracking-[-0.05em] max-w-3xl">
                <Rise t={still ? 1 : stage(p, 0.54, 0.72)}>Dive into the world of coffee as you go: the secrets behind each café, its origins, tastes and culture.</Rise>
              </p>
            </div>
          </section>
          {!still && <p className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-[11px] font-medium tracking-[0.22em] text-[#4a342a]" style={{ opacity: 1 - clamp(p / 0.04) }} aria-hidden="true">SCROLL TO ACCESS<span className="cs-cue block mx-auto mt-2 w-px h-9 bg-[#4a342a]/70 origin-top" /></p>}
        </main>
      </div>

      <div className="relative z-10 bg-[#e3e3e0] text-[#2a1a10]" style={{ marginTop: -pull, fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <div className="h-16" />
        <Screen />
        <div className="h-24" />
        <Steps short />
        <Cafes />
        <Join title="Invitations open for the app." />
        <Footer />
      </div>

      <button type="button" onClick={goTo} className="fixed top-4 right-4 z-30 min-h-11 px-4 bg-[#2a1a10] text-[#f5f0e8] text-[14px] tracking-[-0.01em] shadow-lg active:opacity-80" style={{ opacity: showBtn ? 1 : 0, pointerEvents: showBtn ? 'auto' : 'none', transform: `translateY(${showBtn ? 0 : -8}px)`, transition: 'opacity .4s ease, transform .4s ease', fontFamily: "'Geist Variable', system-ui, sans-serif" }}>
        Request an invitation
      </button>
    </>
  )
}
