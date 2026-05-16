import { useEffect, useState } from 'react'
import { ShareIcon, ArrowUpIcon, InviteIcon } from './Icons'

function estaInstalada() {
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  if (window.navigator.standalone === true) return true
  return false
}

function esIOS() {
  const ua = window.navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) && !window.MSStream
}

const PASOS_IOS = [
  {
    n: 1,
    Icono: ShareIcon,
    titulo: 'Toca Compartir',
    texto: 'Abre Safari y toca el ícono de Compartir en la barra inferior.',
  },
  {
    n: 2,
    Icono: ArrowUpIcon,
    titulo: 'Añadir a inicio',
    texto: 'Desliza hacia abajo y elige "Añadir a pantalla de inicio".',
  },
  {
    n: 3,
    Icono: InviteIcon,
    titulo: 'Listo',
    texto: 'Toca Añadir y abre Sumay como una app desde tu pantalla principal.',
  },
]

const PASOS_ANDROID = [
  {
    n: 1,
    Icono: ShareIcon,
    titulo: 'Menú del navegador',
    texto: 'Abre Chrome y toca los tres puntos arriba a la derecha.',
  },
  {
    n: 2,
    Icono: ArrowUpIcon,
    titulo: 'Instalar app',
    texto: 'Elige "Instalar aplicación" o "Añadir a pantalla principal".',
  },
  {
    n: 3,
    Icono: InviteIcon,
    titulo: 'Listo',
    texto: 'Confirma y abre Sumay desde tu cajón de apps.',
  },
]

export default function InstallSteps() {
  const [mostrar, setMostrar] = useState(false)
  const [pasos, setPasos] = useState(PASOS_IOS)

  useEffect(() => {
    if (estaInstalada()) {
      setMostrar(false)
      return
    }
    setPasos(esIOS() ? PASOS_IOS : PASOS_ANDROID)
    setMostrar(true)
  }, [])

  if (!mostrar) return null

  return (
    <section className="mt-8 px-4">
      <h2 className="text-base font-serif font-bold text-cafe-dark mb-1">Llévala a tu pantalla</h2>
      <p className="text-xs text-cafe-accent/60 mb-3">Instala Sumay como app y accede a un toque, sin abrir el navegador.</p>
      <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scroll-pl-4 pb-2 snap-x snap-mandatory no-scrollbar">
        {pasos.map(({ n, Icono, titulo, texto }) => (
          <div key={n} className="shrink-0 w-64 bg-[#faf4ec] rounded-2xl p-4 shadow-sm snap-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-full bg-cafe-dark text-beige text-xs font-bold flex items-center justify-center shrink-0">
                {n}
              </span>
              <Icono size={18} className="text-cafe-accent/70" />
            </div>
            <h3 className="text-sm font-serif font-bold text-cafe-dark mb-1 leading-tight">{titulo}</h3>
            <p className="text-[11px] text-cafe-dark/60 leading-relaxed">{texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
