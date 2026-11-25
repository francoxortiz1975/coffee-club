import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { copy } from '../lib/landingCopy'
import { toLines } from '../lib/textLines'
import CafeScreenMock from '../components/CafeScreenMock'
import RequestBox from '../components/RequestBox'

// Everything below the opening screen, in the same hang-tag language: grey paper, brown ink, heavy bars that lay
// themselves, text that comes up from behind an edge. Each piece plays once when it scrolls into view.
const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function useSeen() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(reduced)
  useEffect(() => {
    if (seen) return undefined
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: '0px 0px -12% 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen]
}

function Bar({ seen, thick = true, delay = 0, color = '#2a1a10' }) {
  return <span className="block origin-left" style={{ height: thick ? 6 : 2, background: color, transform: `scaleX(${seen ? 1 : 0})`, transition: `transform 1.1s ${EASE} ${delay}ms` }} />
}
function Up({ seen, delay = 0, children, className = '' }) {
  return (
    <span className={`block overflow-hidden ${className}`} style={{ paddingBottom: '0.1em', marginBottom: '-0.1em' }}>
      <span className="block" style={{ transform: `translateY(${seen ? 0 : 112}%)`, transition: `transform 1s ${EASE} ${delay}ms` }}>{children}</span>
    </span>
  )
}

const STEPS = [
  ['01', copy.en.panels.discover.title, copy.en.panels.discover.body],
  ['02', copy.en.panels.invite.title, 'Create a beautiful invitation with a date and a name. Send it in one tap.'],
  ['03', 'Collect', 'Save souvenirs of each café and collect beans.'],
]

const STEPS_SHORT = [
  ['01', 'Discover', 'Hand-picked cafés.'],
  ['02', 'Invite', 'A beautiful invitation, in one tap.'],
  ['03', 'Collect', 'Souvenirs and beans.'],
]

function Statement() {
  const [ref, seen] = useSeen()
  return (
    <section ref={ref} className="px-6 pt-0 pb-20 max-w-3xl">
      <p className="text-[clamp(1.6rem,6.4vw,2.7rem)] leading-[1.04] tracking-[-0.045em]">
        <Up seen={seen}>Dive into the world of coffee as you go: the secrets behind each café, its origins, tastes and culture.</Up>
      </p>
    </section>
  )
}

export function Steps({ short = false }) {
  const [ref, seen] = useSeen()
  return (
    <section ref={ref} className="px-6 pb-24 max-w-3xl">
      <p className="text-[11px] font-medium tracking-[0.22em] text-[#4a342a]">HOW IT WORKS</p>
      <div className="mt-3 grid gap-x-10 gap-y-9 md:grid-cols-3">
        {(short ? STEPS_SHORT : STEPS).map(([n, title, body], i) => (
          <div key={n}>
            <Bar seen={seen} delay={i * 120} />
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-[13px] tracking-[0.12em] text-[#4a342a]">{n}</span>
              <h3 className="text-[1.7rem] leading-none tracking-[-0.045em]"><Up seen={seen} delay={i * 120 + 120}>{title}</Up></h3>
            </div>
            <p className="mt-3 text-[17px] leading-snug tracking-[-0.02em] text-[#3d2b1f]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// The café screen, in a phone, on a dark band: this is what you get inside the app.
export function Screen() {
  const [ref, seen] = useSeen()
  return (
    <section ref={ref} className="px-6 py-24 bg-[#2a1a10]">
      <div style={{ transform: `translateY(${seen ? 0 : 70}px)`, opacity: seen ? 1 : 0, transition: `transform 1.2s ${EASE}, opacity 1s ease` }}>
        {seen ? <CafeScreenMock /> : <div className="mx-auto w-[300px] h-[560px]" />}
      </div>
    </section>
  )
}

export function Cafes() {
  const [ref, seen] = useSeen()
  const list = cafes.filter((c) => c.ciudad === 'Paris' && c.fotos?.[0])
  return (
    <section ref={ref} className="px-6 py-24 max-w-5xl">
      <Bar seen={seen} />
      <h2 className="mt-4 text-[clamp(1.9rem,7.4vw,3.2rem)] leading-[1.02] tracking-[-0.05em]"><Up seen={seen}>The first cafés in Paris.</Up></h2>
      <div className="mt-10 -mx-6 px-6 scroll-pl-6 flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
        {list.map((c, i) => (
          <article key={c.id} className="shrink-0 w-[76%] snap-start md:w-auto">
            <div className="aspect-[4/5] overflow-hidden bg-[#2a1a10]/10">
              <img src={c.fotos[0]} alt={c.nombre} loading="lazy" className="w-full h-full object-cover" style={{ transform: `scale(${seen ? 1 : 1.12})`, transition: `transform 1.4s ${EASE} ${i * 150}ms` }} />
            </div>
            <Bar seen={seen} thick={false} delay={i * 150 + 300} />
            <h3 className="mt-3 text-[1.45rem] leading-[1.05] tracking-[-0.045em]">{c.nombre}</h3>
            <p className="mt-1 text-[13px] tracking-[0.12em] text-[#4a342a]">{c.barrio.toUpperCase()}</p>
            <p className="mt-2 text-[16px] leading-snug tracking-[-0.02em] text-[#3d2b1f]">{toLines(c.descripcion)[0] || c.historia}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Join({ title = 'Save your spot in the club.', sub = 'Drop your email and we will let you in when your invitation is ready.' }) {
  const [ref, seen] = useSeen()
  return (
    <section ref={ref} id="request" className="px-6 pt-8 pb-24 max-w-md">
      <Bar seen={seen} />
      <h2 className="mt-4 text-[clamp(1.9rem,7.4vw,3rem)] leading-[1.02] tracking-[-0.05em]"><Up seen={seen}>{title}</Up></h2>
      <p className="mt-3 text-[17px] leading-snug tracking-[-0.02em] text-[#3d2b1f]">{sub}</p>
      <RequestBox id="inv-email-bottom" />
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#2a1a10] text-[#f5f0e8]/80 px-6 py-8 text-[13px]">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <p className="flex gap-5"><Link to="/privacy" className="underline underline-offset-4">Privacy</Link><a href="mailto:hola@sumayclub.app" className="underline underline-offset-4">Contact</a></p>
        </div>
        <p className="mt-6 text-center text-[11px] font-medium tracking-[0.22em] text-[#f5f0e8]/85">SUMAYCLUB.APP</p>
    </footer>
  )
}

export default function Sections({ pull = 0 }) {
  return (
    <div className="relative z-10 bg-[#e3e3e0] text-[#2a1a10]" style={{ marginTop: -pull, fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <Statement />
      <Steps />
      <Screen />
      <Cafes />
      <Join />
      <Footer />
    </div>
  )
}
