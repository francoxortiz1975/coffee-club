import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import DiscoverSwitch from '../components/DiscoverSwitch'
import JourneyScene from '../components/JourneyScene'
import { chapters, slurps } from '../data/journey'
import '../components/slurpTag.css'
import { getRead } from '../lib/journeyProgress'

// Discover > Journey: one road down the page. Each chapter is a stop; the scene behind the page changes as you travel.
export default function Journey() {
  const [read] = useState(getRead)
  const [active, setActive] = useState(chapters[0].id)
  const refs = useRef({})

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (hit) setActive(hit.target.dataset.chapter)
    }, { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.1, 0.5] })
    Object.values(refs.current).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const total = slurps.length
  const doneAll = slurps.filter((l) => read.has(l.id)).length
  const resume = slurps.find((l) => !read.has(l.id))

  return (
    <div className="pb-6">
      <JourneyScene chapter={active} />
      <div className="relative z-10">
        <AppHeader title="Discover">
          <DiscoverSwitch value="journey" />
        </AppHeader>

        <div className="px-4 mt-4">
          <div className="bg-white/80 backdrop-blur rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-sans font-semibold text-cafe-dark">Your journey · {doneAll} of {total} slurped</p>
              <div className="h-1.5 w-40 rounded-full bg-cafe-accent/15 mt-2 overflow-hidden" aria-hidden="true">
                <div className="h-full bg-[#b8d04a]" style={{ width: `${(doneAll / total) * 100}%` }} />
              </div>
            </div>
            {resume && <Link to={`/journey/${resume.id}`} className="min-h-11 px-4 rounded-full bg-cafe-dark text-[#b8d04a] text-sm font-bold flex items-center shrink-0 active:scale-95 transition-transform">{doneAll ? 'Continue' : 'Start'}</Link>}
          </div>

          <ol className="relative mt-6 ml-4">
            <span className="absolute left-0 top-2 bottom-2 border-l-2 border-dashed border-cafe-dark/35" aria-hidden="true" />
            {chapters.map((c, ci) => {
              const list = slurps.filter((l) => l.chapter === c.id)
              const done = list.filter((l) => read.has(l.id)).length
              const full = done === list.length && list.length > 0
              return (
                <li key={c.id} data-chapter={c.id} ref={(el) => { refs.current[c.id] = el }} className="relative pl-8 pb-8">
                  <span className={`absolute -left-[15px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${full ? 'bg-[#b8d04a] border-[#b8d04a] text-[#1f1409]' : 'bg-[#f5f0e8] border-cafe-dark text-cafe-dark'}`}>{full ? '✓' : ci + 1}</span>
                  <p className="font-display font-bold text-cafe-dark text-xl leading-8">{c.title}</p>
                  <p className="text-xs font-sans text-cafe-dark/70 mb-2">{done} of {list.length} slurped</p>
                  <div className="flex flex-col gap-2">
                    {list.map((l) => (
                      <Link key={l.id} to={`/journey/${l.id}`} className="tag tag-paper min-h-11 rounded-md border-l-[6px] border-[var(--ink)] px-3.5 py-2.5 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform">
                        <span className="flex-1 text-[15px] font-sans font-bold tracking-tight leading-snug">{l.title}</span>
                        <span className="text-xs font-semibold shrink-0">{read.has(l.id) ? '✓' : `${l.minutes} MIN`}</span>
                      </Link>
                    ))}
                  </div>
                </li>
              )
            })}
          </ol>
          <p className="text-center text-sm text-cafe-dark/70 py-2">More stops are on the way.</p>
        </div>
      </div>
    </div>
  )
}
