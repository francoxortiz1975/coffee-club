import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import StarRating from '../components/StarRating'
import { useFavoritos } from '../context/FavoritosContext'
import { ArrowLeftIcon, HeartIcon, ShareIcon, CoffeeCupIcon, PinIcon, ExternalLinkIcon, InviteIcon } from '../components/Icons'
import { useVisitas } from '../context/VisitasContext'
import { useRecuerdos } from '../context/RecuerdosContext'
import { useAuth } from '../context/AuthContext'
import RecuerdoModal from '../components/RecuerdoModal'

const PLACEHOLDER_FOTOS = [null, null, null]

export default function CafeDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cafe = cafes.find((c) => c.id === id)
  const [copied, setCopied] = useState(false)
  const { favoritos, toggleFavorito } = useFavoritos()
  const esFavorito = cafe ? favoritos.includes(cafe.id) : false
  const { visitas, toggleVisita } = useVisitas()
  const yaVisitado = cafe ? visitas.includes(cafe.id) : false
  const { user } = useAuth()
  const { getRecuerdo } = useRecuerdos()
  const recuerdo = cafe ? getRecuerdo(cafe.id) : null
  const [recuerdoAbierto, setRecuerdoAbierto] = useState(false)

  // Tracking de engagement para el banner de instalación
  useEffect(() => {
    if (!cafe) return
    const actual = Number(localStorage.getItem('samay_cafe_opens') ?? 0)
    localStorage.setItem('samay_cafe_opens', String(actual + 1))
    window.dispatchEvent(new CustomEvent('samay:cafe-abierto'))
  }, [cafe?.id])

  async function handleShare() {
    const url = window.location.href
    const text = `${cafe.nombre} — ${cafe.especialidad}. Lo encontré en Samay Coffee Club:`
    if (navigator.share) {
      await navigator.share({ title: cafe.nombre, text, url })
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!cafe) {
    return <div className="p-8 text-center text-cafe-accent"><p>Cafetería no encontrada.</p></div>
  }

  const fotos = cafe.fotos.length > 0 ? cafe.fotos : PLACEHOLDER_FOTOS

  return (
    <div className="relative min-h-screen">
      {/* Hero foto */}
      <div className="relative z-10 w-full h-64 bg-cafe-accent/10 flex items-center justify-center">
        {cafe.fotos[0]
          ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
          : <CoffeeCupIcon size={56} className="text-cafe-accent/20" />
        }
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 bg-white/80 backdrop-blur-sm text-cafe-dark rounded-full w-9 h-9 flex items-center justify-center shadow"
          style={{ top: 'calc(16px + env(safe-area-inset-top))' }}
        >
          <ArrowLeftIcon size={18} />
        </button>
        <button
          onClick={() => toggleFavorito(cafe.id)}
          className={`absolute right-16 bg-white/80 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center shadow transition-colors ${esFavorito ? 'text-[#b8d04a]' : 'text-cafe-accent/50'}`}
          style={{ top: 'calc(16px + env(safe-area-inset-top))' }}
        >
          <HeartIcon size={17} filled={esFavorito} />
        </button>
        <button
          onClick={handleShare}
          className="absolute right-4 bg-white/80 backdrop-blur-sm text-cafe-dark rounded-full w-9 h-9 flex items-center justify-center shadow"
          style={{ top: 'calc(16px + env(safe-area-inset-top))' }}
        >
          {copied ? <span className="text-xs font-bold text-green-600">✓</span> : <ShareIcon size={17} />}
        </button>
        {/* Invitar — destacado: café con ícono lima */}
        <Link
          to={`/invitacion/${cafe.id}/setup`}
          className="absolute right-4 bg-cafe-dark text-[#b8d04a] rounded-full w-10 h-10 flex items-center justify-center shadow-lg ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform"
          style={{ top: 'calc(64px + env(safe-area-inset-top))' }}
          aria-label="Invitar"
        >
          <InviteIcon size={18} />
        </Link>
      </div>

      <div className="relative z-10 px-5 py-5">
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-2xl font-serif font-bold text-cafe-dark leading-tight">{cafe.nombre}</h1>
          <span className="text-base text-cafe-accent font-semibold ml-3 shrink-0 mt-1">{cafe.precio}</span>
        </div>

        <p className="text-xs text-cafe-accent/60 mb-3 flex items-center gap-1">
          <PinIcon size={12} />{cafe.barrio}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="text-amber-500">
            <StarRating rating={cafe.rating} />
          </div>
          <button
            onClick={() => toggleVisita(cafe.id)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              yaVisitado
                ? 'bg-cafe-dark text-beige border-cafe-dark'
                : 'border-cafe-accent/30 text-cafe-accent/70'
            }`}
          >
            {yaVisitado ? '✓ Ya lo visité' : 'Me falta visitar'}
          </button>
        </div>

        <span className="inline-block text-xs bg-beige border border-cafe-accent/30 text-cafe-accent rounded-full px-3 py-1 mb-4">
          {cafe.tipo}
        </span>

        {/* Mi recuerdo — visible solo si estás logueado y visitaste */}
        {user && yaVisitado && (
          <div className="mb-5">
            {recuerdo?.foto_url ? (
              <button
                onClick={() => setRecuerdoAbierto(true)}
                className="w-full bg-[#faf4ec] rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
              >
                <div className="flex">
                  <img src={recuerdo.foto_url} alt="" className="w-24 h-24 object-cover shrink-0" />
                  <div className="flex-1 p-3 text-left min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-1">Mi recuerdo</p>
                    {recuerdo.nota ? (
                      <p className="text-xs text-cafe-dark line-clamp-3 leading-snug">{recuerdo.nota}</p>
                    ) : (
                      <p className="text-xs text-cafe-accent/50 italic">Sin nota — toca para editar</p>
                    )}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setRecuerdoAbierto(true)}
                className="w-full flex items-center gap-3 bg-[#faf4ec] border border-dashed border-cafe-accent/30 rounded-2xl px-4 py-3 active:scale-[0.99] transition-transform"
              >
                <div className="text-2xl">📷</div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-serif font-bold text-cafe-dark">Guarda un recuerdo</p>
                  <p className="text-[11px] text-cafe-accent/60">Foto + nota de tu visita</p>
                </div>
                <span className="text-[#b8d04a] text-lg font-bold">+</span>
              </button>
            )}
          </div>
        )}

        <p className="text-sm text-cafe-dark/75 leading-relaxed mb-6">{cafe.descripcion}</p>

        {/* Slide de fotos */}
        <h2 className="text-sm font-semibold text-cafe-dark mb-3">Fotos</h2>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 snap-x snap-mandatory no-scrollbar">
          {fotos.map((foto, i) => (
            <div key={i} className="shrink-0 w-44 h-32 rounded-xl overflow-hidden bg-cafe-accent/10 flex items-center justify-center snap-start">
              {foto
                ? <img src={foto} alt={`${cafe.nombre} ${i + 1}`} className="w-full h-full object-cover" />
                : <CoffeeCupIcon size={28} className="text-cafe-accent/20" />
              }
            </div>
          ))}
        </div>

        {cafe.googleMaps && (
          <a href={cafe.googleMaps} target="_blank" rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center gap-2 w-full bg-cafe-dark text-beige text-sm font-semibold py-3 rounded-2xl active:scale-95 transition-transform">
            <PinIcon size={15} /> Cómo llegar y horarios
          </a>
        )}

        {cafe.instagram && (
          <a href={cafe.instagram.startsWith('http') ? cafe.instagram : `https://instagram.com/${cafe.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full border border-cafe-accent/30 text-cafe-accent text-sm font-medium py-3 rounded-2xl active:scale-95 transition-transform">
            <ExternalLinkIcon size={15} /> Instagram
          </a>
        )}
      </div>

      {recuerdoAbierto && (
        <RecuerdoModal cafe={cafe} onClose={() => setRecuerdoAbierto(false)} />
      )}
    </div>
  )
}
