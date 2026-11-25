import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Sections from './ComingSoonSections'
import './comingSoon.css'

// All Geist, nothing else (already bundled for the app).
// The public face of sumayclub.app. The full landing page of before lives on at /landing-full.

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
// is told. With reduced motion everything is simply there.
export default function ComingSoon() {
  const wrapRef = useRef(null)
  const textRef = useRef(null)
  const [pull, setPull] = useState(0)   // how far the next section is pulled up under the opening text
  const reduce = useState(() => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)[0]
  const [p, setP] = useState(reduce ? 1 : 0)

  useEffect(() => { document.title = 'Sumay Coffee Club' }, [])
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

  // The opening screen is pinned and its text sits at the top, which leaves the lower part of the screen empty. The next
  // section is pulled up so it starts a fixed breath under the text, whatever the screen size.
  useLayoutEffect(() => {
    const measure = () => {
      const el = textRef.current
      if (!el) return
      const bottom = el.offsetTop + el.offsetHeight
      setPull(Math.max(0, window.innerHeight - bottom - 56))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(textRef.current)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure).catch(() => {})
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])

  return (
    <>
    <div ref={wrapRef} style={{ height: reduce ? '100dvh' : '340dvh', background: '#e3e3e0' }}>
      <main className="sticky top-0 h-dvh overflow-hidden text-[#2a1a10]" style={{ fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif", '--u': 'clamp(2.7rem, 12.5vw, 4.6rem)' }}>
        <section className="absolute inset-x-0 top-0 flex flex-col justify-start px-6 pt-[13dvh] pb-8" style={{ height: '100%', background: '#e3e3e0' }}>
          <div ref={textRef} className="mx-auto w-full max-w-4xl">
          <Bar t={stage(p, 0.04, 0.16)} />
          <h1 className="mt-4 font-normal text-[length:var(--u)] leading-[0.94] tracking-[-0.055em]">
            <Rise t={stage(p, 0.12, 0.26)}>Sumay</Rise>
            <Rise t={stage(p, 0.2, 0.34)}>Coffee Club.</Rise>
          </h1>
          <div className="mt-4"><Bar t={stage(p, 0.34, 0.44)} thick={false} /></div>
          <Rise t={stage(p, 0.4, 0.52)} className="mt-3 text-[clamp(1rem,4.2vw,1.3rem)] tracking-[-0.03em] text-[#4a342a]">Starting in Paris.</Rise>
          <Rise t={stage(p, 0.5, 0.68)} className="mt-5 text-[clamp(1.3rem,5.6vw,1.9rem)] leading-[1.02] tracking-[-0.045em]">Invitations open for the app.</Rise>
          </div>
          <p className="absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center text-[11px] font-medium tracking-[0.22em] text-[#4a342a]" style={{ opacity: 1 - clamp(p / 0.04) }} aria-hidden="true">SCROLL TO ACCESS<span className="cs-cue block mx-auto mt-2 w-px h-9 bg-[#4a342a]/70 origin-top" /></p>
        </section>

      </main>
    </div>
    <Sections pull={pull} />
    </>
  )
}
