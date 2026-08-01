import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { CoffeeCupIcon, PinIcon, ArrowLeftIcon } from '../components/Icons'

export default function SwipePage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [seleccionados, setSeleccionados] = useState([])
  const [dragX, setDragX] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  const startXRef = useRef(0)
  const containerRef = useRef(null)

  const currentCafe = cafes[index]
  const nextCafe = cafes[index + 1]
  const isSelected = currentCafe ? seleccionados.includes(currentCafe.id) : false

  // Gestos táctiles de arrastre reactivo (Touch / Pointer Finger Tracking)
  function handleStart(clientX) {
    if (isFlipping) return
    startXRef.current = clientX
  }

  function handleMove(clientX) {
    if (isFlipping || !startXRef.current) return
    const diff = clientX - startXRef.current
    if (index === 0 && diff > 0) {
      setDragX(diff * 0.2) // Resistencia si está en la primera página
      return
    }
    if (index >= cafes.length - 1 && diff < 0) {
      setDragX(diff * 0.2) // Resistencia si está en la última cafetería
      return
    }
    setDragX(diff)
  }

  function handleEnd() {
    if (isFlipping || !startXRef.current) return
    const threshold = 70
    if (dragX < -threshold && index < cafes.length - 1) {
      triggerTurn('next')
    } else if (dragX > threshold && index > 0) {
      triggerTurn('prev')
    } else {
      setDragX(0)
    }
    startXRef.current = 0
  }

  function triggerTurn(dir, forceLike = false) {
    if (isFlipping) return
    setIsFlipping(true)

    let updatedSeleccionados = seleccionados
    if (forceLike && currentCafe && !seleccionados.includes(currentCafe.id)) {
      updatedSeleccionados = [...seleccionados, currentCafe.id]
      setSeleccionados(updatedSeleccionados)
    }

    const isLast = index >= cafes.length - 1

    if (dir === 'next' && isLast) {
      // Si es el último café, pasar la última hoja y redirigir automáticamente
      setDragX(-450)
      setTimeout(() => {
        navigate('/decidir/seleccionados', { state: { seleccionados: updatedSeleccionados } })
      }, 380)
      return
    }

    const targetOffset = dir === 'next' ? -450 : 450
    setDragX(targetOffset)

    setTimeout(() => {
      if (dir === 'next') {
        setIndex((i) => Math.min(cafes.length - 1, i + 1))
      } else {
        setIndex((i) => Math.max(0, i - 1))
      }
      setDragX(0)
      setIsFlipping(false)
    }, 380)
  }

  function toggleChecklist(cafeId) {
    if (isFlipping) return
    const wasSelected = seleccionados.includes(cafeId)

    if (!wasSelected) {
      const updated = [...seleccionados, cafeId]
      setSeleccionados(updated)
      
      // Al marcar con el check manuscrito, pasar la hoja directamente
      setTimeout(() => {
        triggerTurn('next')
      }, 350)
    } else {
      setSeleccionados((prev) => prev.filter((id) => id !== cafeId))
    }
  }

  function handleTerminar() {
    navigate('/decidir/seleccionados', { state: { seleccionados } })
  }

  // Cálculo del ángulo de curvatura 3D y sombras según el desplazamiento del dedo
  const cardWidth = containerRef.current?.offsetWidth || 360
  const progress = Math.max(-1, Math.min(1, dragX / cardWidth))
  
  // Ángulo de doblado de hoja en el lomo (0 a -140 deg al avanzar, 0 a +140 deg al retroceder)
  const turnAngle = progress < 0 ? progress * 135 : progress * 135
  const foldShadowOpacity = Math.min(0.45, Math.abs(progress) * 0.7)

  return (
    <div
      className="fixed inset-0 max-w-md mx-auto h-screen max-h-screen overflow-hidden flex items-center justify-center bg-[#1c120c] select-none"
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
      onPointerDown={(e) => handleStart(e.clientX)}
      onPointerMove={(e) => handleMove(e.clientX)}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
    >
      {/* EL LIBRO OCUPA EL 100% DEL VIEWPORT */}
      <main className="relative z-10 w-full h-full flex items-center justify-center p-2">
        <div
          ref={containerRef}
          className="relative w-full h-full max-h-[calc(100vh-50px)] aspect-[4/6] rounded-r-2xl rounded-l-sm bg-[#fcf8f2] shadow-2xl overflow-hidden"
          style={{ perspective: '1400px' }}
        >
          {/* EFECTO DE PILA DE HOJAS APILADAS EN EL BORDE DERECHO */}
          <div className="absolute top-1 right-[-4px] bottom-1 w-2.5 bg-[#e8ded1] rounded-r border-r border-amber-950/20 z-0" />
          <div className="absolute top-2 right-[-8px] bottom-2 w-2.5 bg-[#ded2c3] rounded-r border-r border-amber-950/30 z-0" />

          {/* Siguiente café (permanece stático debajo mientras la hoja actual se dobla) */}
          {nextCafe && (
            <div className="absolute inset-0 z-10 rounded-r-2xl rounded-l-sm bg-[#fcf8f2] book-paper-texture p-5 sm:p-6 flex flex-col justify-between overflow-hidden opacity-95">
              <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none z-20" />
              
              {/* Encabezado hoja siguiente */}
              <div className="flex justify-between items-center pb-2 border-b border-[#8b5a2b]/20 text-xs font-serif text-[#6b4c3b]/60">
                <span className="font-semibold text-xs">Libro de Cafeterías</span>
                <span className="text-[10px]">Pág. {index + 2} de {cafes.length}</span>
              </div>

              {/* Contenido hoja siguiente */}
              <div className="my-3 flex-1 flex flex-col justify-between filter blur-[0.2px]">
                <div className="w-full h-56 sm:h-64 rounded-xl bg-[#ebdccb] border-4 border-white shadow-sm overflow-hidden">
                  {nextCafe.fotos?.[0] ? (
                    <img src={nextCafe.fotos[0]} alt={nextCafe.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#8b5a2b]/40">
                      <CoffeeCupIcon size={56} />
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-xl font-serif font-bold text-[#3d2b1f]">{nextCafe.nombre}</h3>
                  <p className="text-xs text-[#6b4c3b] font-serif">{nextCafe.barrio}</p>
                </div>
              </div>
            </div>
          )}

          {/* HOJA ACTUAL (SE DOBLA REACTIVAMENTE AL ARRASTRAR CON EL DEDO EN 3D) */}
          {currentCafe && (
            <div
              className="absolute inset-0 z-20 rounded-r-2xl rounded-l-sm bg-[#fcf8f2] preserve-3d"
              style={{
                transformOrigin: progress < 0 ? 'left center' : 'right center',
                transform: `rotateY(${turnAngle}deg)`,
                transition: isFlipping ? 'transform 0.38s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
                boxShadow: progress !== 0 ? `-18px 0 35px rgba(25, 12, 5, ${Math.abs(progress) * 0.5})` : undefined,
              }}
            >
              {/* Sombras de pliegue reflectivas según movimiento */}
              {progress !== 0 && (
                <div
                  className="absolute inset-0 pointer-events-none z-40 transition-opacity"
                  style={{
                    background: progress < 0
                      ? `linear-gradient(to right, transparent 0%, rgba(35, 18, 8, ${foldShadowOpacity}) 75%, rgba(0,0,0,${foldShadowOpacity * 1.3}) 100%)`
                      : `linear-gradient(to left, transparent 0%, rgba(35, 18, 8, ${foldShadowOpacity}) 75%, rgba(0,0,0,${foldShadowOpacity * 1.3}) 100%)`,
                  }}
                />
              )}

              {/* 1. CARA FRONTAL DE LA HOJA (Frente del Café) */}
              <div className="absolute inset-0 bg-[#fcf8f2] book-paper-texture p-5 sm:p-6 flex flex-col justify-between overflow-hidden backface-hidden z-20">
                <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none z-30" />

                {/* ENCABEZADO INTEGRADO */}
                <div className="relative z-30 flex justify-between items-center pb-2 border-b border-[#8b5a2b]/20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/decidir')
                    }}
                    className="flex items-center gap-1 text-[#6b4c3b] hover:text-[#3d2b1f] font-serif transition-colors py-0.5 px-1 font-semibold"
                  >
                    <ArrowLeftIcon size={15} />
                    <span className="text-xs">Decidir</span>
                  </button>

                  <div className="text-center">
                    <span className="font-bold text-[#3d2b1f] block leading-tight text-xs tracking-wider uppercase font-serif">
                      Libro de Cafeterías
                    </span>
                    <span className="text-[10px] text-[#8b5a2b]/70 block font-serif">
                      Pág. {index + 1} de {cafes.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTerminar()
                    }}
                    className="relative z-30 bg-[#7a2e1d] hover:bg-[#913723] text-beige text-[11px] font-serif font-semibold px-2.5 py-1.5 rounded-b-md shadow-md border-t-0 border border-red-950/40 flex items-center gap-1 -mt-2 transition-transform active:translate-y-0.5"
                  >
                    <span>Seleccionados</span>
                    <span className="bg-amber-300 text-amber-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {seleccionados.length}
                    </span>
                  </button>
                </div>

                {/* FOTO + INFO CAFÉ */}
                <div className="relative z-20 my-3 flex-1 flex flex-col justify-between">
                  <div className="relative w-full h-56 sm:h-64 rounded-xl bg-[#ebdccb] border-4 border-white shadow-md overflow-hidden">
                    {currentCafe.fotos?.[0] ? (
                      <img
                        src={currentCafe.fotos[0]}
                        alt={currentCafe.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#8b5a2b]/40 bg-[#f4ebe1]">
                        <CoffeeCupIcon size={56} />
                      </div>
                    )}
                    <span className="absolute bottom-2.5 right-2.5 bg-[#2a1a10]/85 backdrop-blur-md text-amber-200 text-xs font-serif px-3 py-1 rounded-full border border-amber-500/30 font-semibold">
                      {currentCafe.precio}
                    </span>
                  </div>

                  <div className="mt-3 flex-1 flex flex-col justify-center">
                    <h2 className="text-2xl font-serif font-bold text-[#3d2b1f] leading-tight">
                      {currentCafe.nombre}
                    </h2>
                    <p className="text-xs text-[#6b4c3b] font-serif flex items-center gap-1 mt-1">
                      <PinIcon size={12} className="text-[#8b5a2b]" /> {currentCafe.barrio}
                    </p>
                    <p className="text-xs font-medium text-[#5c3a21] mt-1.5 italic">
                      ✨ {currentCafe.especialidad}
                    </p>
                    <p className="text-xs text-[#6b4c3b]/85 mt-2 line-clamp-3 leading-relaxed font-serif">
                      {currentCafe.historia}
                    </p>
                  </div>
                </div>

                {/* CHECKLIST MANUSCRITO RÚSTICO */}
                <div className="relative z-20 pt-2 border-t border-dashed border-[#8b5a2b]/30">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleChecklist(currentCafe.id)
                    }}
                    className="w-full text-left flex items-center gap-3 py-1.5 px-0.5 hover:opacity-85 active:scale-[0.98] transition-all group"
                  >
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#3d2b1f] bg-[#e6d8c3]/80'
                          : 'border-[#6b4c3b]/60 bg-transparent group-hover:border-[#3d2b1f]'
                      }`}
                    >
                      {isSelected ? (
                        <svg
                          className="w-5 h-5 text-[#2a1510] animate-ink-draw"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="font-rustic text-[#8b5a2b]/40 text-xs">✓</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-rustic text-2xl text-[#3d2b1f] font-bold leading-none tracking-wide">
                        {isSelected ? '✓ Me interesa este café' : 'Me interesa este café'}
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. CARA TRASERA DE LA HOJA (REVERSO PERGAMINO LIMPIO AL DOBLAR) */}
              <div className="absolute inset-0 bg-[#fcf8f2] book-paper-texture p-6 flex flex-col items-center justify-between text-center overflow-hidden backface-hidden rotate-y-180 z-10">
                <div className="absolute inset-y-0 right-0 w-6 book-spine-gradient pointer-events-none z-30" />

                <div className="w-full text-right text-[9px] font-serif text-[#6b4c3b]/40 uppercase tracking-widest">
                  SUMAY COFFEE CLUB
                </div>

                <div className="flex flex-col items-center gap-3 my-auto opacity-35">
                  <CoffeeCupIcon size={48} className="text-[#8b5a2b]" />
                  <span className="text-xs font-serif text-[#6b4c3b] tracking-widest uppercase">SUMAY GUÍA</span>
                </div>

                <div className="text-[9px] font-serif text-[#6b4c3b]/40 tracking-wider">
                  QUITO • COLECCIÓN DE CAFETERÍAS
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
