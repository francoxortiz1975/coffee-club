import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { slurps, chapters } from '../data/journey'
import { getRead, markRead } from '../lib/journeyProgress'
import { ArrowLeftIcon } from '../components/Icons'
import '../components/slurpTag.css'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// A slurp as a hang tag that writes itself, line by line, like a typewriter. Tap to finish the line.
// Paragraphs become lines; a "1. … 2. …" paragraph becomes one bubble per step.
function toBubbles(slurp) {
  const out = [`Let’s talk about this: ${slurp.title}.`]
  for (const p of slurp.body) {
    if (/^1\.\s/.test(p)) p.split(/(?<=[.!?])\s+(?=\d+\.\s)/).forEach((t) => out.push(t))
    else out.push(p)
  }
  return out
}

const NOTES = { Technique: 'try this at home', Method: 'my favourite way', Recipe: 'taste as you go', Origin: 'a long way from here', Story: 'a good one', Tasting: 'slow down here', Paris: 'only in Paris', Tip: 'small, but it helps' }

function Bubbles({ slurp, next, chapter }) {
  const lines = useState(() => toBubbles(slurp).slice(1))[0]
  const instant = useState(reduced)[0]
  const [li, setLi] = useState(0)   // the line being typed
  const [n, setN] = useState(0)     // characters of it shown so far
  const activeRef = useRef(null)
  const done = instant || li >= lines.length

  // The typewriter: one line at a time, a little slower at the ends of sentences, then the next line starts.
  useEffect(() => {
    if (done) return
    const t = lines[li]
    if (n >= t.length) {
      const id = setTimeout(() => { setLi((l) => l + 1); setN(0) }, 500)
      return () => clearTimeout(id)
    }
    const ch = t[n - 1]
    const delay = n === 0 ? 350 : /[.!?]/.test(ch) ? 260 : /[,;:]/.test(ch) ? 120 : 22
    const id = setTimeout(() => setN((x) => x + 1), delay)
    return () => clearTimeout(id)
  }, [done, lines, li, n])

  // Keep the line being written in view as the page grows.
  useEffect(() => {
    const el = activeRef.current
    if (!el || done) return
    const r = el.getBoundingClientRect()
    const limit = window.innerHeight - 170
    if (r.bottom > limit) window.scrollBy({ top: r.bottom - limit, behavior: 'smooth' })
  }, [li, n, done])

  const skip = () => { if (!done) setN(lines[li].length) }

  return (
    <div className="px-5 pb-8">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-sans font-semibold tracking-[0.12em] mt-1">{slurp.kind.toUpperCase()}</p>
        <div className="flex items-start gap-3">
          <span className="tag-stamp"><span className="block text-[15px] font-bold">{slurp.minutes}</span>min</span>
        </div>
      </div>
      <span className="tag-rule mt-4" />
      <p className="font-sans text-[22px] leading-tight tracking-tight mt-4">{chapter ? chapter.title : 'Coffee'}</p>
      <span className="tag-rule thin mt-3" />
      <h1 className="font-sans font-bold text-[40px] leading-[1.02] tracking-tight mt-5">{slurp.title}</h1>
      <p className="tag-note mt-2 ml-1">{NOTES[slurp.kind] || 'read on'}<svg viewBox="0 0 160 10" className="block w-36 -mt-0.5" aria-hidden="true"><path d="M2 6 C30 1 60 9 90 4 S140 3 158 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg></p>
      <span className="tag-rule mt-6" />

      <div className="mt-5 flex flex-col gap-6" onClick={skip}>
        {lines.map((t, i) => {
          if (!instant && i > li) return null
          const active = !instant && i === li
          return (
            <p key={i} ref={active ? activeRef : null} aria-label={t} className="font-sans font-medium text-[18px] leading-snug border-l-[5px] border-[var(--ink)] pl-4">
              <span aria-hidden="true">{active ? t.slice(0, n) : t}</span>
              {active && <span className="tag-caret" aria-hidden="true" />}
            </p>
          )
        })}
      </div>

      {done && (
        <div className="tag-in mt-12">
          <div className="flex items-end justify-end gap-3">
            <div className="text-right font-sans font-bold leading-tight">
              <p className="text-[13px] tracking-wide">{(chapter?.title || '').toUpperCase()}</p>
              <p className="font-sans font-bold text-[26px]">{slurp.kind}</p>
            </div>
          </div>
          <span className="tag-rule mt-3" />
          <div className="tag-perf mt-6 pt-5 flex flex-col gap-3">
            {next && <Link to={`/journey/${next.id}`} className="tag-btn solid flex items-center justify-between gap-3 py-3"><span className="text-[11px] tracking-[0.12em]">NEXT</span><span className="flex-1 text-left text-base leading-tight">{next.title}</span>›</Link>}
            <Link to="/" className="tag-btn flex items-center justify-center">Back to Discover</Link>
          </div>
        </div>
      )}
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
        <Link to="/" className="inline-block mt-4 text-sm font-semibold text-cafe-accent underline">Back to Discover</Link>
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
      <Bubbles key={slurp.id} slurp={slurp} next={next} chapter={chapter} />
    </div>
  )
}
