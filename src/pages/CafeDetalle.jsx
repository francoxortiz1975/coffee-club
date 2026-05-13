import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import cafes from '../data/cafes.json'
import StarRating from '../components/StarRating'

const PLACEHOLDER_FOTOS = [null, null, null]

export default function CafeDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cafe = cafes.find((c) => c.id === id)
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href
    const text = `☕ ${cafe.nombre} — ${cafe.especialidad}. Lo encontré en Samay Coffee Club:`

    if (navigator.share) {
      await navigator.share({ title: cafe.nombre, text, url })
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!cafe) {
    return (
      <div className="p-8 text-center text-cafe-accent">
        <p>Cafetería no encontrada.</p>
      </div>
    )
  }

  const fotos = cafe.fotos.length > 0 ? cafe.fotos : PLACEHOLDER_FOTOS

  return (
    <div className="min-h-screen bg-beige">
      {/* Hero foto */}
      <div className="relative w-full h-64 bg-cafe-accent/20 flex items-center justify-center">
        {cafe.fotos[0] ? (
          <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">☕</span>
        )}
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm text-cafe-dark rounded-full w-9 h-9 flex items-center justify-center shadow text-lg"
        >
          ←
        </button>
        {/* Botón compartir */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-cafe-dark rounded-full w-9 h-9 flex items-center justify-center shadow text-lg"
        >
          {copied ? '✓' : '↑'}
        </button>
      </div>

      <div className="px-5 py-5">
        {/* Nombre + precio */}
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-2xl font-serif font-bold text-cafe-dark leading-tight">{cafe.nombre}</h1>
          <span className="text-base text-cafe-accent font-semibold ml-3 shrink-0 mt-1">{cafe.precio}</span>
        </div>

        {/* Barrio */}
        <p className="text-xs text-cafe-accent/60 mb-3">{cafe.barrio}</p>

        {/* Rating */}
        <div className="text-amber-500 mb-3">
          <StarRating rating={cafe.rating} />
        </div>

        {/* Tipo */}
        <span className="inline-block text-xs bg-beige border border-cafe-accent/30 text-cafe-accent rounded-full px-3 py-1 mb-4">
          {cafe.tipo}
        </span>

        {/* Descripción */}
        <p className="text-sm text-cafe-dark/75 leading-relaxed mb-6">{cafe.descripcion}</p>

        {/* Slide de fotos */}
        <h2 className="text-sm font-semibold text-cafe-dark mb-3">Fotos</h2>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 snap-x snap-mandatory">
          {fotos.map((foto, i) => (
            <div
              key={i}
              className="shrink-0 w-44 h-32 rounded-xl overflow-hidden bg-cafe-accent/15 flex items-center justify-center snap-start"
            >
              {foto ? (
                <img src={foto} alt={`${cafe.nombre} ${i + 1}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl opacity-30">☕</span>
              )}
            </div>
          ))}
        </div>

        {/* Ubicación */}
        {cafe.googleMaps && (
          <a
            href={cafe.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full bg-cafe-dark text-beige text-sm font-semibold py-3 rounded-2xl active:scale-95 transition-transform"
          >
            <span>📍</span> Cómo llegar
          </a>
        )}

        {/* Instagram */}
        {cafe.instagram && (
          <p className="mt-4 text-xs text-cafe-accent/60 text-center">{cafe.instagram}</p>
        )}
      </div>
    </div>
  )
}
