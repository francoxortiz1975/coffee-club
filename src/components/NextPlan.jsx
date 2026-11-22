import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useInvitaciones } from '../context/InvitacionesContext'
import { nextPlan, formatWhen } from '../lib/plans'

// The next dated invitation (sent or received), so an accepted plan never gets buried.
// variant "strip" is the small bar on Discover; "card" is the big one on the Invite tab.
export default function NextPlan({ variant = 'strip' }) {
  const { enviadas, recibidas } = useInvitaciones()
  const mine = enviadas.map((i) => ({ ...i, _t: 'sent' }))
  const theirs = recibidas.map((i) => ({ ...i, _t: 'received' }))
  const plan = nextPlan([...mine, ...theirs])
  if (!plan) return null
  const cafe = cafes.find((c) => c.id === plan.cafeId)
  if (!cafe) return null
  const who = plan._t === 'received' ? plan.nombre : plan.receptor
  const params = new URLSearchParams()
  if (plan.nombre) params.set('nombre', plan.nombre)
  if (plan.receptor) params.set('para', plan.receptor)
  if (plan.fecha) params.set('fecha', plan.fecha)
  if (plan.hora) params.set('hora', plan.hora)
  const link = `/invitacion/${plan.cafeId}${params.toString() ? `?${params}` : ''}`

  if (variant === 'card') {
    return (
      <Link to={link} className="block rounded-2xl p-4 bg-[#2a1a10] text-beige shadow-md active:scale-[0.99] transition-transform">
        <p className="text-[11px] font-sans font-semibold tracking-widest text-[#b8d04a]">NEXT PLAN</p>
        <p className="text-xl font-display font-bold mt-1">{formatWhen(plan)}</p>
        <p className="text-sm text-beige/80 mt-1">{cafe.nombre}{who ? ` · with ${who}` : ''}</p>
      </Link>
    )
  }
  return (
    <Link to="/invite" className="flex items-center gap-3 rounded-2xl px-4 py-3 bg-[#2a1a10] text-beige shadow-md active:scale-[0.99] transition-transform">
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-sans font-semibold tracking-widest text-[#b8d04a] truncate">NEXT PLAN · {formatWhen(plan).toUpperCase()}</p>
        <p className="text-sm font-sans font-bold truncate">{cafe.nombre}{who ? ` with ${who}` : ''}</p>
      </div>
      <span className="text-[#b8d04a] text-lg" aria-hidden="true">›</span>
    </Link>
  )
}
