import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { CoffeeCupIcon, PinIcon } from './Icons'

export default function InvitacionRow({ inv, tipo, onEliminar }) {
  const cafe = cafes.find((c) => c.id === inv.cafeId)
  if (!cafe) return null

  const params = new URLSearchParams()
  if (inv.nombre) params.set('nombre', inv.nombre)
  if (inv.receptor) params.set('para', inv.receptor)
  if (inv.fecha) params.set('fecha', inv.fecha)
  if (inv.hora) params.set('hora', inv.hora)
  const link = `/invitacion/${inv.cafeId}${params.toString() ? `?${params}` : ''}`

  const detalle = inv.fecha
    ? new Date(inv.fecha + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
    : null

  return (
    <div className="flex items-center gap-3">
      <Link to={link} className="flex-1 flex items-center gap-3 active:scale-[0.99] transition-transform">
        <div className="w-12 h-12 rounded-xl bg-cafe-accent/10 overflow-hidden flex items-center justify-center shrink-0">
          {cafe.fotos?.[0]
            ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
            : <CoffeeCupIcon size={20} className="text-cafe-accent/30" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-sans font-bold text-cafe-dark truncate">{cafe.nombre}</p>
          <p className="text-[11px] text-cafe-accent/60 flex items-center gap-1 truncate">
            <PinIcon size={10} className="shrink-0" />
            <span className="truncate">{cafe.barrio}</span>
            {detalle && <span className="text-cafe-accent/40">· {detalle}{inv.hora ? ` ${inv.hora}` : ''}</span>}
            {tipo === 'recibidas' && inv.nombre && <span className="text-cafe-accent/40">· from {inv.nombre}</span>}
            {tipo === 'enviadas' && inv.receptor && <span className="text-cafe-accent/40">· for {inv.receptor}</span>}
          </p>
        </div>
      </Link>
      <button onClick={onEliminar} aria-label="Delete invitation" className="w-7 h-7 rounded-full text-cafe-accent/40 active:text-cafe-accent/80 shrink-0">
        ×
      </button>
    </div>
  )
}
