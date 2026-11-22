import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { ArrowLeftIcon, CoffeeCupIcon, PinIcon } from '../components/Icons'

// Step one of a new invitation: pick the café. Step two is the existing setup form (date, time, names).
export default function InviteNew() {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const list = cafes.filter((c) => (c.nombre + ' ' + c.barrio).toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="px-4 pb-4" style={{ paddingTop: 'calc(10px + env(safe-area-inset-top))' }}>
      <div className="flex items-center gap-1 min-h-11">
        <button onClick={() => navigate(-1)} aria-label="Back" className="-ml-2 w-11 h-11 flex items-center justify-center text-cafe-dark/70 active:scale-95 transition-transform">
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-2xl font-display font-bold text-cafe-dark">Where to?</h1>
      </div>
      <p className="text-sm text-cafe-accent/70 mt-1 mb-4">Pick the café for your invitation.</p>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search coffee shops..."
        className="w-full min-h-11 rounded-2xl bg-white/70 border border-cafe-accent/20 px-4 text-base outline-none focus:border-cafe-accent/60 mb-4"
      />

      <div className="flex flex-col gap-2.5">
        {list.map((c) => (
          <Link key={c.id} to={`/invitacion/${c.id}/setup`} className="flex items-center gap-3 bg-[#faf4ec] rounded-2xl p-3 shadow-sm active:scale-[0.99] transition-transform">
            <div className="w-14 h-14 rounded-xl bg-cafe-accent/10 overflow-hidden shrink-0 flex items-center justify-center">
              {c.fotos?.[0] ? <img src={c.fotos[0]} alt="" className="w-full h-full object-cover" /> : <CoffeeCupIcon size={22} className="text-cafe-accent/30" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-display font-bold text-cafe-dark truncate">{c.nombre}</p>
              <p className="text-xs text-cafe-accent/60 flex items-center gap-1"><PinIcon size={11} />{c.barrio}</p>
            </div>
            <span className="text-cafe-accent/40 text-lg" aria-hidden="true">›</span>
          </Link>
        ))}
        {list.length === 0 && <p className="text-sm text-cafe-accent/70 text-center py-8">No coffee shops match that.</p>}
      </div>
    </div>
  )
}
