import { useEffect, useMemo, useRef, useState } from 'react'
import AppHeader from '../components/AppHeader'
import DiscoverSwitch from '../components/DiscoverSwitch'
import SlurpCard from '../components/SlurpCard'
import '../components/slurpTag.css'
import { slurps } from '../data/journey'

// Discover > Journey: an endless feed of slurp cards. No counter, no sections, no end.
// A dashed line wanders behind the cards and links one to the next. When you reach the last one, the feed keeps going.

// Same shuffle every time for a given round, so the feed is stable while you scroll but never ends.
function shuffled(round, avoid) {
  let seed = round * 9301 + 49297
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
  const a = [...slurps]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  if (avoid && a[0].id === avoid) a.push(a.shift())
  return a
}

// The line between two cards: a loose curve from one side of the page to the other.
function Link2({ flip, seed }) {
  const bend = 14 + (seed % 5) * 4
  const a = flip ? 70 : 30, b = flip ? 30 : 70
  return (
    <svg className="block w-full h-14 -my-3 relative z-0" viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true">
      <path d={`M ${a} 0 C ${a} ${28 + bend}, ${b} ${28 - bend}, ${b} 56`} fill="none" stroke="currentColor" strokeOpacity=".45" strokeWidth="2.2" strokeDasharray="2 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Journey() {
  const [rounds, setRounds] = useState(2)
  const sentinel = useRef(null)

  const feed = useMemo(() => {
    const out = []
    for (let r = 0; r < rounds; r++) out.push(...shuffled(r + 1, out[out.length - 1]?.id))
    return out
  }, [rounds])

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setRounds((n) => n + 1) }, { rootMargin: '0px 0px 1200px 0px' })
    io.observe(sentinel.current)
    return () => io.disconnect()
  }, [])

  return (
    <div className="tag tag-paper min-h-screen pb-28 -mb-24">
      <AppHeader title="Discover">
        <DiscoverSwitch value="journey" />
      </AppHeader>

      <div className="px-5 pt-8">
        {feed.map((l, i) => (
          <div key={`${i}-${l.id}`}>
            {i > 0 && <Link2 flip={i % 2 === 0} seed={i * 7 + l.id.length} />}
            <div className={`relative z-10 w-[84%] ${i % 2 ? 'ml-auto' : ''}`}>
              <SlurpCard slurp={l} />
            </div>
          </div>
        ))}
        <div ref={sentinel} className="h-8" />
      </div>
    </div>
  )
}
