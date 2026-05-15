import { useState } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useVisitas } from '../context/VisitasContext'
import { CoffeeCupIcon, CoffeeBeanIcon } from '../components/Icons'

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

export default function Perfil() {
  const { visitas } = useVisitas()

  return (
    <div className="min-h-screen px-4 pt-8 pb-4">
      <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-3">Mi Colección</h1>

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
