import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageFlip } from 'page-flip'
import cafes from '../data/cafes.json'
import { CoffeeCupIcon, PinIcon, ArrowLeftIcon } from '../components/Icons'

export default function SwipePage() {
  const navigate = useNavigate()
  const [seleccionados, setSeleccionados] = useState([])
  const [currentPage, setCurrentPage] = useState(0)

  const bookContainerRef = useRef(null)
  const pageFlipRef = useRef(null)

  // Inicializar la librería PageFlip con física 3D de papel real (doblado curvo, sombras y esquinas)
  useEffect(() => {
    if (!bookContainerRef.current) return

    // Esperar a que el DOM monte todas las páginas
    const timer = setTimeout(() => {
      try {
        const pages = bookContainerRef.current.querySelectorAll('.st-page')
        if (pages.length === 0) return

        const pageFlip = new PageFlip(bookContainerRef.current, {
          width: 350,
          height: 520,
          size: 'fixed',
          minWidth: 280,
          maxWidth: 420,
          minHeight: 440,
          maxHeight: 620,
          drawShadow: true,
          maxShadowOpacity: 0.6,
          showCover: false,
          usePortrait: true,
          startPage: 0,
          flippingTime: 600,
          useMouseEvents: true,
          swipeDistance: 30,
          clickEventForward: true,
        })

        pageFlip.loadFromHTML(pages)

        pageFlip.on('flip', (e) => {
          setCurrentPage(e.data)
        })

        pageFlipRef.current = pageFlip
      } catch (err) {
        console.error('Error inicializando PageFlip:', err)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy()
        } catch (e) {
          // ignore cleanup errors
        }
      }
    }
  }, [])

  function toggleChecklist(cafeId) {
    const wasSelected = seleccionados.includes(cafeId)
    if (!wasSelected) {
      setSeleccionados((prev) => [...prev, cafeId])
      // Al marcar, avanzar automáticamente con animación de física de doblado
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

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#241710] select-none">
      {/* Encabezado limpio */}
      <header
        className="relative z-20 flex items-center justify-between px-5 pb-3 text-beige/90"
        style={{ paddingTop: 'calc(14px + env(safe-area-inset-top))' }}
      >
        <button
          onClick={() => navigate('/decidir')}
          className="flex items-center gap-1.5 text-xs text-beige/70 hover:text-beige transition-colors"
        >
          <ArrowLeftIcon size={18} /> Decidir
        </button>

        <div className="text-center">
          <h1 className="text-base font-serif font-bold text-beige tracking-wide">Libro de Cafeterías</h1>
        </div>

        {/* Ribbon Marcador de Seleccionados */}
        <button
          onClick={handleTerminar}
          className="relative z-30 bg-[#7a2e1d] hover:bg-[#913723] text-beige text-xs font-serif font-semibold px-3 py-2 rounded-b-md shadow-md border-t-0 border border-red-950/40 flex items-center gap-1.5 transition-transform active:translate-y-0.5"
        >
          <span>Seleccionados</span>
          <span className="bg-amber-300 text-amber-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {seleccionados.length}
          </span>
        </button>
      </header>

      {/* ÁREA DEL LIBRO (PAGE-FLIP CON FÍSICA DE HOJA CURVA) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2">
        <div className="w-full max-w-sm flex flex-col items-center">
          
          {/* Indicador de página superior */}
          <div className="w-full flex justify-between items-center px-2 mb-2 text-xs font-serif text-beige/60">
            <span>{currentPage > 0 ? '← Desliza esquina para regresar' : ''}</span>
            <span>Página {Math.min(currentPage + 1, cafes.length)} de {cafes.length}</span>
            <span>Arrastra la hoja →</span>
          </div>

          {/* CONTENEDOR DE PÁGINAS PAGEFLIP */}
          <div className="relative w-full max-w-[350px] aspect-[4/5.4] flex justify-center items-center">
            <div ref={bookContainerRef} className="w-[350px] h-[520px] shadow-2xl rounded-r-xl rounded-l-sm">
              {cafes.map((cafe, i) => {
                const isSelected = seleccionados.includes(cafe.id)
                return (
                  <div
                    key={cafe.id}
                    className="st-page bg-[#fcf8f2] book-paper-texture border border-amber-900/20 p-5 flex flex-col justify-between overflow-hidden shadow-md"
                    data-density="soft"
                  >
                    {/* Lomo / Pliegue lateral sutil */}
                    <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none z-20" />

                    {/* Encabezado Hoja */}
                    <div className="relative z-10 flex justify-between items-center pb-2 border-b border-[#8b5a2b]/15 text-[10px] font-serif text-[#6b4c3b]/70 uppercase tracking-widest">
                      <span className="font-semibold">SUMAY SELECCIÓN</span>
                      <span>HOJA #{i + 1}</span>
                    </div>

                    {/* Contenido principal del café */}
                    <div className="relative z-10 my-2 flex-1 flex flex-col justify-around">
                      {/* Foto */}
                      <div className="relative w-full h-44 rounded-lg bg-[#ebdccb] border-4 border-white shadow-sm overflow-hidden">
                        {cafe.fotos?.[0] ? (
                          <img
                            src={cafe.fotos[0]}
                            alt={cafe.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-[#8b5a2b]/40 bg-[#f4ebe1]">
                            <CoffeeCupIcon size={48} />
                          </div>
                        )}
                        <span className="absolute bottom-2 right-2 bg-[#2a1a10]/80 backdrop-blur-md text-amber-200 text-xs font-serif px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          {cafe.precio}
                        </span>
                      </div>

                      {/* Info café */}
                      <div className="mt-2">
                        <h2 className="text-xl font-serif font-bold text-[#3d2b1f] leading-tight">
                          {cafe.nombre}
                        </h2>
                        <p className="text-xs text-[#6b4c3b] font-serif flex items-center gap-1 mt-0.5">
                          <PinIcon size={12} className="text-[#8b5a2b]" /> {cafe.barrio}
                        </p>
                        <p className="text-xs font-medium text-[#5c3a21] mt-1 italic">
                          ✨ {cafe.especialidad}
                        </p>
                        <p className="text-[11px] text-[#6b4c3b]/80 mt-1 line-clamp-2 leading-relaxed">
                          {cafe.historia}
                        </p>
                      </div>
                    </div>

                    {/* CHECKLIST MANUSCRITO DISCRETO (SIN TEXTOS EXPLICITOS NI BOTONES REPETIDOS) */}
                    <div className="relative z-10 pt-2 border-t border-dashed border-[#8b5a2b]/30">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleChecklist(cafe.id)
                        }}
                        className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-[#eadacb] border-[#8b5a2b]/40 shadow-sm'
                            : 'bg-white/80 border-[#8b5a2b]/20 hover:bg-white'
                        }`}
                      >
                        {/* Casilla manuscrita */}
                        <div
                          className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#3d2b1f] bg-[#dfcca7]'
                              : 'border-[#8b5a2b]/60 bg-white'
                          }`}
                        >
                          {isSelected ? (
                            <svg
                              className="w-5 h-5 text-[#2a1510] animate-ink-draw"
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
                            <span className="font-handwriting text-[#8b5a2b]/40 text-sm">✓</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-handwriting text-xl text-[#3d2b1f] font-bold leading-none">
                            {isSelected ? 'Me interesa este café (Guardado)' : 'Me interesa este café'}
                          </p>
                        </div>
                      </button>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>

      {/* Pie de página minimalista */}
      <footer className="relative z-20 py-2 text-center">
        <p className="text-[10px] text-beige/40 font-serif">
          Sumay Coffee Club • Colección de Cafeterías
        </p>
      </footer>
    </div>
  )
}
