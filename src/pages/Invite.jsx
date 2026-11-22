import { useState } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import AppHeader from '../components/AppHeader'
import Segmented from '../components/Segmented'
import NextPlan from '../components/NextPlan'
import InvitacionRow from '../components/InvitacionRow'
import { useInvitaciones } from '../context/InvitacionesContext'
import { isPast, isUpcoming } from '../lib/plans'

// Invite = plans with people. Next plan on top, one button to start, then received / sent / past.
export default function Invite() {
  const { enviadas, recibidas, eliminar, invKey } = useInvitaciones()
  const [view, setView] = useState('received')
  const [confirmando, setConfirmando] = useState(null)

  const lists = {
    received: recibidas.filter(isUpcoming).map((i) => ({ i, tipo: 'recibidas' })),
    sent: enviadas.filter(isUpcoming).map((i) => ({ i, tipo: 'enviadas' })),
    past: [...recibidas.filter(isPast).map((i) => ({ i, tipo: 'recibidas' })), ...enviadas.filter(isPast).map((i) => ({ i, tipo: 'enviadas' }))],
  }
  const rows = lists[view]
  const emptyText = {
    received: 'No invitations waiting. When a friend sends you one, it shows up here.',
    sent: 'You have not sent any invitations yet.',
    past: 'Past plans will show up here.',
  }[view]

  function pedirConfirmacion(tipo, inv) {
    const cafe = cafes.find((c) => c.id === inv.cafeId)
    setConfirmando({ tipo, key: invKey(inv), nombreCafe: cafe?.nombre ?? 'this invitation' })
  }
  function confirmarEliminar() {
    if (!confirmando) return
    eliminar(confirmando.tipo, confirmando.key)
    setConfirmando(null)
  }

  return (
    <div className="pb-4">
      <AppHeader title="Invite" />
      <div className="px-4 mt-3 flex flex-col gap-3">
        <NextPlan variant="card" />
        <Link
          to="/invite/new"
          className="w-full min-h-12 rounded-full bg-[#b8d04a] text-[#1f1409] text-sm font-bold tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform"
        >
          <span className="text-lg leading-none">+</span> New invitation
        </Link>

        <Segmented
          label="Invitations"
          value={view}
          onChange={setView}
          options={[
            { id: 'received', label: 'Received', badge: lists.received.length },
            { id: 'sent', label: 'Sent' },
            { id: 'past', label: 'Past' },
          ]}
        />

        <div className="bg-[#faf4ec] rounded-2xl px-4 py-3 shadow-sm">
          {rows.length === 0 ? (
            <p className="text-sm text-cafe-accent/70 py-5 text-center">{emptyText}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {rows.map(({ i, tipo }) => (
                <InvitacionRow key={`${tipo}-${invKey(i)}`} inv={i} tipo={tipo} onEliminar={() => pedirConfirmacion(tipo, i)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {confirmando && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setConfirmando(null)}>
          <div className="bg-[#faf4ec] rounded-2xl p-6 max-w-xs w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-display font-bold text-cafe-dark mb-2">Delete invitation?</h3>
            <p className="text-sm text-cafe-accent/70 mb-5">
              You are about to delete the invitation to <span className="font-semibold text-cafe-dark">{confirmando.nombreCafe}</span>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmando(null)} className="flex-1 min-h-11 rounded-xl text-sm font-semibold border border-cafe-accent/25 text-cafe-accent active:scale-95 transition-transform">Cancel</button>
              <button onClick={confirmarEliminar} className="flex-1 min-h-11 rounded-xl text-sm font-bold bg-cafe-dark text-beige active:scale-95 transition-transform">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
