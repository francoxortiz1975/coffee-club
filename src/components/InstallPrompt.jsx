import { useEffect, useState } from 'react'

const KEY = 'samay_install_dismissed_at'
const COOLDOWN_DIAS = 7

function fueDescartadoRecientemente() {
  const ts = Number(localStorage.getItem(KEY))
  if (!ts) return false
  return Date.now() - ts < COOLDOWN_DIAS * 24 * 60 * 60 * 1000
}

function estaInstalada() {
  // PWA ya en standalone (Android Chrome / iOS Safari añadida al home)
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  if (window.navigator.standalone === true) return true // iOS legacy
  return false
}

function esIOS() {
  const ua = window.navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) && !window.MSStream
}

function esAndroid() {
  return /Android/.test(window.navigator.userAgent)
}

export default function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState(null)
  const [visible, setVisible] = useState(false)
  const [tipo, setTipo] = useState(null) // 'android' | 'ios'

  useEffect(() => {
    if (estaInstalada() || fueDescartadoRecientemente()) return

    // Android: capturar el evento beforeinstallprompt
    function handleBefore(e) {
      e.preventDefault()
      setDeferredEvent(e)
      setTipo('android')
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handleBefore)

    // iOS Safari: no dispara beforeinstallprompt — mostramos modal con instrucciones
    if (esIOS()) {
      const t = setTimeout(() => {
        setTipo('ios')
        setVisible(true)
      }, 1500)
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBefore)
        clearTimeout(t)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBefore)
  }, [])

  function descartar() {
    localStorage.setItem(KEY, String(Date.now()))
    setVisible(false)
  }

  async function instalarAndroid() {
    if (!deferredEvent) return
    deferredEvent.prompt()
    const { outcome } = await deferredEvent.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
    } else {
      descartar()
    }
  }

  if (!visible) return null

  if (tipo === 'android') {
    return (
      <div className="fixed bottom-28 left-4 right-4 max-w-md mx-auto z-40 bg-cafe-dark text-beige rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-[fadeUp_0.5s_ease]">
        <img src="/icons/icon-180.png" alt="" className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-serif font-bold">Instalar Sumay</p>
          <p className="text-[11px] text-beige/60">Acceso rápido desde tu pantalla de inicio</p>
        </div>
        <button onClick={descartar} className="text-beige/40 px-2 py-1 text-sm" aria-label="Cerrar">×</button>
        <button
          onClick={instalarAndroid}
          className="bg-[#b8d04a] text-cafe-dark text-xs font-bold px-3 py-2 rounded-xl active:scale-95 transition-transform shrink-0"
        >
          Instalar
        </button>
      </div>
    )
  }

  // iOS modal con instrucciones
  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end justify-center p-4 animate-[fadeUp_0.4s_ease]"
      onClick={descartar}
    >
      <div
        className="bg-[#faf4ec] rounded-3xl p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-3">
          <img src="/icons/icon-180.png" alt="" className="w-16 h-16 rounded-2xl shadow" />
        </div>
        <h3 className="text-lg font-serif font-bold text-cafe-dark text-center mb-1">
          Instala Sumay en tu iPhone
        </h3>
        <p className="text-xs text-cafe-accent/60 text-center mb-5">
          Tenla siempre a un toque desde tu pantalla de inicio.
        </p>

        <ol className="text-sm text-cafe-dark space-y-3 mb-5">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cafe-dark text-beige text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <span>
              Toca el ícono de <span className="font-semibold">Compartir</span>
              <span className="inline-block ml-1 align-middle text-base">⎙</span>
              {' '}en la barra de Safari.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cafe-dark text-beige text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <span>Desliza y elige <span className="font-semibold">"Añadir a pantalla de inicio"</span>.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-cafe-dark text-beige text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <span>Toca <span className="font-semibold">Añadir</span>.</span>
          </li>
        </ol>

        <button
          onClick={descartar}
          className="w-full py-3 rounded-2xl text-sm font-semibold border border-cafe-accent/25 text-cafe-accent active:scale-95 transition-transform"
        >
          Ahora no
        </button>
      </div>
    </div>
  )
}
