import { useState } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useVisitas } from '../context/VisitasContext'
import { useInvitaciones } from '../context/InvitacionesContext'
import { CoffeeCupIcon, CoffeeBeanIcon, InviteIcon, PinIcon } from '../components/Icons'

const barrios = [...new Set(cafes.map((c) => c.barrio))]

function ColeccionBarrio({ barrio }) {
  const [abierto, setAbierto] = useState(false)
  const { visitas, toggleVisita } = useVisitas()
  const cafesBarrio = cafes.filter((c) => c.barrio === barrio)
  const visitados = cafesBarrio.filter((c) => visitas.includes(c.id)).length

  return (
    <div className="bg-[#faf4ec] rounded-2xl overflow-hidden shadow-sm">
      {/* Toggle header */}
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="text-left">
          <p className="text-sm font-serif font-bold text-cafe-dark">{barrio}</p>
          <p className="text-xs text-cafe-accent/50 mt-0.5">{visitados} / {cafesBarrio.length} visitadas</p>
        </div>
        <span className={`text-cafe-accent/40 transition-transform text-xs ${abierto ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Barra de progreso */}
      <div className="h-0.5 bg-beige mx-4">
        <div
          className="h-full bg-cafe-dark rounded-full transition-all"
          style={{ width: `${cafesBarrio.length ? (visitados / cafesBarrio.length) * 100 : 0}%` }}
        />
      </div>

      {/* Grid 3x3 */}
      {abierto && (
        <div className="grid grid-cols-3 gap-3 p-4">
          {cafesBarrio.map((cafe) => {
            const visitado = visitas.includes(cafe.id)
            return (
              <Link key={cafe.id} to={`/cafe/${cafe.id}`} className="flex flex-col items-center gap-1.5">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-cafe-accent/10 flex items-center justify-center">
                  {cafe.fotos?.[0] ? (
                    <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <CoffeeCupIcon size={24} className="text-cafe-accent/20" />
                  )}
                  {/* Overlay si no visitado */}
                  {!visitado && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] pointer-events-none" />
                  )}
                  {/* Toggle visitado — botón sobre la imagen */}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleVisita(cafe.id) }}
                    aria-label={visitado ? 'Marcar como no visitada' : 'Marcar como visitada'}
                    className={`absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all ${
                      visitado ? 'bg-cafe-dark text-beige' : 'bg-white/90 text-cafe-dark/40 border border-cafe-dark/20'
                    }`}
                  >
                    <span className="text-sm font-bold leading-none">✓</span>
                  </button>
                </div>
                <p className="text-[10px] text-cafe-dark/70 text-center leading-tight line-clamp-2">{cafe.nombre}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function InvitacionRow({ inv, tipo, onEliminar }) {
  const cafe = cafes.find((c) => c.id === inv.cafeId)
  if (!cafe) return null

  const params = new URLSearchParams()
  if (inv.nombre) params.set('nombre', inv.nombre)
  if (inv.receptor) params.set('para', inv.receptor)
  if (inv.fecha) params.set('fecha', inv.fecha)
  if (inv.hora) params.set('hora', inv.hora)
  const link = `/invitacion/${inv.cafeId}${params.toString() ? `?${params}` : ''}`

  const detalle = inv.fecha
    ? new Date(inv.fecha + 'T12:00:00').toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })
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
          <p className="text-sm font-serif font-bold text-cafe-dark truncate">{cafe.nombre}</p>
          <p className="text-[11px] text-cafe-accent/60 flex items-center gap-1 truncate">
            <PinIcon size={10} className="shrink-0" />
            <span className="truncate">{cafe.barrio}</span>
            {detalle && <span className="text-cafe-accent/40">· {detalle}{inv.hora ? ` ${inv.hora}` : ''}</span>}
            {tipo === 'recibidas' && inv.nombre && (
              <span className="text-cafe-accent/40">· de {inv.nombre}</span>
            )}
            {tipo === 'enviadas' && inv.receptor && (
              <span className="text-cafe-accent/40">· para {inv.receptor}</span>
            )}
          </p>
        </div>
      </Link>
      <button
        onClick={onEliminar}
        aria-label="Eliminar invitación"
        className="w-7 h-7 rounded-full text-cafe-accent/40 active:text-cafe-accent/80 shrink-0"
      >
        ×
      </button>
    </div>
  )
}

export default function Perfil() {
  const { visitas } = useVisitas()
  const { enviadas, recibidas, eliminar, invKey } = useInvitaciones()

  return (
    <div className="min-h-screen px-4 pt-8 pb-4">
      <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-3">Mi Colección</h1>

      {/* Invitaciones */}
      {(recibidas.length > 0 || enviadas.length > 0) && (
        <div className="bg-[#faf4ec] rounded-2xl px-4 py-3 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-3">
            <InviteIcon size={16} className="text-cafe-dark" />
            <p className="text-sm font-serif font-bold text-cafe-dark">Invitaciones</p>
          </div>

          {recibidas.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-2">Recibidas</p>
              <div className="flex flex-col gap-2.5 mb-3">
                {recibidas.map((inv) => (
                  <InvitacionRow
                    key={`r-${invKey(inv)}`}
                    inv={inv}
                    tipo="recibidas"
                    onEliminar={() => eliminar('recibidas', invKey(inv))}
                  />
                ))}
              </div>
            </>
          )}

          {enviadas.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-2">Enviadas</p>
              <div className="flex flex-col gap-2.5">
                {enviadas.map((inv) => (
                  <InvitacionRow
                    key={`e-${invKey(inv)}`}
                    inv={inv}
                    tipo="enviadas"
                    onEliminar={() => eliminar('enviadas', invKey(inv))}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Coffee Beans */}
      <div className="bg-[#faf4ec] rounded-2xl px-4 py-3 shadow-sm mb-6">
        <p className="text-xs text-cafe-accent/50 mb-2">
          {visitas.length === 0
            ? 'Aún no has visitado ninguna cafetería'
            : `${visitas.length} coffee bean${visitas.length > 1 ? 's' : ''}`}
        </p>
        {visitas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: visitas.length }).map((_, i) => (
              <CoffeeBeanIcon key={i} size={20} className="text-cafe-dark" />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {barrios.map((barrio) => (
          <ColeccionBarrio key={barrio} barrio={barrio} />
        ))}
      </div>
    </div>
  )
}
