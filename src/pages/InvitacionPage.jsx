import { useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { toPng } from 'html-to-image'
import cafes from '../data/cafes.json'
import { ShareIcon, ArrowLeftIcon } from '../components/Icons'
import { useInvitaciones } from '../context/InvitacionesContext'
import InvitationReveal from '../components/invitation/InvitationReveal'

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
  const cafe = cafes.find((c) => c.id === id)
  const { agregarRecibida } = useInvitaciones()

  const nombre = params.get('nombre')
  const receptor = params.get('para')
  const fecha = params.get('fecha')
  const hora = params.get('hora')

  // 'cerrada' (sealed envelope) | 'abriendo' (animating) | 'abierta' (letter visible)
  const [estado, setEstado] = useState('cerrada')

  // Guardar como recibida la primera vez que se abre el link
  // (si yo la envié, el context la ignora).
  useEffect(() => {
    if (!cafe) return
    agregarRecibida({ cafeId: id, nombre: nombre || '', receptor: receptor || '', fecha: fecha || '', hora: hora || '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, nombre, receptor, fecha, hora, cafe])

  // Preload images as data URLs so html-to-image can capture them
  useEffect(() => {
    if (cafe?.fotos?.[0]) srcToDataUrl(cafe.fotos[0]).then(setCoverDataUrl)
  }, [cafe])

  async function handleShare() {
    setSharing(true)
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 })

      const res = await fetch(dataUrl)
      const blob = await res.blob()
      const file = new File([blob], 'sumay-invitation.png', { type: 'image/png' })

      const mensaje = nombre
        ? `${nombre} invites you to ${cafe.nombre} ☕\n${window.location.href}`
        : `You're invited to ${cafe.nombre}! ☕\n${window.location.href}`

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: mensaje })
      } else if (navigator.share) {
        await navigator.share({ title: `Invitation to ${cafe.nombre}`, text: mensaje })
      } else {
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = 'sumay-invitation.png'
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

  const sealed = estado !== 'abierta'

  return (
    <div ref={cardRef} className="min-h-screen relative flex flex-col overflow-hidden">

      {/* Background: the café's own photo, soft while sealed and clearer once the letter is open */}
      {coverDataUrl ? (
        <img
          src={coverDataUrl}
          alt=""
          className="absolute object-cover"
          style={{
            inset: -24,
            width: 'calc(100% + 48px)',
            height: 'calc(100% + 48px)',
            filter: `blur(${sealed ? 5 : 2}px)`,
            transition: 'filter 1.4s ease',
          }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #1e0f0b 100%)' }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />

      <button
        onClick={() => navigate('/')}
        aria-label="Back"
        className="absolute left-5 z-40 text-white/60 hover:text-white transition-colors"
        style={{ top: 'calc(16px + env(safe-area-inset-top))' }}
      >
        <ArrowLeftIcon size={20} />
      </button>

      <InvitationReveal
        cafe={cafe}
        nombre={nombre}
        receptor={receptor}
        fecha={fecha}
        hora={hora}
        onPhase={setEstado}
      />

      <div className="flex-1" />

      <div
        className="relative z-40 px-6 flex flex-col gap-3"
        style={{
          paddingBottom: 'calc(40px + env(safe-area-inset-bottom))',
          opacity: estado === 'abierta' ? 1 : 0,
          pointerEvents: estado === 'abierta' ? 'auto' : 'none',
          transition: 'opacity .6s ease .1s',
        }}
      >
        <button
          onClick={handleShare}
          disabled={sharing}
          className="w-full text-sm font-semibold tracking-[0.14em] uppercase py-4 rounded-full shadow-lg active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: '#b8d04a', color: '#1f1409' }}
        >
          <ShareIcon size={18} />
          {sharing ? 'Preparing…' : 'Share invitation'}
        </button>
        <button
          onClick={() => navigate(`/cafe/${id}`)}
          className="w-full text-white/70 text-xs tracking-[0.08em] py-2 active:scale-95 transition-transform"
        >
          See more about the café
        </button>
      </div>
    </div>
  )
}
