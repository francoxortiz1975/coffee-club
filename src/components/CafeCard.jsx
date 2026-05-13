import { Link } from 'react-router-dom'

const OCASION_LABELS = {
  pareja: '💑 Pareja',
  amigos: '👯 Amigos',
  reunión: '💼 Reunión',
  turístico: '🗺️ Turístico',
  work: '💻 Work',
}

export default function CafeCard({ cafe, favorito, onToggleFavorito }) {
  const { id, nombre, barrio, ocasiones, especialidad, historia, precio } = cafe

  function handleHeart(e) {
    e.preventDefault()
    onToggleFavorito(id)
  }

  return (
    <Link to={`/cafe/${id}`} className="block bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98] transition-transform">
      {/* Foto */}
      <div className="w-full h-48 bg-cafe-accent/20 flex items-center justify-center relative">
        {cafe.fotos?.[0] ? (
          <img src={cafe.fotos[0]} alt={nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">☕</span>
        )}
        <button
          onClick={handleHeart}
          className="absolute top-3 right-3 text-xl leading-none drop-shadow"
        >
          {favorito ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-lg font-serif font-bold text-cafe-dark leading-tight">{nombre}</h2>
          <span className="text-sm text-cafe-accent font-medium ml-2 shrink-0">{precio}</span>
        </div>
        <p className="text-xs text-cafe-accent/70 mb-3">{barrio}</p>
        <p className="text-sm text-cafe-dark/80 mb-3">{especialidad}</p>
        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2">{historia}</p>

        <div className="flex flex-wrap gap-1.5">
          {ocasiones.map((o) => (
            <span
              key={o}
              className="text-xs bg-beige text-cafe-accent border border-cafe-accent/20 rounded-full px-2.5 py-0.5"
            >
              {OCASION_LABELS[o] ?? o}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
