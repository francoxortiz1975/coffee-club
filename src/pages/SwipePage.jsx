import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { CoffeeCupIcon, HeartIcon, XIcon, PinIcon } from '../components/Icons'

export default function SwipePage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [seleccionados, setSeleccionados] = useState([])
  const [offsetX, setOffsetX] = useState(0)
  const [animating, setAnimating] = useState(false)
  const startXRef = useRef(0)

  const cafe = cafes[index]

  function handleTouchStart(e) {
    if (animating) return
    startXRef.current = e.touches[0].clientX
  }
  function handleTouchMove(e) {
    if (animating) return
    setOffsetX(e.touches[0].clientX - startXRef.current)
  }
  function handleTouchEnd() {
    if (Math.abs(offsetX) > 80) doSwipe(offsetX > 0 ? 'si' : 'no')
    else setOffsetX(0)
  }

  function doSwipe(dir) {
    if (animating) return
    setAnimating(true)
    if (dir === 'si') setSeleccionados((prev) => [...prev, cafe.id])
    setOffsetX(dir === 'si' ? 500 : -500)
    setTimeout(() => {
      setIndex((i) => i + 1)
      setOffsetX(0)
      setAnimating(false)
    }, 320)
  }

  function handleTerminar() {
    navigate('/decidir/seleccionados', { state: { seleccionados } })
  }

  const rotation = offsetX * 0.04
  const siOpacity = Math.max(0, Math.min(offsetX / 80, 1))
  const noOpacity = Math.max(0, Math.min(-offsetX / 80, 1))

  return (
    <div
      className="relative h-screen flex flex-col overflow-hidden"
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
    >
      {/* Header */}
      <div
        className="relative z-10 flex items-center px-5 pb-4"
        style={{ paddingTop: 'calc(16px + env(safe-area-inset-top))' }}
      >
        <h1 className="text-xl font-serif font-bold text-cafe-dark">Swipe</h1>
      </div>

      {/* Terminar — esquina inferior izquierda */}
      <button
        onClick={handleTerminar}
        className="fixed bottom-28 left-5 z-20 text-sm font-semibold text-cafe-accent bg-white/80 backdrop-blur-sm border border-cafe-accent/30 px-4 py-1.5 rounded-full shadow-sm"
      >
        Terminar
      </button>

      {/* Contenido */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 gap-6 justify-center">
        {cafe ? (
          <>
            <p className="text-xs text-cafe-accent/40">{index + 1} / {cafes.length}</p>

            {/* Card */}
            <div
              className="w-full relative select-none"
              style={{
                transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
                transition: animating ? 'transform 0.32s ease' : 'none',
                touchAction: 'none', // toda la interacción la captura nuestro handler de swipe
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="absolute top-5 left-5 z-10 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full -rotate-12" style={{ opacity: siOpacity }}>
                Me interesa
              </div>
              <div className="absolute top-5 right-5 z-10 bg-red-400 text-white text-sm font-bold px-3 py-1 rounded-full rotate-12" style={{ opacity: noOpacity }}>
                Paso
              </div>

              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="w-full h-64 bg-cafe-accent/10 flex items-center justify-center">
                  {cafe.fotos?.[0]
                    ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
                    : <CoffeeCupIcon size={56} className="text-cafe-accent/20" />}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h2 className="text-lg font-serif font-bold text-cafe-dark">{cafe.nombre}</h2>
                    <span className="text-sm text-cafe-accent font-semibold ml-2">{cafe.precio}</span>
                  </div>
                  <p className="text-xs text-cafe-accent/60 mb-2 flex items-center gap-1">
                    <PinIcon size={11} />{cafe.barrio}
                  </p>
                  <p className="text-sm text-cafe-dark/70 mb-1">{cafe.especialidad}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{cafe.historia}</p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-8 items-center">
              <button onClick={() => doSwipe('no')} className="w-14 h-14 rounded-full border-2 border-red-300 text-red-400 flex items-center justify-center shadow active:scale-90 transition-transform">
                <XIcon size={22} />
              </button>
              <button onClick={() => doSwipe('si')} className="w-14 h-14 rounded-full border-2 border-green-300 text-green-500 flex items-center justify-center shadow active:scale-90 transition-transform">
                <HeartIcon size={22} />
              </button>
            </div>
          </>
        ) : (
          /* Terminó de ver todos */
          <div className="flex flex-col items-center text-center gap-4 px-6">
            <CoffeeCupIcon size={48} className="text-cafe-accent/30" />
            <p className="text-cafe-dark font-serif font-bold text-xl">Eso es todo por ahora</p>
            <p className="text-cafe-accent/50 text-sm">Viste todas las cafeterías disponibles</p>
            <button
              onClick={handleTerminar}
              className="mt-2 bg-cafe-dark text-beige text-sm font-semibold px-8 py-3 rounded-full"
            >
              Ver mis seleccionados
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
