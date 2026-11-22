import { Link } from 'react-router-dom'
import { KIND_STYLE } from '../data/journey'
import SlurpIcon from './SlurpIcon'

// A coffee slurp. "card" fills the width (the Journey feed); "mini" is a shelf card.
export default function SlurpCard({ slurp, read = false, variant = 'card' }) {
  const k = KIND_STYLE[slurp.kind]
  const mini = variant === 'mini'
  return (
    <Link
      to={`/journey/${slurp.id}`}
      className={`relative block rounded-2xl text-beige overflow-hidden shadow-md active:scale-[0.99] transition-transform ${mini ? 'shrink-0 w-64 snap-start p-4 min-h-[132px]' : 'w-full p-4'}`}
      style={{ background: `linear-gradient(150deg, ${k.from}, ${k.to})` }}
    >
      <SlurpIcon kind={slurp.kind} size={mini ? 26 : 30} className="absolute right-3.5 top-3.5 opacity-90" />
      <p className="text-[11px] font-sans font-semibold tracking-widest opacity-85">{slurp.kind.toUpperCase()} · {slurp.minutes} MIN</p>
      <h3 className={`font-display font-bold leading-tight mt-1.5 pr-10 ${mini ? 'text-base' : 'text-lg'}`}>{slurp.title}</h3>
      {!mini && <p className="text-sm opacity-85 mt-1.5 line-clamp-2">{slurp.body[0]}</p>}
      {read && <p className="text-[11px] font-sans font-semibold mt-2 text-[#b8d04a]">✓ Slurped</p>}
    </Link>
  )
}
