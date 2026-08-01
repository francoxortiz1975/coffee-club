import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageFlip } from 'page-flip'
import cafes from '../data/cafes.json'
import { CoffeeCupIcon, PinIcon, ArrowLeftIcon } from '../components/Icons'

export default function SwipePage() {
  const navigate = useNavigate()
  const [seleccionados, setSeleccionados] = useState([])
  const [currentCafeIndex, setCurrentCafeIndex] = useState(0)

  const bookContainerRef = useRef(null)
  const pageFlipRef = useRef(null)

  // Crear la lista de hojas: para cada café se genera (Frente + Reverso Blanco) + Hoja Final
  useEffect(() => {
    if (!bookContainerRef.current) return

    const timer = setTimeout(() => {
      try {
        const pages = bookContainerRef.current.querySelectorAll('.st-page')
        if (pages.length === 0) return

        // Destruir instancia previa si existe
        if (pageFlipRef.current) {
          try { pageFlipRef.current.destroy() } catch (e) { /* ignore */ }
        }

        const pageFlip = new PageFlip(bookContainerRef.current, {
          width: 340,
          height: 490,
          size: 'fixed',
          minWidth: 280,
          maxWidth: 380,
          minHeight: 420,
          maxHeight: 560,
          drawShadow: true,
          maxShadowOpacity: 0.35,
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
          const pageNum = e.data
          // Cada café ocupa 2 páginas (frente y reverso)
          const cafeIdx = Math.floor(pageNum / 2)
          setCurrentCafeIndex(Math.min(cafeIdx, cafes.length))
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
  }, [])

  function toggleChecklist(cafeId) {
    const wasSelected = seleccionados.includes(cafeId)
    if (!wasSelected) {
      setSeleccionados((prev) => [...prev, cafeId])
      // Al hacer check, voltear 2 páginas (frente + reverso) para pasar al siguiente café
      setTimeout(() => {
        if (pageFlipRef.current) {
          pageFlipRef.current.flipNext()
        }
      }, 350)
    } else {
      setSeleccionados((prev) => prev.filter((id) => id !== cafeId))
    }
  }

  function handleTerminar() {
    navigate('/decidir/seleccionados', { state: { seleccionados } })
  }

  const isEnd = currentCafeIndex >= cafes.length

  return (
    <div
      className="fixed inset-0 max-w-md mx-auto h-screen max-h-screen overflow-hidden flex flex-col justify-between bg-[#241710] select-none"
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
    >
      {/* Encabezado fijo superior */}
      <header
        className="relative z-30 flex items-center justify-between px-5 pb-2 text-beige/90 bg-[#241710]"
        style={{ paddingTop: 'calc(12px + env(safe-area-inset-top))' }}
      >
        <button
          onClick={() => navigate('/decidir')}
          className="flex items-center gap-1 text-xs text-beige/70 hover:text-beige transition-colors py-1"
        >
          <ArrowLeftIcon size={16} /> Decidir
        </button>

        <div className="text-center">
          <h1 className="text-sm font-serif font-bold text-beige tracking-wide">Libro de Cafeterías</h1>
        </div>

        {/* Ribbon Marcador de Seleccionados */}
        <button
          onClick={handleTerminar}
          className="relative z-30 bg-[#7a2e1d] hover:bg-[#913723] text-beige text-xs font-serif font-semibold px-3 py-1.5 rounded-b-md shadow-md border-t-0 border border-red-950/40 flex items-center gap-1.5 transition-transform active:translate-y-0.5"
        >
          <span>Seleccionados</span>
          <span className="bg-amber-300 text-amber-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {seleccionados.length}
          </span>
        </button>
      </header>

      {/* ÁREA CENTRAL DEL LIBRO (FIJA SIN SCROLL) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-3 py-1 overflow-hidden">
        <div className="w-full max-w-[340px] flex flex-col items-center">
          
          {/* Indicador de página superior */}
          <div className="w-full flex justify-between items-center px-1 mb-1.5 text-[11px] font-serif text-beige/60">
            <span>{currentCafeIndex > 0 ? '← Desliza esquina' : ''}</span>
            <span>
              {isEnd ? 'Fin del libro' : `Página ${currentCafeIndex + 1} de ${cafes.length}`}
            </span>
            <span>{!isEnd ? 'Arrastra hoja →' : ''}</span>
          </div>

          {/* CONTENEDOR 3D DE PÁGINAS PAGEFLIP */}
          <div className="relative w-[340px] h-[490px] flex justify-center items-center">
            <div
              ref={bookContainerRef}
              className="w-[340px] h-[490px] shadow-2xl rounded-r-xl rounded-l-sm bg-[#fcf8f2] overflow-hidden"
            >
              {cafes.map((cafe, i) => {
                const isSelected = seleccionados.includes(cafe.id)
                return [
                  /* 1. FRENTE DE LA HOJA: INFO DEL CAFÉ */
                  <div
                    key={`front-${cafe.id}`}
                    className="st-page bg-[#fcf8f2] border border-amber-900/20 p-4 flex flex-col justify-between overflow-hidden shadow-sm"
                    style={{ backgroundColor: '#fcf8f2', opacity: 1 }}
                    data-density="soft"
                  >
                    {/* Lomo sutil izquierdo */}
                    <div className="absolute inset-y-0 left-0 w-5 book-spine-gradient pointer-events-none z-20" />

                    {/* Encabezado Hoja */}
                    <div className="relative z-10 flex justify-between items-center pb-1.5 border-b border-[#8b5a2b]/15 text-[9px] font-serif text-[#6b4c3b]/70 uppercase tracking-widest">
                      <span className="font-semibold">SUMAY SELECCIÓN</span>
                      <span>HOJA #{i + 1}</span>
                    </div>

                    {/* Foto + Info */}
                    <div className="relative z-10 my-1 flex-1 flex flex-col justify-around">
                      {/* Foto marco blanco vintage */}
                      <div className="relative w-full h-40 rounded-lg bg-[#ebdccb] border-4 border-white shadow-sm overflow-hidden">
                        {cafe.fotos?.[0] ? (
                          <img
                            src={cafe.fotos[0]}
                            alt={cafe.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#8b5a2b]/40 bg-[#f4ebe1]">
                            <CoffeeCupIcon size={40} />
                          </div>
                        )}
                        <span className="absolute bottom-2 right-2 bg-[#2a1a10]/85 backdrop-blur-md text-amber-200 text-xs font-serif px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          {cafe.precio}
                        </span>
                      </div>

                      {/* Detalles */}
                      <div className="mt-1">
                        <h2 className="text-lg font-serif font-bold text-[#3d2b1f] leading-tight">
                          {cafe.nombre}
                        </h2>
                        <p className="text-xs text-[#6b4c3b] font-serif flex items-center gap-1 mt-0.5">
                          <PinIcon size={11} className="text-[#8b5a2b]" /> {cafe.barrio}
                        </p>
                        <p className="text-xs font-medium text-[#5c3a21] mt-1 italic">
                          ✨ {cafe.especialidad}
                        </p>
                        <p className="text-[11px] text-[#6b4c3b]/85 mt-1 line-clamp-2 leading-relaxed font-serif">
                          {cafe.historia}
                        </p>
                      </div>
                    </div>

                    {/* CHECKLIST MANUSCRITO ELEGANTE Y DISCRETO (SIN TEXTOS EXPLICITOS NI BOTONES REPETIDOS) */}
                    <div className="relative z-10 pt-2 border-t border-dashed border-[#8b5a2b]/25">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleChecklist(cafe.id)
                        }}
                        className={`w-full text-left flex items-center gap-3 p-2 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-[#eadacb] border-[#8b5a2b]/40 shadow-sm'
                            : 'bg-white/80 border-[#8b5a2b]/20 hover:bg-white'
                        }`}
                      >
                        {/* Casilla manuscrita */}
                        <div
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#3d2b1f] bg-[#dfcca7]'
                              : 'border-[#8b5a2b]/60 bg-white'
                          }`}
                        >
                          {isSelected ? (
                            <svg
                              className="w-4 h-4 text-[#2a1510] animate-ink-draw"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <span className="font-handwriting text-[#8b5a2b]/40 text-xs">✓</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-handwriting text-lg text-[#3d2b1f] font-bold leading-none">
                            {isSelected ? 'Me interesa este café (Guardado)' : 'Me interesa este café'}
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>,

                  /* 2. REVERSO DE LA HOJA: BLANCO/CREMA LIMPIO SIN REFLEJOS O TRANSPARENCIAS */
                  <div
                    key={`back-${cafe.id}`}
                    className="st-page bg-[#fcf8f2] border border-amber-900/20 p-5 flex flex-col items-center justify-between text-center overflow-hidden shadow-sm"
                    style={{ backgroundColor: '#fcf8f2', opacity: 1 }}
                    data-density="soft"
                  >
                    {/* Lomo sutil derecho (al ser reverso) */}
                    <div className="absolute inset-y-0 right-0 w-5 book-spine-gradient pointer-events-none z-20" />

                    <div className="w-full text-right text-[9px] font-serif text-[#6b4c3b]/40 uppercase tracking-widest">
                      NOTAS DE GUÍA
                    </div>

                    <div className="flex flex-col items-center gap-2 my-auto opacity-40">
                      <CoffeeCupIcon size={32} className="text-[#8b5a2b]" />
                      <p className="font-handwriting text-xl text-[#6b4c3b] max-w-[200px] leading-snug">
                        "El café conecta historias, momentos y personas."
                      </p>
                    </div>

                    <div className="text-[9px] font-serif text-[#6b4c3b]/40 tracking-wider">
                      SUMAY COFFEE CLUB
                    </div>
                  </div>
                ]
              }).flat()}

              {/* HOJA FINAL DE CIERRE DEL LIBRO (SIN ERRORES AL INTENTAR SEGUIR PASANDO) */}
              <div
                className="st-page bg-[#fcf8f2] border border-amber-900/20 p-6 flex flex-col items-center justify-between text-center overflow-hidden shadow-sm"
                style={{ backgroundColor: '#fcf8f2', opacity: 1 }}
                data-density="hard"
              >
                <div className="absolute inset-y-0 left-0 w-5 book-spine-gradient pointer-events-none z-20" />

                <div className="text-[9px] font-serif text-[#6b4c3b]/50 uppercase tracking-widest">
                  PORTADA TRASERA
                </div>

                <div className="flex flex-col items-center gap-3 my-auto">
                  <div className="w-14 h-14 rounded-full bg-[#ebdccb] flex items-center justify-center text-[#5c3a21] shadow-inner">
                    <CoffeeCupIcon size={28} />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#3d2b1f]">¡Has llegado al final!</h2>
                  <p className="font-handwriting text-xl text-[#8b5a2b] font-bold">
                    Guardaste {seleccionados.length} cafeterías
                  </p>
                  <button
                    type="button"
                    onClick={handleTerminar}
                    className="mt-2 bg-[#3d2b1f] hover:bg-[#523b2c] text-beige font-serif text-xs font-semibold px-6 py-2.5 rounded-full shadow-md active:scale-95 transition-transform"
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

      {/* Pie de página minimalista fijo */}
      <footer className="relative z-30 py-2 text-center bg-[#241710]">
        <p className="text-[10px] text-beige/40 font-serif">
          Sumay Coffee Club • Guía de Cafeterías
        </p>
      </footer>
    </div>
  )
}
