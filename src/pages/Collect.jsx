import { useState } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useCityCafes } from '../lib/city'
import CitySwitch from '../components/CitySwitch'
import AppHeader from '../components/AppHeader'
import LoyaltyCard from '../components/LoyaltyCard'
import ParisPreview from '../components/ParisPreview'
import ColeccionBarrio from '../components/ColeccionBarrio'
import RecuerdoModal from '../components/RecuerdoModal'
import { useVisitas } from '../context/VisitasContext'
import { useRecuerdos } from '../context/RecuerdosContext'
import { useAuth } from '../context/AuthContext'
import { CameraIcon } from '../components/Icons'

function Souvenirs() {
  const { recuerdos } = useRecuerdos()
  const { user } = useAuth()
  const [editing, setEditing] = useState(null)
  const items = Object.entries(recuerdos)
    .map(([cafeId, r]) => ({ cafe: cafes.find((c) => c.id === cafeId), ...r }))
    .filter((x) => x.cafe && x.foto_url)
    .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''))

  if (items.length === 0) {
    return (
      <div className="bg-[#faf4ec] rounded-2xl px-5 py-8 text-center shadow-sm">
        <CameraIcon size={32} className="text-cafe-accent/40 mx-auto mb-3" />
        <p className="text-base font-display font-bold text-cafe-dark">Your scrapbook is empty</p>
        <p className="text-sm text-cafe-accent/70 mt-1">
          {user
            ? 'Mark a café as visited and add a photo and a note. It will show up here.'
            : 'Sign in, mark a café as visited and add a photo and a note. It will show up here.'}
        </p>
        {!user && (
          <Link to="/login" className="inline-block mt-4 text-sm font-bold bg-cafe-dark text-[#b8d04a] px-5 py-2.5 rounded-full">Sign in</Link>
        )}
      </div>
    )
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ cafe, foto_url, nota, fecha }) => (
          <button
            key={cafe.id}
            onClick={() => setEditing(cafe)}
            className="text-left bg-[#fffaf0] p-2 pb-3 rounded-md shadow-md active:scale-[0.98] transition-transform"
            style={{ transform: `rotate(${(cafe.id.length % 3) - 1}deg)` }}
          >
            <div className="aspect-square overflow-hidden rounded-sm bg-cafe-accent/10">
              <img src={foto_url} alt={cafe.nombre} className="w-full h-full object-cover" />
            </div>
            <p className="text-sm font-sans font-bold text-cafe-dark mt-2 leading-tight">{cafe.nombre}</p>
            {fecha && <p className="text-[11px] text-cafe-accent/60">{new Date(fecha).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>}
            {nota && <p className="text-xs text-cafe-dark/80 italic line-clamp-2 mt-1">“{nota}”</p>}
          </button>
        ))}
      </div>
      {editing && <RecuerdoModal cafe={editing} onClose={() => setEditing(null)} />}
    </>
  )
}

// Collect = what you have earned and kept: your card, your souvenirs, your Paris.
export default function Collect() {
  const cityCafes = useCityCafes()
  const barrios = [...new Set(cityCafes.map((c) => c.barrio))]
  const { visitas } = useVisitas()

  return (
    <div className="pb-4">
      <AppHeader title="Collect" />

      <div className="px-4 mt-4 flex flex-col gap-6">
        <LoyaltyCard total={visitas.length} />

        <section>
          <h2 className="text-lg font-display font-bold text-cafe-dark mb-3">Souvenirs</h2>
          <Souvenirs />
        </section>

        <ParisPreview visited={visitas.length} />

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-bold text-cafe-dark">By neighborhood</h2>
            <CitySwitch />
          </div>
          <div className="flex flex-col gap-3">
            {barrios.map((b) => <ColeccionBarrio key={b} barrio={b} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
