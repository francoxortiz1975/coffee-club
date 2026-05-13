import { Link } from 'react-router-dom'

export default function CafeCardSmall({ cafe, favorito, onToggleFavorito }) {
  function handleHeart(e) {
    e.preventDefault()
    onToggleFavorito(cafe.id)
  }

  return (
    <Link
      to={`/cafe/${cafe.id}`}
      className="shrink-0 w-40 bg-white rounded-2xl overflow-hidden shadow-sm snap-start block"
    >
      {/* Foto */}
      <div className="w-full h-24 bg-cafe-accent/20 flex items-center justify-center relative">
        {cafe.fotos[0] ? (
          <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">☕</span>
        )}
        <button
          onClick={handleHeart}
          className="absolute top-2 right-2 text-base leading-none"
        >
          {favorito ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="p-2.5">
        <p className="text-xs font-serif font-bold text-cafe-dark leading-tight line-clamp-1">{cafe.nombre}</p>
        <p className="text-[10px] text-cafe-accent/60 mt-0.5">{cafe.precio}</p>
      </div>
    </Link>
  )
}
