import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { copy } from '../lib/landingCopy'
import { toLines } from '../lib/textLines'
import ScratchCard from '../components/ScratchCard'
import RequestBox from '../components/RequestBox'
import '../components/scratchCollect.css'

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
  ['02', copy.en.panels.decide.title, copy.en.panels.decide.body],
  ['03', copy.en.panels.invite.title, copy.en.panels.invite.body],
  ['04', 'Collect', 'Every coffee is a bean on your card. Ten beans make a cup.'],
]

function Statement() {
  const [ref, seen] = useSeen()
  const s = copy.en.statement
  return (
    <section ref={ref} className="px-6 pt-24 pb-20 mx-auto max-w-3xl">
      <Bar seen={seen} />
      <p className="mt-5 text-[clamp(1.9rem,7.4vw,3.2rem)] leading-[1.02] tracking-[-0.05em]">
        <Up seen={seen}>{s.a}{s.hl1}{s.b}{s.hl2}{s.c}</Up>
      </p>
    </section>
  )
}

function Steps() {
  const [ref, seen] = useSeen()
  return (
    <section ref={ref} className="px-6 pb-24 mx-auto max-w-3xl">
      <p className="text-[11px] font-medium tracking-[0.22em] text-[#4a342a]">HOW IT WORKS</p>
      <div className="mt-3 grid gap-x-10 gap-y-9 md:grid-cols-2">
        {STEPS.map(([n, title, body], i) => (
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

function Beans({ onJoin }) {
  const [ref, seen] = useSeen()
  const b = copy.en.beans
  return (
    <section ref={ref} className="scx px-6 py-20 bg-[#2a1a10] text-[#f5f0e8]">
      <div className="mx-auto max-w-md">
        <Bar seen={seen} color="#f5f0e8" />
        <h2 className="mt-4 text-[clamp(1.7rem,7vw,2.4rem)] leading-[1.02] tracking-[-0.05em]"><Up seen={seen}>{b.title}</Up></h2>
        <p className="mt-3 text-[17px] leading-snug tracking-[-0.02em] text-[#f5f0e8]/75">{b.note}</p>
        <div className="mt-10"><ScratchCard copy={b.play} onJoin={onJoin} /></div>
      </div>
    </section>
  )
}

function Cafes() {
  const [ref, seen] = useSeen()
  const list = cafes.filter((c) => c.ciudad === 'Paris' && c.fotos?.[0])
  return (
    <section ref={ref} className="px-6 py-24 mx-auto max-w-5xl">
      <Bar seen={seen} />
      <h2 className="mt-4 text-[clamp(1.9rem,7.4vw,3.2rem)] leading-[1.02] tracking-[-0.05em]"><Up seen={seen}>The first cafés in Paris.</Up></h2>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {list.map((c, i) => (
          <article key={c.id}>
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

function Join() {
  const [ref, seen] = useSeen()
  return (
    <section ref={ref} id="request" className="px-6 pt-8 pb-24 mx-auto max-w-md">
      <Bar seen={seen} />
      <h2 className="mt-4 text-[clamp(1.9rem,7.4vw,3rem)] leading-[1.02] tracking-[-0.05em]"><Up seen={seen}>Save your spot in the club.</Up></h2>
      <p className="mt-3 text-[17px] leading-snug tracking-[-0.02em] text-[#3d2b1f]">Drop your email and we will let you in when your invitation is ready.</p>
      <RequestBox id="inv-email-bottom" />
    </section>
  )
}

export default function Sections() {
  const onJoin = () => document.getElementById('request')?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' })
  return (
    <div className="bg-[#e3e3e0] text-[#2a1a10]" style={{ fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <Statement />
      <Steps />
      <Beans onJoin={onJoin} />
      <Cafes />
      <Join />
      <footer className="bg-[#2a1a10] text-[#f5f0e8]/80 px-6 py-8 text-[13px]">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="tracking-[-0.01em]">Made with shungo in Quito &amp; Paris</p>
          <p className="flex gap-5"><Link to="/privacy" className="underline underline-offset-4">Privacy</Link><a href="mailto:hola@sumayclub.app" className="underline underline-offset-4">Contact</a></p>
        </div>
      </footer>
    </div>
  )
}
