import { useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import cafes from '../data/cafes.json'
import { PinIcon, ExternalLinkIcon, ShareIcon, ArrowLeftIcon } from '../components/Icons'

function formatFecha(fechaStr) {
  if (!fechaStr) return null
  const d = new Date(fechaStr + 'T12:00:00')
  return d.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatHora(horaStr) {
  if (!horaStr) return null
  const [h, m] = horaStr.split(':')
  const suffix = +h >= 12 ? 'pm' : 'am'
  const h12 = +h % 12 || 12
  return `${h12}:${m} ${suffix}`
}

export default function InvitacionPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const cafe = cafes.find((c) => c.id === id)

  const nombre = params.get('nombre')
  const fecha = params.get('fecha')
  const hora = params.get('hora')

  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#d4af37', '#f5f0e8', '#c8a96e', '#fff8e7', '#b8962e'],
        shapes: ['circle'],
        scalar: 0.9,
        gravity: 0.8,
        ticks: 200,
      })
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: `Invitación a ${cafe.nombre}`, url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  if (!cafe) return null

  const coverFoto = cafe.fotos?.[0]

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">

      {/* Fondo — foto o degradado */}
      {coverFoto ? (
        <img src={coverFoto} alt={cafe.nombre} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #1e0f0b 100%)' }} />
      )}

      {/* Overlay oscuro elegante */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      {/* Botón regresar */}
      <button
        onClick={() => navigate(`/cafe/${id}`)}
        className="absolute top-12 left-5 z-20 text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeftIcon size={20} />
      </button>

      {/* Botón share */}
      <button
        onClick={handleShare}
        className="absolute top-12 right-5 z-20 text-white/60 hover:text-white transition-colors"
      >
        <ShareIcon size={20} />
      </button>

      {/* Contenido centrado */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">

        {/* Logo pequeño */}
        <img src="/logo.png" alt="Sumay" className="h-8 w-auto object-contain opacity-70 mb-2 animate-[fadeUp_0.8s_ease_0.2s_both]" />

        {/* "X te invita a" */}
        {nombre && (
          <p className="text-white/70 text-sm font-light italic tracking-wide animate-[fadeUp_0.8s_ease_0.5s_both]">
            <span className="text-white font-medium">{nombre}</span> te invita a
          </p>
        )}
        {!nombre && (
          <p className="text-white/60 text-sm font-light italic tracking-wide animate-[fadeUp_0.8s_ease_0.5s_both]">
            Tienes una invitación a
          </p>
        )}

        {/* Nombre del café */}
        <h1 className="text-4xl font-serif font-bold text-white leading-tight tracking-tight animate-[fadeUp_0.8s_ease_0.8s_both]">
          {cafe.nombre}
        </h1>

        {/* Barrio */}
        <p className="text-white/50 text-xs tracking-widest uppercase animate-[fadeUp_0.8s_ease_1s_both]">
          {cafe.barrio}
        </p>

        {/* Fecha y hora */}
        {(fecha || hora) && (
          <div className="mt-2 border border-white/20 rounded-2xl px-6 py-3 animate-[fadeUp_0.8s_ease_1.2s_both]">
            {fecha && <p className="text-white text-sm font-medium capitalize">{formatFecha(fecha)}</p>}
            {hora && <p className="text-white/60 text-sm mt-0.5">{formatHora(hora)}</p>}
          </div>
        )}
      </div>

      {/* Botones abajo */}
      <div className="relative z-10 px-6 pb-12 flex flex-col gap-3 animate-[fadeUp_0.8s_ease_1.5s_both]">
        {cafe.googleMaps && (
          <a
            href={cafe.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white text-cafe-dark text-sm font-semibold py-3.5 rounded-2xl active:scale-95 transition-transform"
          >
            <PinIcon size={15} /> Cómo llegar y horarios
          </a>
        )}
        {cafe.instagram && (
          <a
            href={cafe.instagram.startsWith('http') ? cafe.instagram : `https://instagram.com/${cafe.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white/15 text-white text-sm font-medium py-3.5 rounded-2xl active:scale-95 transition-transform border border-white/20"
          >
            <ExternalLinkIcon size={15} /> Instagram
          </a>
        )}
      </div>
    </div>
  )
}
