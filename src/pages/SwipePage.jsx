import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { CoffeeCupIcon, HeartIcon, XIcon, PinIcon, PencilIcon, ArrowLeftIcon } from '../components/Icons'

export default function SwipePage() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [seleccionados, setSeleccionados] = useState([])
  const [dragOffset, setDragOffset] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [checkedAnimId, setCheckedAnimId] = useState(null)

  const startXRef = useRef(0)
  const containerRef = useRef(null)

  const currentCafe = cafes[index]
  const nextCafe = cafes[index + 1]

  const isCurrentSelected = currentCafe ? seleccionados.includes(currentCafe.id) : false

  // Gestos táctiles y de ratón (Finger tracking reactivo)
  function handleStart(clientX) {
    if (isFlipping) return
    startXRef.current = clientX
  }

  function handleMove(clientX) {
    if (isFlipping || !startXRef.current) return
    const diff = clientX - startXRef.current
    // Si estamos en el primer elemento y desliza a la derecha, limitar
    if (index === 0 && diff > 0) {
      setDragOffset(diff * 0.25)
      return
    }
    // Si estamos en el último elemento y desliza a la izquierda, limitar
    if (index >= cafes.length && diff < 0) {
      setDragOffset(diff * 0.25)
      return
    }
    setDragOffset(diff)
  }

  function handleEnd() {
    if (isFlipping) return
    const threshold = 70
    if (dragOffset < -threshold && index < cafes.length) {
      // Hojear hacia la siguiente página
      triggerPageTurn('next')
    } else if (dragOffset > threshold && index > 0) {
      // Hojear hacia la página anterior
      triggerPageTurn('prev')
    } else {
      // Cancelar pliegue (volver a su sitio)
      setDragOffset(0)
    }
    startXRef.current = 0
  }

  function triggerPageTurn(dir, isLike = false) {
    if (isFlipping) return
    setIsFlipping(true)

    if (dir === 'next' && isLike && currentCafe) {
      setSeleccionados((prev) => (prev.includes(currentCafe.id) ? prev : [...prev, currentCafe.id]))
    }

    // Objetivo final del offset según dirección
    const targetOffset = dir === 'next' ? -350 : 350
    setDragOffset(targetOffset)

    setTimeout(() => {
      if (dir === 'next') {
        setIndex((i) => Math.min(cafes.length, i + 1))
      } else {
        setIndex((i) => Math.max(0, i - 1))
      }
      setDragOffset(0)
      setIsFlipping(false)
    }, 380)
  }

  function handleToggleChecklist(cafeId) {
    if (isFlipping) return
    setCheckedAnimId(cafeId)

    const wasSelected = seleccionados.includes(cafeId)
    if (!wasSelected) {
      setSeleccionados((prev) => [...prev, cafeId])
      // Al hacer check, pasar la página reactivamente tras una pequeña pausa
      setTimeout(() => {
        triggerPageTurn('next')
        setCheckedAnimId(null)
      }, 450)
    } else {
      setSeleccionados((prev) => prev.filter((id) => id !== cafeId))
      setCheckedAnimId(null)
    }
  }

  function handleTerminar() {
    navigate('/decidir/seleccionados', { state: { seleccionados } })
  }

  // Progreso de curvatura de la página (-1 a 1)
  const containerWidth = containerRef.current?.offsetWidth || 340
  const rawProgress = Math.max(-1, Math.min(1, dragOffset / containerWidth))
  
  // Ángulo 3D estilo Apple Books (girando en el lomo izquierdo)
  const turnAngle = rawProgress < 0 ? rawProgress * 110 : rawProgress * 60
  const foldShadowOpacity = Math.min(0.5, Math.abs(rawProgress) * 0.8)

  return (
    <div
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#241710] select-none"
      style={{ touchAction: 'none', overscrollBehavior: 'none' }}
      onPointerDown={(e) => handleStart(e.clientX)}
      onPointerMove={(e) => handleMove(e.clientX)}
      onPointerUp={handleEnd}
      onPointerCancel={handleEnd}
    >
      {/* Encabezado estilo libro / Guía */}
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
          <p className="text-[10px] text-beige/50 uppercase tracking-widest font-serif">Sumay Coffee Club</p>
        </div>
        
        {/* Marcador de libro (Ribbon) - Terminar */}
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

      {/* ÁREA PRINCIPAL: LIBRO CON EFECTO DE DOBLADO APPLE BOOKS */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2">
        {index < cafes.length ? (
          <div className="w-full max-w-sm flex flex-col items-center">
            
            {/* Indicador de hoja actual */}
            <div className="w-full flex justify-between items-center px-2 mb-2 text-xs font-serif text-beige/60">
              <span>{index > 0 ? '← Desliza para regresar' : ''}</span>
              <span>Página {index + 1} de {cafes.length}</span>
              <span>Desliza para hojear →</span>
            </div>

            {/* CONTENEDOR 3D DE PÁGINAS DEL LIBRO */}
            <div
              ref={containerRef}
              className="relative w-full aspect-[4/5.4] max-h-[66vh] rounded-r-2xl rounded-l-md shadow-2xl"
              style={{ perspective: '1400px' }}
            >
              {/* EFECTO DE BORDES DE PÁGINAS APILADAS (PILA DE HOJAS DERECHA Y ABAJO) */}
              <div className="absolute top-1 right-[-6px] bottom-1 w-3 bg-[#e8ded1] rounded-r border-r border-amber-950/20 shadow-inner z-0" />
              <div className="absolute top-2 right-[-10px] bottom-2 w-3 bg-[#ded2c3] rounded-r border-r border-amber-950/30 z-0" />

              {/* Siguiente página (que queda revelada debajo mientras la actual se dobla) */}
              {nextCafe && (
                <div className="absolute inset-0 z-10 rounded-r-xl rounded-l-sm bg-[#fcf8f2] book-paper-texture border border-amber-900/20 shadow-md p-5 flex flex-col overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-8 book-spine-gradient pointer-events-none z-20" />
                  
                  {/* Encabezado hoja siguiente */}
                  <div className="flex justify-between items-center pb-2 border-b border-amber-900/10 text-[10px] font-serif text-[#6b4c3b]/60 uppercase tracking-wider">
                    <span>SECCIÓN CAFETERÍAS</span>
                    <span>PÁG. {index + 2}</span>
                  </div>

                  <div className="mt-3 flex-1 flex flex-col items-center justify-center opacity-80 filter blur-[0.3px]">
                    <div className="w-full h-40 bg-[#ebdccb] rounded-lg overflow-hidden flex items-center justify-center mb-3">
                      {nextCafe.fotos?.[0] ? (
                        <img src={nextCafe.fotos[0]} alt={nextCafe.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <CoffeeCupIcon size={40} className="text-[#8b5a2b]/30" />
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#3d2b1f] text-center">{nextCafe.nombre}</h3>
                    <p className="text-xs font-serif text-[#6b4c3b]/70 text-center">{nextCafe.barrio}</p>
                  </div>
                </div>
              )}

              {/* PÁGINA ACTUAL (LA QUE SE DOBLA DE MANERA REACTIVA) */}
              <div
                className="absolute inset-0 z-20 rounded-r-xl rounded-l-sm bg-[#fcf8f2] book-paper-texture border border-amber-900/20 p-5 flex flex-col justify-between overflow-hidden shadow-xl"
                style={{
                  transformOrigin: dragOffset < 0 ? 'left center' : 'right center',
                  transform: `rotateY(${turnAngle}deg)`,
                  transition: isFlipping ? 'transform 0.38s ease-out' : 'none',
                  boxShadow: rawProgress !== 0 ? `-15px 0 30px rgba(20, 10, 5, ${Math.abs(rawProgress) * 0.4})` : undefined,
                }}
              >
                {/* Lomo / Pliegue del libro */}
                <div className="absolute inset-y-0 left-0 w-8 book-spine-gradient pointer-events-none z-30" />

                {/* Sombra reflectiva de pliegue mientras se gira */}
                {rawProgress !== 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none z-30 transition-opacity"
                    style={{
                      background: rawProgress < 0 
                        ? `linear-gradient(to right, transparent 0%, rgba(40, 20, 5, ${foldShadowOpacity}) 70%, rgba(0,0,0,${foldShadowOpacity * 1.2}) 100%)`
                        : `linear-gradient(to left, transparent 0%, rgba(40, 20, 5, ${foldShadowOpacity}) 70%, rgba(0,0,0,${foldShadowOpacity * 1.2}) 100%)`,
                    }}
                  />
                )}

                {/* Encabezado Hoja */}
                <div className="relative z-10 flex justify-between items-center pb-2 border-b border-[#8b5a2b]/15 text-[10px] font-serif text-[#6b4c3b]/70 uppercase tracking-widest">
                  <span className="font-semibold">SUMAY SELECCIÓN</span>
                  <span>HOJA #{index + 1}</span>
                </div>

                {/* Foto + Información principal */}
                <div className="relative z-10 my-2 flex-1 flex flex-col justify-around">
                  {/* Foto tipo estampa / marco vintage */}
                  <div className="relative w-full h-44 rounded-lg bg-[#ebdccb] border-4 border-white shadow-sm overflow-hidden group">
                    {currentCafe.fotos?.[0] ? (
                      <img
                        src={currentCafe.fotos[0]}
                        alt={currentCafe.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#8b5a2b]/40 bg-[#f4ebe1]">
                        <CoffeeCupIcon size={48} />
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 bg-[#2a1a10]/80 backdrop-blur-md text-amber-200 text-xs font-serif px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      {currentCafe.precio}
                    </span>
                  </div>

                  {/* Detalles del café */}
                  <div className="mt-2">
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-serif font-bold text-[#3d2b1f] leading-tight">
                        {currentCafe.nombre}
                      </h2>
                    </div>
                    <p className="text-xs text-[#6b4c3b] font-serif flex items-center gap-1 mt-0.5">
                      <PinIcon size={12} className="text-[#8b5a2b]" /> {currentCafe.barrio}
                    </p>
                    <p className="text-xs font-medium text-[#5c3a21] mt-1 italic">
                      ✨ {currentCafe.especialidad}
                    </p>
                    <p className="text-[11px] text-[#6b4c3b]/80 mt-1 line-clamp-2 leading-relaxed">
                      {currentCafe.historia}
                    </p>
                  </div>
                </div>

                {/* CHECKLIST MANUSCRITO (AESTHETIC BOOK CHECK) */}
                <div className="relative z-10 pt-2 border-t border-dashed border-[#8b5a2b]/30 bg-[#f7f0e6]/70 rounded-xl p-3 shadow-inner">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-handwriting text-lg text-[#5c3a21] font-bold flex items-center gap-1">
                      <PencilIcon size={15} className="text-[#8b5a2b]" /> Diario del Cafetero
                    </span>
                    <span className="text-[9px] text-[#8b5a2b]/60 uppercase tracking-widest font-serif">Anotación</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleChecklist(currentCafe.id)
                    }}
                    className={`w-full text-left flex items-center gap-3 p-2 rounded-lg transition-all border ${
                      isCurrentSelected
                        ? 'bg-[#eadacb] border-[#8b5a2b]/40 shadow-sm'
                        : 'bg-white/80 border-[#8b5a2b]/20 hover:bg-white'
                    }`}
                  >
                    {/* Casilla manuscrita */}
                    <div
                      className={`w-7 h-7 rounded border-2 flex items-center justify-center transition-all ${
                        isCurrentSelected
                          ? 'border-[#3d2b1f] bg-[#dfcca7]'
                          : 'border-[#8b5a2b]/60 bg-white'
                      }`}
                    >
                      {isCurrentSelected ? (
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
                        {isCurrentSelected ? '¡Me interesa este café! (Guardado)' : 'Me interesa este café (Marcar para mi lista)'}
                      </p>
                      <p className="text-[10px] text-[#6b4c3b]/70 font-serif mt-0.5">
                        {isCurrentSelected ? 'Toca para desmarcar' : 'Haz clic para marcar [✓] y pasar la hoja'}
                      </p>
                    </div>
                  </button>
                </div>

              </div>
            </div>

            {/* BOTONES DE ACCIÓN RÁPIDA INFERIORES */}
            <div className="flex items-center gap-6 mt-4 z-20">
              <button
                onClick={() => triggerPageTurn('next', false)}
                className="flex items-center gap-2 bg-[#42291a] hover:bg-[#573723] text-beige text-xs font-serif px-5 py-2.5 rounded-full border border-amber-900/40 shadow-md active:scale-95 transition-transform"
              >
                <XIcon size={16} className="text-amber-400" />
                <span>Paso (Siguiente)</span>
              </button>

              <button
                onClick={() => triggerPageTurn('next', true)}
                className="flex items-center gap-2 bg-[#7a2e1d] hover:bg-[#913723] text-beige text-xs font-serif px-5 py-2.5 rounded-full border border-red-950/40 shadow-md active:scale-95 transition-transform"
              >
                <HeartIcon size={16} filled={isCurrentSelected} className="text-amber-300" />
                <span>¡Me interesa!</span>
              </button>
            </div>

          </div>
        ) : (
          /* PÁGINA FINAL DEL LIBRO (CUANDO TERMINA DE REVISAR TODAS) */
          <div className="w-full max-w-sm bg-[#fcf8f2] book-paper-texture rounded-2xl p-8 border border-amber-900/30 shadow-2xl text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#ebdccb] flex items-center justify-center text-[#5c3a21] shadow-inner">
              <CoffeeCupIcon size={36} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#3d2b1f]">Fin de la Guía</h2>
              <p className="font-handwriting text-2xl text-[#8b5a2b] font-bold mt-1">
                ¡Has hojeado todas las cafeterías!
              </p>
            </div>
            <p className="text-xs font-serif text-[#6b4c3b]/80 leading-relaxed px-2">
              Seleccionaste <span className="font-bold text-[#3d2b1f]">{seleccionados.length}</span> cafeterías para tu próxima salida de café.
            </p>

            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                onClick={handleTerminar}
                className="w-full bg-[#3d2b1f] hover:bg-[#523b2c] text-beige font-serif text-sm font-semibold py-3 rounded-xl shadow-md active:scale-98 transition-all"
              >
                Ver mis cafeterías seleccionadas ({seleccionados.length})
              </button>

              <button
                onClick={() => setIndex(0)}
                className="w-full bg-transparent text-[#6b4c3b] hover:text-[#3d2b1f] font-serif text-xs font-medium py-2 rounded-xl border border-[#8b5a2b]/30"
              >
                Volver a hojear desde la primera página
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Pie de página con atajo a seleccionados si no es la pantalla final */}
      <footer className="relative z-20 py-2 text-center">
        <p className="text-[10px] text-beige/40 font-serif">
          Sumay Coffee Club • Colección de Cafeterías Especiales
        </p>
      </footer>
    </div>
  )
}
