import { useEffect, useRef, useState } from 'react'
import { XIcon, ArrowLeftIcon } from './Icons'

// Visor fullscreen de fotos con swipe horizontal entre ellas.
// fotos: string[] (URLs)
// indexInicial: número (0-based)
// onClose: callback
export default function PhotoLightbox({ fotos, indexInicial = 0, onClose }) {
  const [index, setIndex] = useState(indexInicial)
  const [offsetX, setOffsetX] = useState(0)
  const [animando, setAnimando] = useState(false)
  const startX = useRef(0)
  const moved = useRef(false)

  // Cerrar con Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, fotos.length])

  function next() {
    if (index < fotos.length - 1) {
      setAnimando(true)
      setIndex(index + 1)
      setOffsetX(0)
      setTimeout(() => setAnimando(false), 280)
    }
  }
  function prev() {
    if (index > 0) {
      setAnimando(true)
      setIndex(index - 1)
      setOffsetX(0)
      setTimeout(() => setAnimando(false), 280)
    }
  }

  function handleTouchStart(e) {
    if (animando) return
    startX.current = e.touches[0].clientX
    moved.current = false
  }
  function handleTouchMove(e) {
    if (animando) return
    const dx = e.touches[0].clientX - startX.current
    if (Math.abs(dx) > 4) moved.current = true
    setOffsetX(dx)
  }
  function handleTouchEnd() {
    if (animando) return
    if (Math.abs(offsetX) > 60) {
      if (offsetX > 0) prev()
      else next()
    } else {
      setOffsetX(0)
    }
  }

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col" onClick={onClose}>
      {/* Botón cerrar */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Cerrar"
        className="absolute z-10 right-4 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center"
        style={{ top: 'calc(16px + env(safe-area-inset-top))' }}
      >
        <XIcon size={20} />
      </button>

      {/* Foto con swipe */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => { if (moved.current) e.stopPropagation() }}
      >
        <img
          src={fotos[index]}
          alt={`Foto ${index + 1}`}
          className="max-w-full max-h-full object-contain select-none pointer-events-none"
          style={{
            transform: `translateX(${offsetX}px)`,
            transition: animando ? 'transform 0.28s ease' : 'none',
          }}
        />
      </div>

      {/* Flechas (desktop) */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev() }}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hidden md:flex"
        >
          <ArrowLeftIcon size={20} />
        </button>
      )}
      {index < fotos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next() }}
          aria-label="Siguiente"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hidden md:flex"
        >
          <ArrowLeftIcon size={20} className="rotate-180" />
        </button>
      )}

      {/* Indicador de páginas (dots) */}
      {fotos.length > 1 && (
        <div
          className="absolute left-0 right-0 flex justify-center gap-2"
          style={{ bottom: 'calc(20px + env(safe-area-inset-bottom))' }}
        >
          {fotos.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'bg-[#b8d04a] w-6' : 'bg-white/30 w-1.5'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
