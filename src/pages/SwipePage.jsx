import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { CoffeeCupIcon, PinIcon, ArrowLeftIcon } from '../components/Icons'

export default function SwipePage() {
  const navigate = useNavigate()
  const [seleccionados, setSeleccionados] = useState([])
  const [currentCafeIndex, setCurrentCafeIndex] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 390, height: 680 })
  const [dragX, setDragX] = useState(0)
  const [flipDirection, setFlipDirection] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const seleccionadosRef = useRef(seleccionados)
  const currentCafeIndexRef = useRef(currentCafeIndex)
  const startXRef = useRef(0)
  const animationTimerRef = useRef(null)

  useEffect(() => {
    seleccionadosRef.current = seleccionados
  }, [seleccionados])

  useEffect(() => {
    currentCafeIndexRef.current = currentCafeIndex
  }, [currentCafeIndex])

  useEffect(() => {
    function updateDimensions() {
      const w = Math.min(window.innerWidth, 440)
      const h = Math.min(window.innerHeight - 40, 800)
      setDimensions({ width: w, height: h })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current)
      }
    }
  }, [])

  const currentCafe = cafes[currentCafeIndex] ?? null
  const nextCafe = cafes[currentCafeIndex + 1] ?? null
  const prevCafe = cafes[currentCafeIndex - 1] ?? null

  function resetDrag() {
    setDragX(0)
    setFlipDirection(null)
    setIsAnimating(false)
  }

  function animateToIndex(nextIndex, direction, finish = 'advance') {
    setIsAnimating(true)
    setFlipDirection(direction)
    setDragX(direction === 'next' ? -dimensions.width : dimensions.width)

    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
    }

    animationTimerRef.current = setTimeout(() => {
      if (finish === 'navigate') {
        navigate('/decidir/seleccionados', { state: { seleccionados: seleccionadosRef.current } })
        return
      }

      setCurrentCafeIndex(nextIndex)
      resetDrag()
    }, 360)
  }

  function startSwipe(event) {
    if (isAnimating) return
    if (event.target.closest('button, a, input, textarea, select')) return

    startXRef.current = event.clientX
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // ignore
    }
  }

  function moveSwipe(event) {
    if (isAnimating || !startXRef.current) return

    const currentIndex = currentCafeIndexRef.current
    const diff = event.clientX - startXRef.current

    if (diff < 0) {
      setFlipDirection('next')
      if (currentIndex >= cafes.length - 1) {
        setDragX(diff * 0.25)
        return
      }
    }

    if (diff > 0) {
      setFlipDirection('prev')
      if (currentIndex <= 0) {
        setDragX(diff * 0.25)
        return
      }
    }

    setFlipDirection(diff < 0 ? 'next' : 'prev')
    setDragX(diff)
  }

  function endSwipe(event) {
    if (isAnimating || !startXRef.current) return

    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // ignore
    }

    const currentIndex = currentCafeIndexRef.current
    const threshold = Math.max(54, dimensions.width * 0.14)

    if (dragX < -threshold) {
      if (currentIndex < cafes.length - 1) {
        animateToIndex(currentIndex + 1, 'next')
      } else {
        animateToIndex(currentIndex, 'next', 'navigate')
      }
    } else if (dragX > threshold && currentIndex > 0) {
      animateToIndex(currentIndex - 1, 'prev')
    } else {
      resetDrag()
    }

    startXRef.current = 0
  }

  function toggleChecklist(cafeId) {
    const wasSelected = seleccionados.includes(cafeId)
    const cafeIdx = cafes.findIndex((cafe) => cafe.id === cafeId)
    const isLastCafe = cafeIdx === cafes.length - 1

    if (!wasSelected) {
      const updated = [...seleccionados, cafeId]
      setSeleccionados(updated)
      seleccionadosRef.current = updated

      setTimeout(() => {
        if (isLastCafe) {
          navigate('/decidir/seleccionados', { state: { seleccionados: updated } })
        } else {
          animateToIndex(cafeIdx + 1, 'next')
        }
      }, 260)
    } else {
      const updated = seleccionados.filter((id) => id !== cafeId)
      setSeleccionados(updated)
      seleccionadosRef.current = updated
    }
  }

  function handleTerminar() {
    navigate('/decidir/seleccionados', { state: { seleccionados: seleccionadosRef.current } })
  }

  const cardWidth = dimensions.width || 390
  const progress = Math.max(-1, Math.min(1, dragX / cardWidth))
  const turnAngle = progress * 180
  const isDragging = Math.abs(progress) > 0.001
  const isNextFlip = flipDirection !== 'prev'
  const foldShadowOpacity = Math.min(0.45, Math.abs(progress) * 0.8)

  return (
    <div
      className="fixed inset-0 max-w-md mx-auto h-screen max-h-screen overflow-hidden flex items-center justify-center bg-[#fcf8f2] select-none"
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
      onPointerDown={startSwipe}
      onPointerMove={moveSwipe}
      onPointerUp={endSwipe}
      onPointerCancel={endSwipe}
    >
      <main className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
        <div
          className="relative flex justify-center items-center w-full h-full"
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        >
          <div className="absolute inset-0 pointer-events-none">
            {prevCafe && currentCafeIndex > 0 && (
              <div className="absolute inset-0 z-0 rounded-r-2xl rounded-l-sm bg-[#fcf8f2] book-paper-texture opacity-75 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none" />
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between opacity-55">
                  <div className="text-center text-[10px] font-serif text-[#6b4c3b]/60 uppercase tracking-widest">
                    Página anterior
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <CoffeeCupIcon size={42} className="text-[#8b5a2b]" />
                    <p className="font-serif text-lg text-[#4b3222]">{prevCafe.nombre}</p>
                  </div>
                  <div className="text-[9px] font-serif text-[#6b4c3b]/40 tracking-wider uppercase text-center">
                    SUMAY COFFEE CLUB
                  </div>
                </div>
              </div>
            )}

            {nextCafe && currentCafeIndex < cafes.length - 1 && (
              <div className="absolute inset-0 z-0 rounded-r-2xl rounded-l-sm bg-[#fcf8f2] book-paper-texture opacity-75 overflow-hidden">
                <div className="absolute inset-y-0 right-0 w-6 book-spine-gradient pointer-events-none" />
                <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between opacity-55">
                  <div className="text-center text-[10px] font-serif text-[#6b4c3b]/60 uppercase tracking-widest">
                    Siguiente página
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <CoffeeCupIcon size={42} className="text-[#8b5a2b]" />
                    <p className="font-serif text-lg text-[#4b3222]">{nextCafe.nombre}</p>
                  </div>
                  <div className="text-[9px] font-serif text-[#6b4c3b]/40 tracking-wider uppercase text-center">
                    SUMAY COFFEE CLUB
                  </div>
                </div>
              </div>
            )}
          </div>

          {currentCafe ? (
            <div className="absolute inset-0 z-20 preserve-3d" style={{ perspective: '1400px' }}>
              {nextCafe && isNextFlip && progress < 0 && (
                <div className="absolute inset-0 z-10 rounded-r-2xl rounded-l-sm bg-[#fcf8f2] book-paper-texture p-5 sm:p-6 flex flex-col justify-between overflow-hidden opacity-95">
                  <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none z-20" />
                  <div className="flex justify-between items-center pb-2 border-b border-[#8b5a2b]/20 text-xs font-serif text-[#6b4c3b]/60">
                    <span className="font-semibold text-xs">Libro de Cafeterías</span>
                    <span className="text-[10px]">Pág. {currentCafeIndex + 2} de {cafes.length}</span>
                  </div>
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

              {prevCafe && !isNextFlip && progress > 0 && (
                <div className="absolute inset-0 z-10 rounded-r-2xl rounded-l-sm bg-[#fcf8f2] book-paper-texture p-5 sm:p-6 flex flex-col justify-between overflow-hidden opacity-95">
                  <div className="absolute inset-y-0 right-0 w-6 book-spine-gradient pointer-events-none z-20" />
                  <div className="flex justify-between items-center pb-2 border-b border-[#8b5a2b]/20 text-xs font-serif text-[#6b4c3b]/60">
                    <span className="font-semibold text-xs">Libro de Cafeterías</span>
                    <span className="text-[10px]">Pág. {currentCafeIndex} de {cafes.length}</span>
                  </div>
                  <div className="my-3 flex-1 flex flex-col justify-between filter blur-[0.2px]">
                    <div className="w-full h-56 sm:h-64 rounded-xl bg-[#ebdccb] border-4 border-white shadow-sm overflow-hidden">
                      {prevCafe.fotos?.[0] ? (
                        <img src={prevCafe.fotos[0]} alt={prevCafe.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#8b5a2b]/40">
                          <CoffeeCupIcon size={56} />
                        </div>
                      )}
                    </div>
                    <div className="mt-3">
                      <h3 className="text-xl font-serif font-bold text-[#3d2b1f]">{prevCafe.nombre}</h3>
                      <p className="text-xs text-[#6b4c3b] font-serif">{prevCafe.barrio}</p>
                    </div>
                  </div>
                </div>
              )}

              <div
                className="absolute inset-0 z-20 rounded-r-2xl rounded-l-sm bg-[#fcf8f2] preserve-3d"
                style={{
                  transformOrigin: isNextFlip ? 'right center' : 'left center',
                  transform: `rotateY(${turnAngle}deg)`,
                  transition: isAnimating ? 'transform 0.36s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
                  boxShadow: isDragging ? `-18px 0 35px rgba(25, 12, 5, ${foldShadowOpacity})` : undefined,
                }}
              >
                {isDragging && (
                  <div
                    className="absolute inset-0 pointer-events-none z-40 transition-opacity"
                    style={{
                      background: isNextFlip
                        ? `linear-gradient(to right, transparent 0%, rgba(35, 18, 8, ${foldShadowOpacity}) 75%, rgba(0,0,0,${foldShadowOpacity * 1.3}) 100%)`
                        : `linear-gradient(to left, transparent 0%, rgba(35, 18, 8, ${foldShadowOpacity}) 75%, rgba(0,0,0,${foldShadowOpacity * 1.3}) 100%)`,
                    }}
                  />
                )}

                <div className="absolute inset-0 bg-[#fcf8f2] book-paper-texture p-5 sm:p-6 flex flex-col justify-between overflow-hidden z-10 backface-hidden">
                  <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none z-20" />

                  <div className="relative z-20 flex justify-between items-center pb-2 border-b border-[#8b5a2b]/20">
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
                        Pág. {currentCafeIndex + 1} de {cafes.length}
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

                  <div className="relative z-10 my-3 flex-1 flex flex-col justify-between">
                    <div className="relative w-full h-60 sm:h-72 rounded-xl bg-[#ebdccb] border-4 border-white shadow-md overflow-hidden">
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

                  <div className="relative z-10 pt-2 border-t border-dashed border-[#8b5a2b]/30">
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
                          seleccionados.includes(currentCafe.id)
                            ? 'border-[#3d2b1f] bg-[#e6d8c3]/80'
                            : 'border-[#6b4c3b]/60 bg-transparent group-hover:border-[#3d2b1f]'
                        }`}
                      >
                        {seleccionados.includes(currentCafe.id) ? (
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
                          {seleccionados.includes(currentCafe.id) ? '✓ Me interesa este café' : 'Me interesa este café'}
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div
                  className="absolute inset-0 bg-[#efe0cd] book-paper-texture p-3 sm:p-4 overflow-hidden z-10 backface-hidden rotate-y-180"
                  style={{ opacity: 1 }}
                >
                  <div className="absolute inset-0 rounded-3xl border border-[#c8b08f] bg-[#e6cfad] shadow-lg overflow-hidden">
                    <div className="absolute inset-y-0 right-0 w-8 book-spine-gradient pointer-events-none z-20" />
                    <div className="absolute left-5 top-5 bottom-5 w-px bg-[#9f8366]/30" />
                    <div className="absolute right-5 top-5 bottom-5 w-px bg-[#9f8366]/18" />

                    <div className="relative z-10 h-full flex flex-col justify-between px-5 py-5 sm:px-6 sm:py-6">
                      <div className="flex items-center justify-between text-[9px] font-serif text-[#5d4331]/55 uppercase tracking-[0.32em]">
                        <span>Back Page</span>
                        <span>SUMAY COFFEE CLUB</span>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-4 text-center my-auto">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-2 border-[#8f6d4d]/30 bg-[#f7ebd7]/75 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]">
                          <CoffeeCupIcon size={48} className="text-[#7a4c24]" />
                        </div>

                        <div className="space-y-1">
                          <div className="text-[11px] uppercase tracking-[0.45em] text-[#6a4a31]/60 font-serif">
                            SUMAY GUÍA
                          </div>
                          <div className="text-4xl sm:text-5xl leading-none font-serif font-bold text-[#4b3222] tracking-[0.08em]">
                            REVERSO
                          </div>
                          <p className="max-w-[12rem] text-[11px] leading-relaxed text-[#5d4331]/78 font-serif">
                            Esta es la cara trasera real de la misma hoja.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-serif text-[#5d4331]/45 uppercase tracking-[0.28em]">
                        <span>Quito</span>
                        <span>Colección de cafeterías</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-[#2d1c13]/92 text-amber-100 px-4 py-1.5 rounded-full text-[11px] font-serif shadow-lg border border-amber-500/20">
              Desliza para girar la hoja
            </div>
          </div>
        </main>
      </div>
    )
}
