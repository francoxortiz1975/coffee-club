import { Link } from 'react-router-dom'
import { useFavoritos } from '../context/FavoritosContext'

const OCASION_LABELS = {
  pareja: '💑 Pareja',
  amigos: '👯 Amigos',
  reunión: '💼 Reunión',
  turístico: '🗺️ Turístico',
  work: '💻 Work',
}

export default function CafeCardSmall({ cafe }) {
  const { id, nombre, barrio, ocasiones, especialidad, precio, fotos } = cafe
  const { favoritos, toggleFavorito } = useFavoritos()
  const esFavorito = favoritos.includes(id)

  function handleHeart(e) {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorito(id)
  }

  return (
    <Link
      to={`/cafe/${id}`}
      className="shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm snap-start block active:scale-[0.98] transition-transform"
    >
      {/* Foto */}
      <div className="w-full h-36 bg-cafe-accent/20 flex items-center justify-center relative">
        {fotos?.[0] ? (
          <img src={fotos[0]} alt={nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">☕</span>
        )}
        <button
          onClick={handleHeart}
          className="absolute top-2 right-2 text-xl leading-none drop-shadow"
        >
          {esFavorito ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between mb-0.5">
          <h3 className="text-sm font-serif font-bold text-cafe-dark leading-tight">{nombre}</h3>
          <span className="text-xs text-cafe-accent font-semibold ml-2 shrink-0">{precio}</span>
        </div>
        <p className="text-[11px] text-cafe-accent/60 mb-2">📍 {barrio}</p>
        <p className="text-[11px] text-cafe-dark/70 mb-2 line-clamp-1">{especialidad}</p>
        <div className="flex gap-1.5">
          {ocasiones.slice(0, 2).map((o) => (
            <span key={o} className="text-[10px] bg-beige text-cafe-accent border border-cafe-accent/20 rounded-full px-2 py-0.5">
              {OCASION_LABELS[o] ?? o}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
