import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageFlip } from 'page-flip'
import cafes from '../data/cafes.json'
import { CoffeeCupIcon, PinIcon, ArrowLeftIcon } from '../components/Icons'

export default function SwipePage() {
  const navigate = useNavigate()
  const [seleccionados, setSeleccionados] = useState([])
  const [currentCafeIndex, setCurrentCafeIndex] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 390, height: 680 })

  const bookContainerRef = useRef(null)
  const pageFlipRef = useRef(null)
  const seleccionadosRef = useRef(seleccionados)

  // Sincronizar seleccionadosRef
  useEffect(() => {
    seleccionadosRef.current = seleccionados
  }, [seleccionados])

  // Calcular dimensiones ocupando el 100% exacto de la pantalla sin fondo café alrededor
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

  // Inicializar PageFlip a pantalla completa
  useEffect(() => {
    if (!bookContainerRef.current) return

    const timer = setTimeout(() => {
      try {
        const pages = bookContainerRef.current.querySelectorAll('.st-page')
        if (pages.length === 0) return

        if (pageFlipRef.current) {
          try { pageFlipRef.current.destroy() } catch (e) { /* ignore */ }
        }

        const pageFlip = new PageFlip(bookContainerRef.current, {
          width: dimensions.width,
          height: dimensions.height,
          size: 'fixed',
          minWidth: 280,
          maxWidth: 480,
          minHeight: 460,
          maxHeight: 850,
          drawShadow: true,
          maxShadowOpacity: 0.45,
          showCover: false,
          usePortrait: true,
          startPage: 0,
          flippingTime: 550,
          useMouseEvents: true,
          swipeDistance: 25,
          clickEventForward: false,
          mobileScrollSupport: false,
        })

        pageFlip.loadFromHTML(pages)

        pageFlip.on('flip', (e) => {
          const pageIdx = e.data
          setCurrentCafeIndex(Math.min(pageIdx, cafes.length))

          // Al hojear hasta el final, redirigir automáticamente a Seleccionados
          if (pageIdx >= cafes.length) {
            setTimeout(() => {
              navigate('/decidir/seleccionados', { state: { seleccionados: seleccionadosRef.current } })
            }, 450)
          }
        })

        pageFlipRef.current = pageFlip
      } catch (err) {
        console.error('Error inicializando PageFlip:', err)
      }
    }, 150)

    return () => {
      clearTimeout(timer)
      if (pageFlipRef.current) {
        try { pageFlipRef.current.destroy() } catch (e) { /* ignore */ }
      }
    }
  }, [dimensions, navigate])

  function toggleChecklist(cafeId) {
    const wasSelected = seleccionados.includes(cafeId)
    const isLastCafe = cafeId === cafes[cafes.length - 1].id

    if (!wasSelected) {
      const updated = [...seleccionados, cafeId]
      setSeleccionados(updated)
      seleccionadosRef.current = updated

      setTimeout(() => {
        if (isLastCafe || currentCafeIndex >= cafes.length - 1) {
          navigate('/decidir/seleccionados', { state: { seleccionados: updated } })
        } else if (pageFlipRef.current) {
          pageFlipRef.current.flipNext()
        }
      }, 400)
    } else {
      const updated = seleccionados.filter((id) => id !== cafeId)
      setSeleccionados(updated)
      seleccionadosRef.current = updated
    }
  }

  function handleTerminar() {
    navigate('/decidir/seleccionados', { state: { seleccionados: seleccionadosRef.current } })
  }

  return (
    <div
      className="fixed inset-0 max-w-md mx-auto h-screen max-h-screen overflow-hidden flex items-center justify-center bg-[#fcf8f2] select-none"
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
    >
      {/* TODO EL SCREEN ES 100% LA HOJA DEL LIBRO (SIN FONDO CAFÉ EXTERNO) */}
      <main className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
        <div
          className="relative flex justify-center items-center w-full h-full"
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        >
          <div
            ref={bookContainerRef}
            className="w-full h-full bg-[#fcf8f2] overflow-hidden"
            style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
          >
            {cafes.map((cafe, i) => {
              const isSelected = seleccionados.includes(cafe.id)
              return (
                /* 1 HOJA POR CAFÉ: FRENTE E INVERSO EN FULL SCREEN */
                <div
                  key={cafe.id}
                  className="st-page relative bg-[#fcf8f2] border-0 overflow-hidden preserve-3d"
                  style={{ backgroundColor: '#fcf8f2', opacity: 1 }}
                  data-density="soft"
                >
                  {/* A) CARA FRONTAL (Frente pergamino completo) */}
                  <div className="absolute inset-0 bg-[#fcf8f2] book-paper-texture p-5 sm:p-6 flex flex-col justify-between overflow-hidden backface-hidden z-10">
                    {/* Lomo sutil izquierdo */}
                    <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none z-20" />

                    {/* ENCABEZADO INTEGRADO DENTRO DE LA HOJA DEL LIBRO */}
                    <div className="relative z-20 flex justify-between items-center pb-2 border-b border-[#8b5a2b]/20">
                      {/* Botón Volver */}
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

                      {/* Título de la Guía y Folio */}
                      <div className="text-center">
                        <span className="font-bold text-[#3d2b1f] block leading-tight text-xs tracking-wider uppercase font-serif">
                          Libro de Cafeterías
                        </span>
                        <span className="text-[10px] text-[#8b5a2b]/70 block font-serif">
                          Pág. {i + 1} de {cafes.length}
                        </span>
                      </div>

                      {/* Ribbon Marcador de Seleccionados Integrado */}
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

                    {/* CONTENIDO PRINCIPAL: FOTO AMPLIADA + DETALLES */}
                    <div className="relative z-10 my-3 flex-1 flex flex-col justify-between">
                      {/* Foto marco vintage ocupando espacio amplio */}
                      <div className="relative w-full h-60 sm:h-72 rounded-xl bg-[#ebdccb] border-4 border-white shadow-md overflow-hidden">
                        {cafe.fotos?.[0] ? (
                          <img
                            src={cafe.fotos[0]}
                            alt={cafe.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#8b5a2b]/40 bg-[#f4ebe1]">
                            <CoffeeCupIcon size={56} />
                          </div>
                        )}
                        <span className="absolute bottom-2.5 right-2.5 bg-[#2a1a10]/85 backdrop-blur-md text-amber-200 text-xs font-serif px-3 py-1 rounded-full border border-amber-500/30 font-semibold">
                          {cafe.precio}
                        </span>
                      </div>

                      {/* Detalles del café */}
                      <div className="mt-3 flex-1 flex flex-col justify-center">
                        <h2 className="text-2xl font-serif font-bold text-[#3d2b1f] leading-tight">
                          {cafe.nombre}
                        </h2>
                        <p className="text-xs text-[#6b4c3b] font-serif flex items-center gap-1 mt-1">
                          <PinIcon size={12} className="text-[#8b5a2b]" /> {cafe.barrio}
                        </p>
                        <p className="text-xs font-medium text-[#5c3a21] mt-1.5 italic">
                          ✨ {cafe.especialidad}
                        </p>
                        <p className="text-xs text-[#6b4c3b]/85 mt-2 line-clamp-3 leading-relaxed font-serif">
                          {cafe.historia}
                        </p>
                      </div>
                    </div>

                    {/* CHECKLIST MANUSCRITO RÚSTICO INTEGRADO AL PIE DE PÁGINA */}
                    <div className="relative z-10 pt-2 border-t border-dashed border-[#8b5a2b]/30">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleChecklist(cafe.id)
                        }}
                        className="w-full text-left flex items-center gap-3 py-1.5 px-0.5 hover:opacity-85 active:scale-[0.98] transition-all group"
                      >
                        {/* Casilla rústica */}
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

                  {/* B) CARA TRASERA (Reverso limpio pergamino) */}
                  <div className="absolute inset-0 bg-[#fcf8f2] book-paper-texture p-6 flex flex-col items-center justify-between text-center overflow-hidden backface-hidden rotate-y-180 z-0">
                    <div className="absolute inset-y-0 right-0 w-6 book-spine-gradient pointer-events-none z-20" />
                    
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
              )
            })}

            {/* HOJA FINAL DE PORTADA TRASERA */}
            <div
              className="st-page relative bg-[#fcf8f2] border-0 overflow-hidden preserve-3d"
              style={{ backgroundColor: '#fcf8f2', opacity: 1 }}
              data-density="hard"
            >
              <div className="absolute inset-0 bg-[#fcf8f2] book-paper-texture p-6 flex flex-col items-center justify-between text-center overflow-hidden backface-hidden z-10">
                <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none z-20" />

                <div className="text-[9px] font-serif text-[#6b4c3b]/50 uppercase tracking-widest">
                  PORTADA TRASERA
                </div>

                <div className="flex flex-col items-center gap-4 my-auto">
                  <div className="w-20 h-20 rounded-full bg-[#ebdccb] flex items-center justify-center text-[#5c3a21] shadow-inner">
                    <CoffeeCupIcon size={40} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#3d2b1f]">¡Has llegado al final!</h2>
                  <p className="font-rustic text-3xl text-[#8b5a2b] font-bold">
                    Guardaste {seleccionados.length} cafeterías
                  </p>
                  <button
                    type="button"
                    onClick={handleTerminar}
                    className="mt-2 bg-[#3d2b1f] hover:bg-[#523b2c] text-beige font-serif text-sm font-semibold px-8 py-3.5 rounded-full shadow-md active:scale-95 transition-transform"
                  >
                    Ver mis cafeterías seleccionadas
                  </button>
                </div>

                <div className="text-[9px] font-serif text-[#6b4c3b]/40 tracking-wider">
                  SUMAY COFFEE CLUB • QUITO
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
