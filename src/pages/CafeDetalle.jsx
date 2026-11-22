import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import StarRating from '../components/StarRating'
import { useFavoritos } from '../context/FavoritosContext'
import { ArrowLeftIcon, HeartIcon, ShareIcon, CoffeeCupIcon, CoffeeBeanIcon, CameraIcon, PinIcon, ExternalLinkIcon, InviteIcon } from '../components/Icons'
import { useVisitas } from '../context/VisitasContext'
import { useRecuerdos } from '../context/RecuerdosContext'
import { useAuth } from '../context/AuthContext'
import RecuerdoModal from '../components/RecuerdoModal'
import PhotoLightbox from '../components/PhotoLightbox'
import '../components/slurpTag.css'

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
  const [lightboxIndex, setLightboxIndex] = useState(null) // null = cerrado, número = abierto en esa foto

  // Tracking de engagement para el banner de instalación
  useEffect(() => {
    if (!cafe) return
    const actual = Number(localStorage.getItem('samay_cafe_opens') ?? 0)
    localStorage.setItem('samay_cafe_opens', String(actual + 1))
    window.dispatchEvent(new CustomEvent('samay:cafe-abierto'))
  }, [cafe?.id])

  async function handleShare() {
    const url = window.location.href
    const text = `${cafe.nombre} — ${cafe.especialidad}. Found it on Sumay Coffee Club:`
    if (navigator.share) {
      await navigator.share({ title: cafe.nombre, text, url })
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!cafe) {
    return <div className="p-8 text-center text-cafe-accent"><p>Coffee shop not found.</p></div>
  }

  const fotos = cafe.fotos.length > 0 ? cafe.fotos : PLACEHOLDER_FOTOS

  return (
    <div className="tag tag-paper relative min-h-screen pb-24 -mb-24">
      {/* Hero foto */}
      <div className="relative z-10 w-full h-64 bg-cafe-accent/10 flex items-center justify-center">
        {cafe.fotos[0] ? (
          <button
            onClick={() => setLightboxIndex(0)}
            className="w-full h-full block active:opacity-90"
            aria-label="View photo larger"
          >
            <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
          </button>
        ) : (
          <CoffeeCupIcon size={56} className="text-cafe-accent/20" />
        )}
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
          aria-label="Invite"
        >
          <InviteIcon size={18} />
        </Link>
      </div>

      <div className="relative z-10 px-5 py-5">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-sans font-semibold tracking-[0.12em] mt-1">{cafe.tipo.toUpperCase()}</p>
          {cafe.precio && <span className="tag-stamp">{cafe.precio}</span>}
        </div>
        <span className="tag-rule mt-3" />
        <p className="font-sans text-[20px] mt-3">{cafe.barrio} · {cafe.ciudad}</p>
        <span className="tag-rule thin mt-2" />
        <h1 className="font-sans font-bold text-[38px] leading-[1.02] tracking-tight mt-4">{cafe.nombre}</h1>
        {cafe.rating != null && <div className="mt-3 text-amber-500"><StarRating rating={cafe.rating} /></div>}
        <span className="tag-rule mt-5 mb-5" />

        {/* Visited toggle + Recuerdo — grid 2 columnas */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {/* Izquierda: visited toggle */}
          <button
            onClick={() => toggleVisita(cafe.id)}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-md py-4 px-2 border-[2.5px] border-[var(--ink)] transition-colors ${
              yaVisitado ? 'bg-[var(--ink)] text-[#b8d04a]' : 'text-[var(--ink)]'
            }`}
          >
            <CoffeeBeanIcon size={26} className={yaVisitado ? '' : 'opacity-30'} />
            <span className="text-xs font-semibold leading-tight">
              {yaVisitado ? 'Been here' : 'Still to visit'}
            </span>
          </button>

          {/* Derecha: recuerdo. Solo activa si está logueado + visitado */}
          {user && yaVisitado ? (
            recuerdo?.foto_url ? (
              <button
                onClick={() => setRecuerdoAbierto(true)}
                className="relative rounded-md overflow-hidden shadow-sm active:scale-[0.98] transition-transform"
              >
                <img src={recuerdo.foto_url} alt="" className="w-full h-full object-cover absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 h-full flex flex-col justify-end p-3 text-left min-h-[100px]">
                  <p className="text-[9px] uppercase tracking-widest text-white/70">My memory</p>
                  {recuerdo.nota
                    ? <p className="text-xs text-white font-sans italic line-clamp-2 leading-tight mt-1">"{recuerdo.nota}"</p>
                    : <p className="text-[10px] text-white/60 italic mt-1">Tap to edit</p>}
                </div>
              </button>
            ) : (
              <button
                onClick={() => setRecuerdoAbierto(true)}
                className="flex flex-col items-center justify-center gap-1.5 rounded-md py-4 px-2 border-[2.5px] border-[var(--ink)] active:scale-[0.98] transition-transform"
              >
                <CameraIcon size={26} />
                <span className="text-xs font-semibold leading-tight">Add a memory</span>
              </button>
            )
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 rounded-md py-4 px-2 border-2 border-dashed border-[var(--ink)]/30 opacity-60">
              <CameraIcon size={26} className="opacity-50" />
              <span className="text-[11px] leading-tight text-center">
                {user ? 'Mark as visited first' : 'Sign in to save memories'}
              </span>
            </div>
          )}
        </div>

        {cafe.descripcion && <p className="font-sans font-medium text-[17px] leading-snug border-l-[5px] border-[var(--ink)] pl-4 mb-6">{cafe.descripcion}</p>}

        {/* Slide de fotos — tap abre lightbox fullscreen */}
        <p className="text-[11px] font-sans font-semibold tracking-[0.12em] mb-3">PHOTOS</p>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-5 px-5 snap-x snap-mandatory no-scrollbar">
          {fotos.map((foto, i) => (
            <button
              key={i}
              type="button"
              onClick={() => foto && setLightboxIndex(i)}
              disabled={!foto}
              className="shrink-0 w-44 h-32 rounded-md overflow-hidden bg-[var(--ink)]/10 flex items-center justify-center snap-start active:scale-[0.97] transition-transform"
            >
              {foto
                ? <img src={foto} alt={`${cafe.nombre} ${i + 1}`} className="w-full h-full object-cover" />
                : <CoffeeCupIcon size={28} className="text-cafe-accent/20" />
              }
            </button>
          ))}
        </div>

        {cafe.googleMaps && (
          <a href={cafe.googleMaps} target="_blank" rel="noopener noreferrer"
            className="tag-btn solid mt-6 flex items-center justify-center gap-2 w-full text-sm">
            <PinIcon size={15} /> Directions & hours
          </a>
        )}

        {cafe.instagram && (
          <a href={cafe.instagram.startsWith('http') ? cafe.instagram : `https://instagram.com/${cafe.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
            className="tag-btn mt-3 flex items-center justify-center gap-2 w-full text-sm">
            <ExternalLinkIcon size={15} /> Instagram
          </a>
        )}
      </div>

      {recuerdoAbierto && (
        <RecuerdoModal cafe={cafe} onClose={() => setRecuerdoAbierto(false)} />
      )}

      {lightboxIndex !== null && cafe.fotos.length > 0 && (
        <PhotoLightbox
          fotos={cafe.fotos}
          indexInicial={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
