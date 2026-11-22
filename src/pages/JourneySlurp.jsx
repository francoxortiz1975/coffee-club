import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { slurps, chapters } from '../data/journey'
import { getRead, markRead } from '../lib/journeyProgress'
import { ArrowLeftIcon } from '../components/Icons'
import JourneyScene from '../components/JourneyScene'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// A slurp as a short conversation: Sumay says one thing at a time and you tap to carry on.
// Paragraphs become bubbles; a "1. … 2. …" paragraph becomes one bubble per step.
function toBubbles(slurp) {
  const out = [`Let’s talk about this: ${slurp.title}.`]
  for (const p of slurp.body) {
    if (/^1\.\s/.test(p)) p.split(/(?<=[.!?])\s+(?=\d+\.\s)/).forEach((t) => out.push(t))
    else out.push(p)
  }
  return out
}

function Bubbles({ slurp, next }) {
  const bubbles = useState(() => toBubbles(slurp))[0]
  const [shown, setShown] = useState(1)
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)
  const finished = shown >= bubbles.length

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'end' }) }, [shown, typing])

  const more = () => {
    if (typing || finished) return
    if (reduced()) { setShown((n) => n + 1); return }
    setTyping(true)
    setTimeout(() => { setTyping(false); setShown((n) => n + 1) }, 650)
  }

  return (
    <div className="px-4 pt-4 flex flex-col gap-3 pb-6">
      {bubbles.slice(0, shown).map((t, i) => (
        <div key={i} className="flex items-end gap-2 j-in">
          <span className={`shrink-0 w-8 h-8 rounded-full bg-cafe-dark text-[#b8d04a] text-xs font-bold flex items-center justify-center ${i && bubbles.slice(0, shown)[i - 1] !== undefined ? 'opacity-0' : ''}`} aria-hidden="true">S</span>
          <p className="max-w-[82%] bg-[#fffaf0] text-cafe-dark text-base leading-relaxed rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">{t}</p>
        </div>
      ))}
      {typing && (
        <div className="flex items-end gap-2" aria-label="Sumay is typing">
          <span className="shrink-0 w-8 h-8" />
          <span className="bg-[#fffaf0] rounded-2xl rounded-bl-md px-4 py-3.5 shadow-sm flex gap-1.5 j-typing"><i /><i /><i /></span>
        </div>
      )}
      {!finished && !typing && (
        <button onClick={more} className="self-end min-h-11 px-5 rounded-full bg-[#b8d04a] text-[#1f1409] text-sm font-bold rounded-br-md active:scale-95 transition-transform">
          {shown === 1 ? 'Tell me' : 'Go on'}
        </button>
      )}
      {finished && (
        <div className="flex flex-col gap-2 mt-2 j-in">
          <p className="text-center text-sm text-cafe-dark/80">That is this stop. </p>
          {next ? (
            <Link to={`/journey/${next.id}`} className="w-full min-h-12 rounded-full bg-cafe-dark text-[#b8d04a] text-sm font-bold flex items-center justify-center active:scale-[0.98] transition-transform">Next: {next.title} ›</Link>
          ) : null}
          <Link to="/journey" className="w-full min-h-12 rounded-full bg-white/85 text-cafe-dark text-sm font-bold flex items-center justify-center active:scale-[0.98] transition-transform">Back to the road</Link>
        </div>
      )}
      <div ref={endRef} />
    </div>
  )
}

export default function JourneySlurp() {
  const { id } = useParams()
  const navigate = useNavigate()
  const i = slurps.findIndex((l) => l.id === id)
  const slurp = slurps[i]

  useEffect(() => { if (slurp) markRead(slurp.id) }, [slurp])

  if (!slurp) {
    return (
      <div className="px-4 pt-16 text-center">
        <p className="text-cafe-dark font-display font-bold">Slurp not found</p>
        <Link to="/journey" className="inline-block mt-4 text-sm font-semibold text-cafe-accent underline">Back to the journey</Link>
      </div>
    )
  }
  const read = getRead()
  const next = slurps.slice(i + 1).find((l) => !read.has(l.id) && l.id !== slurp.id) || slurps.slice(0, i).find((l) => !read.has(l.id))
  const chapter = chapters.find((c) => c.id === slurp.chapter)

  return (
    <div className="min-h-screen pb-16">
      <JourneyScene chapter={slurp.chapter} />
      <div className="relative z-10">
        <div className="sticky top-0 z-20 flex items-center gap-1 px-2 backdrop-blur bg-black/15" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <button onClick={() => navigate(-1)} aria-label="Back" className="w-11 h-11 flex items-center justify-center text-cafe-dark active:scale-95 transition-transform"><ArrowLeftIcon size={20} /></button>
          <p className="text-xs font-sans font-semibold tracking-widest text-cafe-dark/80">{chapter ? chapter.title.toUpperCase() : ''} · {slurp.minutes} MIN</p>
        </div>
        <Bubbles key={slurp.id} slurp={slurp} next={next} />
      </div>
    </div>
  )
}
