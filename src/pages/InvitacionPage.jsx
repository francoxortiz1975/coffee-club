import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import confetti from 'canvas-confetti'
import cafes from '../data/cafes.json'
import { ShareIcon, ArrowLeftIcon } from '../components/Icons'
import { useInvitaciones } from '../context/InvitacionesContext'

function formatFecha(fechaStr) {
  if (!fechaStr) return null
  const d = new Date(fechaStr + 'T12:00:00')
  return d.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Carta cerrada con animación de apertura. Swipe up o tap → onOpen.
function EnvelopeIntro({ receptor, abriendo, onOpen, logoDataUrl }) {
  const startY = useRef(0)
  const [dy, setDy] = useState(0)

  function handleTouchStart(e) {
    if (abriendo) return
    startY.current = e.touches[0].clientY
  }
  function handleTouchMove(e) {
    if (abriendo) return
    const delta = e.touches[0].clientY - startY.current
    if (delta < 0) setDy(Math.max(delta, -120))
  }
  function handleTouchEnd() {
    if (abriendo) return
    if (dy < -50) onOpen()
    else setDy(0)
  }

  // Estados visuales del flap y body
  const flapStyle = {
    background: 'linear-gradient(135deg, #d4c3a8 0%, #b09872 100%)',
    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
    transformOrigin: 'top',
    transform: abriendo ? 'rotateX(-180deg)' : 'rotateX(0deg)',
    transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
    backfaceVisibility: 'hidden',
  }
  const bodyStyle = {
    background: 'linear-gradient(160deg, #faf4ec 0%, #e8dcc7 100%)',
    opacity: abriendo ? 0 : 1,
    transition: 'opacity 0.4s 0.6s ease',
  }
  const sealStyle = {
    background: 'radial-gradient(circle at 30% 30%, #c8e057 0%, #8a9d2e 70%, #5f6f1f 100%)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.3)',
    opacity: abriendo ? 0 : 1,
    transition: 'opacity 0.3s, transform 0.3s',
    transform: abriendo ? 'scale(0.5)' : 'scale(1)',
  }
  const containerStyle = {
    transform: `translateY(${dy}px) ${abriendo ? 'scale(1.15)' : 'scale(1)'}`,
    transition: abriendo
      ? 'transform 1s ease-in, opacity 0.4s 0.7s ease'
      : (dy === 0 ? 'transform 0.3s ease' : 'none'),
    opacity: abriendo ? 0 : 1,
    perspective: '1000px',
  }

  return (
    <div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center px-8 text-center select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => !abriendo && onOpen()}
      style={{ touchAction: 'none' }}
    >
      {/* Encabezado "Para X" — siempre visible */}
      {receptor && (
        <div style={{ opacity: abriendo ? 0 : 1, transition: 'opacity 0.3s' }}>
          <p className="text-white/60 font-serif italic text-sm mb-1">Para</p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-10 tracking-tight">
            {receptor.toUpperCase()}
          </h2>
        </div>
      )}

      {/* Carta */}
      <div className="relative w-72 h-52" style={containerStyle}>
        {/* Body */}
        <div className="absolute inset-0 rounded-lg shadow-2xl" style={bodyStyle} />
        {/* Flap triangular */}
        <div className="absolute top-0 left-0 right-0 h-1/2" style={flapStyle} />
        {/* Sello de cera */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center z-10"
          style={{ ...sealStyle, top: 'calc(50% - 8px)' }}
        >
          {logoDataUrl
            ? <img src={logoDataUrl} alt="" className="w-9 h-9 object-contain opacity-90" />
            : <span className="text-cafe-dark font-serif font-bold text-2xl">S</span>}
        </div>
      </div>

      {/* Hint deslizar */}
      <div className="mt-10" style={{ opacity: abriendo ? 0 : 1, transition: 'opacity 0.3s' }}>
        <p className="text-white/50 text-3xl leading-none animate-bounce">↑</p>
        <p className="text-white/70 font-serif italic text-sm mt-2">Desliza para abrir</p>
      </div>
    </div>
  )
}

function formatHora(horaStr) {
  if (!horaStr) return null
  const [h, m] = horaStr.split(':')
  const suffix = +h >= 12 ? 'pm' : 'am'
  const h12 = +h % 12 || 12
  return `${h12}:${m} ${suffix}`
}

async function srcToDataUrl(src) {
  try {
    const res = await fetch(src)
    const blob = await res.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch {
    return src
  }
}

export default function InvitacionPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [sharing, setSharing] = useState(false)
  const [coverDataUrl, setCoverDataUrl] = useState(null)
  const [logoDataUrl, setLogoDataUrl] = useState(null)
  const cafe = cafes.find((c) => c.id === id)
  const { agregarRecibida } = useInvitaciones()

  const nombre = params.get('nombre')
  const receptor = params.get('para')
  const fecha = params.get('fecha')
  const hora = params.get('hora')

  // 'cerrada' (mostrar carta) | 'abriendo' (animando) | 'abierta' (invitación visible)
  const [estado, setEstado] = useState('cerrada')

  // Guardar como recibida la primera vez que se abre el link
  // (si yo la envié, el context la ignora).
  useEffect(() => {
    if (!cafe) return
    agregarRecibida({ cafeId: id, nombre: nombre || '', receptor: receptor || '', fecha: fecha || '', hora: hora || '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, nombre, receptor, fecha, hora, cafe])

  function abrirCarta() {
    if (estado !== 'cerrada') return
    setEstado('abriendo')
    // Confetti al inicio de la animación
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#b8d04a', '#d4af37', '#f5f0e8', '#c8a96e', '#fff8e7'],
        shapes: ['circle'],
        scalar: 1,
        gravity: 0.8,
        ticks: 200,
      })
    }, 500)
    // Después de la animación → revelar invitación
    setTimeout(() => setEstado('abierta'), 1100)
  }

  // Preload images as data URLs so html-to-image can capture them
  useEffect(() => {
    if (cafe?.fotos?.[0]) srcToDataUrl(cafe.fotos[0]).then(setCoverDataUrl)
    srcToDataUrl('/logo.png').then(setLogoDataUrl)
  }, [cafe])

  async function handleShare() {
    setSharing(true)
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 })

      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const file = new File([blob], 'invitacion-sumay.png', { type: 'image/png' })

      const mensaje = nombre
        ? `${nombre} te invita a ${cafe.nombre} ☕\n${window.location.href}`
        : `¡Estás invitado a ${cafe.nombre}! ☕\n${window.location.href}`

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: mensaje })
      } else if (navigator.share) {
        await navigator.share({ title: `Invitación a ${cafe.nombre}`, text: mensaje })
      } else {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = 'invitacion-sumay.png'
        a.click()
        await navigator.clipboard.writeText(mensaje)
      }
    } catch {
      // usuario canceló
    } finally {
      setSharing(false)
    }
  }

  if (!cafe) return null

  return (
    <div ref={cardRef} className="min-h-screen relative flex flex-col overflow-hidden">

      {/* Fondo — foto (data URL) o degradado */}
      {coverDataUrl ? (
        <img src={coverDataUrl} alt={cafe.nombre} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #1e0f0b 100%)' }} />
      )}

      {/* Overlay oscuro elegante */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />

      {/* Botón regresar — lleva a Descubrir (onboarding suave para receptores nuevos) */}
      <button
        onClick={() => navigate('/')}
        className="absolute left-5 z-40 text-white/60 hover:text-white transition-colors"
        style={{ top: 'calc(16px + env(safe-area-inset-top))' }}
      >
        <ArrowLeftIcon size={20} />
      </button>

      {/* Carta cerrada — visible mientras estado !== 'abierta' */}
      {estado !== 'abierta' && (
        <EnvelopeIntro
          receptor={receptor}
          abriendo={estado === 'abriendo'}
          onOpen={abrirCarta}
          logoDataUrl={logoDataUrl}
        />
      )}

      {/* Contenido centrado — fade in cuando se abre */}
      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center gap-4 transition-opacity duration-700"
        style={{
          opacity: estado === 'abierta' ? 1 : 0,
          pointerEvents: estado === 'abierta' ? 'auto' : 'none',
        }}
      >

        {logoDataUrl && (
          <img src={logoDataUrl} alt="Sumay" className="h-8 w-auto object-contain opacity-70 mb-2 animate-[fadeUp_0.8s_ease_0.2s_both]" />
        )}

        {receptor && (
          <h2 className="text-3xl font-serif font-bold text-white leading-tight tracking-tight animate-[fadeUp_0.8s_ease_0.4s_both]">
            ¡{receptor.toUpperCase()}!
          </h2>
        )}
        {nombre ? (
          <p className="text-white/85 text-lg font-light tracking-wide animate-[fadeUp_0.8s_ease_0.5s_both]">
            <span className="text-white font-semibold">{nombre}</span> te invita a
          </p>
        ) : (
          <p className="text-white/80 text-lg font-light tracking-wide animate-[fadeUp_0.8s_ease_0.5s_both]">
            Tienes una invitación a
          </p>
        )}

        <h1 className="text-5xl font-serif font-bold text-white leading-tight tracking-tight animate-[fadeUp_0.8s_ease_0.8s_both]">
          {cafe.nombre}
        </h1>

        <p className="text-white/60 text-sm tracking-widest uppercase animate-[fadeUp_0.8s_ease_1s_both]">
          {cafe.barrio}
        </p>

        {(fecha || hora) && (
          <div className="mt-3 border border-white/25 rounded-2xl px-7 py-4 animate-[fadeUp_0.8s_ease_1.2s_both]">
            {fecha && <p className="text-white text-base font-semibold capitalize">{formatFecha(fecha)}</p>}
            {hora && <p className="text-white/75 text-base mt-1">{formatHora(hora)}</p>}
          </div>
        )}
      </div>

      {/* Acciones — Compartir (primary) + Ver más (secondary) */}
      <div
        className="relative z-10 px-6 pb-12 flex flex-col gap-3 transition-opacity duration-700"
        style={{
          opacity: estado === 'abierta' ? 1 : 0,
          pointerEvents: estado === 'abierta' ? 'auto' : 'none',
        }}
      >
        <button
          onClick={handleShare}
          disabled={sharing}
          className="w-full bg-cafe-dark text-[#b8d04a] text-base font-bold py-4 rounded-2xl shadow-lg ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <ShareIcon size={18} />
          {sharing ? 'Preparando...' : 'Compartir invitación'}
        </button>
        <button
          onClick={() => navigate(`/cafe/${id}`)}
          className="w-full bg-beige text-cafe-dark text-sm font-semibold py-3 rounded-2xl active:scale-95 transition-transform"
        >
          Ver más...
        </button>
      </div>
    </div>
  )
}
