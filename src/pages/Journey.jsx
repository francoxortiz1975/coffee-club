import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import DiscoverSwitch from '../components/DiscoverSwitch'
import LessonCard from '../components/LessonCard'
import { chapters, lessons } from '../data/journey'
import { getRead } from '../lib/journeyProgress'

// Discover > Journey: short coffee lessons in chapters, with progress. It is a path, not just a feed.
export default function Journey() {
  const [chapter, setChapter] = useState('all')
  const [read] = useState(getRead)
  const list = chapter === 'all' ? lessons : lessons.filter((l) => l.chapter === chapter)
  const done = list.filter((l) => read.has(l.id)).length
  const title = chapter === 'all' ? 'Your journey' : chapters.find((c) => c.id === chapter).title

  return (
    <div className="pb-4">
      <AppHeader title="Discover">
        <DiscoverSwitch value="journey" />
      </AppHeader>

      <div className="px-4 mt-4 flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 no-scrollbar" role="tablist" aria-label="Chapters">
          {[{ id: 'all', title: 'All' }, ...chapters].map((c) => {
            const on = c.id === chapter
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={on}
                onClick={() => setChapter(c.id)}
                className={`relative shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors before:absolute before:-inset-x-1 before:-inset-y-[5px] before:content-[''] ${
                  on ? 'bg-cafe-dark text-beige border-cafe-dark' : 'bg-white/80 text-cafe-accent border-cafe-accent/20'
                }`}
              >
                {c.title}
              </button>
            )
          })}
        </div>

        <div className="bg-[#fffaf0] rounded-2xl px-4 py-3 shadow-sm">
          <p className="text-sm font-sans font-semibold text-cafe-dark">{title} · {done} of {list.length} read</p>
          <div className="h-1.5 rounded-full bg-cafe-accent/15 mt-2 overflow-hidden" aria-hidden="true">
            <div className="h-full bg-[#b8d04a] transition-all" style={{ width: `${list.length ? (done / list.length) * 100 : 0}%` }} />
          </div>
        </div>

        {list.map((l) => <LessonCard key={l.id} lesson={l} read={read.has(l.id)} />)}

        <p className="text-center text-sm text-cafe-accent/70 py-4">More lessons are on the way.</p>
      </div>
    </div>
  )
}
