import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { KIND_STYLE } from '../data/journey'
import '../components/slurpTag.css'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// A coffee slurp. "card" is the Journey feed card: same type as the slurp page, and when it scrolls into view the title
// writes itself and the first line fades in. "mini" is a shelf card.
export default function SlurpCard({ slurp, variant = 'card' }) {
  const k = KIND_STYLE[slurp.kind]
  const mini = variant === 'mini'
  const ref = useRef(null)
  const still = useState(() => mini || reduced())[0]
  const [seen, setSeen] = useState(still)
  const [n, setN] = useState(still ? slurp.title.length : 0)

  useEffect(() => {
    if (seen) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [seen])

  useEffect(() => {
    if (!seen || n >= slurp.title.length) return
    const id = setTimeout(() => setN((x) => x + 1), n === 0 ? 200 : 26)
    return () => clearTimeout(id)
  }, [seen, n, slurp.title])

  const typed = n >= slurp.title.length

  return (
    <Link
      ref={ref}
      to={`/journey/${slurp.id}`}
      className={`relative block rounded-2xl text-beige overflow-hidden shadow-md active:scale-[0.99] transition-[transform,opacity] duration-500 ${mini ? 'shrink-0 w-64 snap-start p-4 min-h-[132px]' : 'w-full p-4'} ${seen ? 'opacity-100' : 'opacity-0 translate-y-3'}`}
      style={{ background: `linear-gradient(150deg, ${k.from}, ${k.to})` }}
    >
      <span className="absolute right-3 top-2 text-3xl opacity-90" aria-hidden="true">{slurp.emoji || k.emoji}</span>
      <p className="text-[11px] font-sans font-semibold tracking-[0.12em] opacity-85">{slurp.kind.toUpperCase()} · {slurp.minutes} MIN</p>
      <h3 className={`font-sans font-bold tracking-tight leading-[1.1] mt-1.5 pr-10 ${mini ? 'text-base' : 'text-[22px]'}`} aria-label={slurp.title}>
        <span aria-hidden="true">{slurp.title.slice(0, n)}{!typed && <span className="tag-caret" />}</span>
        <span aria-hidden="true" className="opacity-0">{slurp.title.slice(n)}</span>
      </h3>
      {!mini && <p className={`text-sm opacity-0 mt-2 line-clamp-2 font-sans transition-opacity duration-500 ${typed ? '!opacity-85' : ''}`}>{slurp.body[0]}</p>}
    </Link>
  )
}
