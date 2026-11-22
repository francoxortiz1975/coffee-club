import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { slurps, chapters } from '../data/journey'
import { getRead, markRead } from '../lib/journeyProgress'
import { ArrowLeftIcon } from '../components/Icons'
import Barcode from '../components/Barcode'
import '../components/slurpTag.css'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// A slurp as a hang tag you read one line at a time: tap to carry on.
// Paragraphs become bubbles; a "1. … 2. …" paragraph becomes one bubble per step.
function toBubbles(slurp) {
  const out = [`Let’s talk about this: ${slurp.title}.`]
  for (const p of slurp.body) {
    if (/^1\.\s/.test(p)) p.split(/(?<=[.!?])\s+(?=\d+\.\s)/).forEach((t) => out.push(t))
    else out.push(p)
  }
  return out
}

function Bubbles({ slurp, next, chapter, code }) {
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
    setTimeout(() => { setTyping(false); setShown((n) => n + 1) }, 600)
  }

  return (
    <div className="px-5 pb-8">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-sans font-semibold tracking-[0.12em] mt-1">{slurp.kind.toUpperCase()}</p>
        <div className="flex items-start gap-3">
          <span className="tag-stamp"><span className="block text-[15px] font-bold">{slurp.minutes}</span>min</span>
          <p className="text-[11px] font-sans font-semibold tracking-[0.1em] mt-1">SL-{code}</p>
        </div>
      </div>
      <span className="tag-rule mt-4" />
      <p className="font-sans text-[22px] leading-tight tracking-tight mt-4">{chapter ? chapter.title : 'Coffee'}</p>
      <span className="tag-rule thin mt-3" />
      <h1 className="font-sans font-bold text-[40px] leading-[1.02] tracking-tight mt-5">{slurp.title}</h1>
      <span className="tag-rule mt-6" />

      <div className="mt-5 flex flex-col gap-4">
        {bubbles.slice(1, shown).map((t, i) => (
          <p key={i} className="tag-in font-sans font-medium text-[18px] leading-snug border-l-[5px] border-[var(--ink)] pl-4">{t}</p>
        ))}
        {typing && <span className="tag-dots flex gap-1.5 pl-5 py-2" aria-label="Typing"><i /><i /><i /></span>}
      </div>

      {!finished && !typing && (
        <div className="flex justify-end mt-6">
          <button onClick={more} className="tag-btn solid">{shown === 1 ? 'Start ›' : 'Go on ›'}</button>
        </div>
      )}

      {finished && (
        <div className="tag-in mt-10">
          <div className="flex items-end justify-between gap-3">
            <Barcode seed={slurp.id} />
            <div className="text-right font-sans font-bold leading-tight">
              <p className="text-[13px] tracking-wide">{(chapter?.title || '').toUpperCase()}</p>
              <p className="text-[26px]">{slurp.kind}</p>
            </div>
          </div>
          <span className="tag-rule mt-3" />
          <div className="tag-perf mt-6 pt-5 flex flex-col gap-3">
            {next && <Link to={`/journey/${next.id}`} className="tag-btn solid flex items-center justify-between gap-3 py-3"><span className="text-[11px] tracking-[0.12em]">NEXT</span><span className="flex-1 text-left text-base leading-tight">{next.title}</span>›</Link>}
            <Link to="/journey" className="tag-btn flex items-center justify-center">Back to the road</Link>
          </div>
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
    <div className="tag tag-paper min-h-screen pb-16 -mb-24">
      <div className="sticky top-0 z-20 flex items-center px-2 tag-paper" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <button onClick={() => navigate(-1)} aria-label="Back" className="w-11 h-11 flex items-center justify-center active:scale-95 transition-transform"><ArrowLeftIcon size={22} /></button>
      </div>
      <Bubbles key={slurp.id} slurp={slurp} next={next} chapter={chapter} code={String(i + 1).padStart(3, '0')} />
    </div>
  )
}
