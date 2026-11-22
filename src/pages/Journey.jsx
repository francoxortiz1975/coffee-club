import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import DiscoverSwitch from '../components/DiscoverSwitch'
import '../components/slurpTag.css'
import { chapters, slurps } from '../data/journey'
import { getRead } from '../lib/journeyProgress'

// Discover > Journey: the chapters as a printed contents list, in the same kraft-tag look as the slurps.
export default function Journey() {
  const [read] = useState(getRead)
  const total = slurps.length
  const doneAll = slurps.filter((l) => read.has(l.id)).length
  const resume = slurps.find((l) => !read.has(l.id))

  return (
    <div className="tag tag-paper min-h-screen pb-28 -mb-24">
      <AppHeader title="Discover">
        <DiscoverSwitch value="journey" />
      </AppHeader>

      <div className="px-5 pt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-sans font-semibold tracking-[0.12em]">YOUR JOURNEY</p>
            <p className="font-sans font-bold text-[40px] leading-none tracking-tight mt-1">{doneAll}<span className="text-[22px] font-semibold"> of {total}</span></p>
          </div>
          {resume && <Link to={`/journey/${resume.id}`} className="tag-btn solid flex items-center shrink-0">{doneAll ? 'Continue' : 'Start'} ›</Link>}
        </div>
        <div className="mt-4 h-[9px] bg-[var(--ink)]/15" aria-hidden="true"><div className="h-full bg-[var(--ink)]" style={{ width: `${(doneAll / total) * 100}%` }} /></div>

        {chapters.map((c, ci) => {
          const list = slurps.filter((l) => l.chapter === c.id)
          const done = list.filter((l) => read.has(l.id)).length
          return (
            <section key={c.id} className="mt-10">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-sans font-semibold tracking-[0.12em]">CHAPTER {ci + 1}</p>
                  <h2 className="font-sans font-bold text-[30px] leading-[1.05] tracking-tight mt-1">{c.title}</h2>
                </div>
                <span className="tag-stamp shrink-0"><span className="text-[15px] font-bold">{done}</span>/{list.length}</span>
              </div>
              <span className="tag-rule mt-3" />
              <ul>
                {list.map((l) => (
                  <li key={l.id} className="border-b-2 border-[var(--ink)]/20">
                    <Link to={`/journey/${l.id}`} className="min-h-12 py-3 flex items-center gap-3 active:opacity-60 transition-opacity">
                      <span className="flex-1 font-sans font-medium text-[17px] leading-snug">{l.title}</span>
                      <span className="text-[11px] font-sans font-semibold tracking-[0.1em] shrink-0">{read.has(l.id) ? '✓ READ' : `${l.minutes} MIN`}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        <p className="text-center text-sm mt-10 opacity-70">More chapters are on the way.</p>
      </div>
    </div>
  )
}
