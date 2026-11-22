import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageFlip } from 'page-flip'
import { useCityCafes } from '../lib/city'
import { CoffeeCupIcon, PinIcon, ArrowLeftIcon, HeartIcon } from '../components/Icons'
import { useFavoritos } from '../context/FavoritosContext'
import { toLines } from '../lib/textLines'
import { OCASION_LABELS } from '../lib/ocasiones'

// iPhones in standalone mode reserve space for the status bar and the home indicator; measure them once.
function safeInset(side) {
  const d = document.createElement('div')
  d.style.cssText = `position:fixed;${side}:0;padding-${side}:env(safe-area-inset-${side});visibility:hidden`
  document.body.appendChild(d)
  const v = parseFloat(getComputedStyle(d)[`padding${side === 'top' ? 'Top' : 'Bottom'}`]) || 0
  d.remove()
  return v
}

export default function SwipePage() {
  const cafes = useCityCafes()
  const navigate = useNavigate()
  const { favoritos, toggleFavorito } = useFavoritos()
  const [seleccionados, setSeleccionados] = useState([])   // the ones hearted during this swipe
  const seleccionadosRef = useRef(seleccionados)
  useEffect(() => { seleccionadosRef.current = seleccionados }, [seleccionados])
  const [dimensions, setDimensions] = useState({ width: 390, height: 680 })

  const bookContainerRef = useRef(null)
  const pageFlipRef = useRef(null)

  // Calcular dimensiones ocupando el 100% exacto de la pantalla sin fondo café alrededor
  useEffect(() => {
    function updateDimensions() {
      const w = Math.min(window.innerWidth, 440)
      // The page hangs from the top (8px) and stops 12px above the floating nav pill (46px tall, 12px off the bottom)
      const h = Math.max(460, Math.min(window.innerHeight - 8 - safeInset('top') - 70 - safeInset('bottom'), 800))
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
          clickEventForward: true,
          mobileScrollSupport: false,
        })

        pageFlip.loadFromHTML(pages)

        // Reaching the last sheet opens the selection
        pageFlip.on('flip', (e) => {
          if (e.data >= cafes.length) {
            setTimeout(() => navigate('/decidir/seleccionados', { state: { seleccionados: seleccionadosRef.current } }), 450)
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
  }, [dimensions, navigate, cafes.length])

  // The heart saves the café to your favourites and adds it to this swipe's selection
  function heart(cafe) {
    const isFav = favoritos.includes(cafe.id)
    toggleFavorito(cafe.id)
    setSeleccionados((cur) => (isFav ? cur.filter((id) => id !== cafe.id) : cur.includes(cafe.id) ? cur : [...cur, cafe.id]))
  }

  // The book library swallows clicks inside its pages before React sees them, so the buttons on the pages are handled
  // here, with one listener on the book that runs first.
  const actionsRef = useRef({})
  function verSeleccion() {
    navigate('/decidir/seleccionados', { state: { seleccionados: seleccionadosRef.current } })
  }

  useEffect(() => { actionsRef.current = { heart, home: () => navigate('/'), picks: verSeleccion, restart: () => pageFlipRef.current?.flip(0) } })
  useEffect(() => {
    const box = bookContainerRef.current
    if (!box) return undefined
    const onClick = (e) => {
      const el = e.target.closest?.('[data-action]')
      if (!el) return
      e.stopPropagation()
      const act = el.dataset.action
      if (act === 'heart') actionsRef.current.heart(cafes.find((c) => c.id === el.dataset.id))
      else actionsRef.current[act]?.()
    }
    box.addEventListener('click', onClick, true)
    return () => box.removeEventListener('click', onClick, true)
  }, [cafes])

  return (
    <div
      className="fixed inset-0 max-w-md mx-auto h-screen max-h-screen overflow-hidden flex items-start justify-center bg-[#fcf8f2] select-none"
      style={{ touchAction: 'none', overscrollBehavior: 'none', paddingTop: 'calc(env(safe-area-inset-top) + 8px)' }}
    >
      {/* TODO EL SCREEN ES 100% LA HOJA DEL LIBRO (SIN FONDO CAFÉ EXTERNO) */}
      <main className="relative z-10 w-full h-full flex items-start justify-center overflow-hidden">
        <div
          className="relative flex justify-center items-center w-full h-full"
          style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
        >
          <div
            ref={bookContainerRef}
            className="w-full h-full bg-[#fcf8f2] overflow-hidden"
            style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
          >
            {cafes.map((cafe) => {
              // The same big first sentence as on the café page
              const phrase = toLines(cafe.descripcion)[0] || cafe.historia
              return (
                /* 1 sheet per café: front and back */
                <div
                  key={cafe.id}
                  className="st-page relative bg-[#fcf8f2] border-0 overflow-hidden preserve-3d"
                  style={{ backgroundColor: '#fcf8f2', opacity: 1 }}
                  data-density="soft"
                >
                  {/* Front: photo, name, place, one sentence */}
                  <div className="absolute inset-0 bg-[#fcf8f2] book-paper-texture p-4 flex flex-col gap-4 overflow-hidden backface-hidden z-10">
                    <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none z-20" />

                    <div className="relative flex-1 min-h-[150px] rounded-2xl bg-[#ebdccb] shadow-md overflow-hidden">
                      {cafe.fotos?.[0] ? (
                        <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#8b5a2b]/40 bg-[#f4ebe1]">
                          <CoffeeCupIcon size={56} />
                        </div>
                      )}
                      <button
                        type="button"
                        data-action="home"
                        aria-label="Back to Discover"
                        className="absolute left-3 top-3 w-11 h-11 rounded-full bg-white/85 backdrop-blur-sm text-[#3d2b1f] shadow flex items-center justify-center active:scale-95 transition-transform"
                      >
                        <ArrowLeftIcon size={18} />
                      </button>
                      <button
                        type="button"
                        data-action="heart" data-id={cafe.id}
                        aria-label={favoritos.includes(cafe.id) ? 'Remove from favorites' : 'Save to favorites'}
                        aria-pressed={favoritos.includes(cafe.id)}
                        className={`absolute right-3 top-3 w-11 h-11 rounded-full bg-white/85 backdrop-blur-sm shadow flex items-center justify-center active:scale-90 transition-transform ${favoritos.includes(cafe.id) ? 'text-[#8a9d2e]' : 'text-[#6b4c3b]'}`}
                      >
                        <HeartIcon size={20} filled={favoritos.includes(cafe.id)} />
                      </button>
                      {cafe.precio && (
                        <span className="absolute bottom-2.5 right-2.5 bg-[#2a1a10]/85 backdrop-blur-md text-amber-200 text-xs font-sans px-3 py-1 rounded-full border border-amber-500/30 font-semibold">
                          {cafe.precio}
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 shrink-0 px-1 pb-1">
                      <h2 className="text-[30px] font-display font-bold text-[#3d2b1f] leading-[1.05]">{cafe.nombre}</h2>
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-2">
                        <p className="text-xs text-[#6b4c3b]/70 font-sans flex items-center gap-1"><PinIcon size={12} />{cafe.barrio}</p>
                        {cafe.tipo && <span className="inline-block text-xs font-sans bg-beige border border-[#6b4c3b]/30 text-[#6b4c3b] rounded-full px-3 py-1">{cafe.tipo}</span>}
                        {cafe.ocasiones.map((o) => <span key={o} className="inline-block text-xs font-sans bg-[#3d2b1f] text-beige rounded-full px-3 py-1">{OCASION_LABELS[o] ?? o}</span>)}
                      </div>
                      <p className="text-[22px] font-sans font-extrabold tracking-tight leading-[1.12] text-[#3d2b1f] mt-4 line-clamp-4">{phrase}</p>
                    </div>
                  </div>

                  {/* B) CARA TRASERA (Reverso limpio pergamino) */}
                  <div className="absolute inset-0 bg-[#fcf8f2] book-paper-texture p-6 flex flex-col items-center justify-between text-center overflow-hidden backface-hidden rotate-y-180 z-0">
                    <div className="absolute inset-y-0 right-0 w-6 book-spine-gradient pointer-events-none z-20" />
                    
                    <div className="w-full text-right text-[11px] font-sans text-[#6b4c3b]/40 uppercase tracking-widest">
                      SUMAY COFFEE CLUB
                    </div>

                    <div className="flex flex-col items-center gap-3 my-auto opacity-35">
                      <CoffeeCupIcon size={48} className="text-[#8b5a2b]" />
                      <span className="text-xs font-sans text-[#6b4c3b] tracking-widest uppercase">SUMAY GUIDE</span>
                    </div>

                    <div className="text-[11px] font-sans text-[#6b4c3b]/40 tracking-wider">
                      {cafe.ciudad.toUpperCase()} • COFFEE SHOPS
                    </div>
                  </div>
                </div>
              )
            })}

            {/* HOJA FINAL DE BACK COVER */}
            <div
              className="st-page relative bg-[#fcf8f2] border-0 overflow-hidden preserve-3d"
              style={{ backgroundColor: '#fcf8f2', opacity: 1 }}
              data-density="hard"
            >
              <div className="absolute inset-0 bg-[#fcf8f2] book-paper-texture p-6 flex flex-col items-center justify-between text-center overflow-hidden backface-hidden z-10">
                <div className="absolute inset-y-0 left-0 w-6 book-spine-gradient pointer-events-none z-20" />

                <div className="text-[11px] font-sans text-[#6b4c3b]/50 uppercase tracking-widest">
                  BACK COVER
                </div>

                <div className="flex flex-col items-center gap-4 my-auto">
                  <div className="w-20 h-20 rounded-full bg-[#ebdccb] flex items-center justify-center text-[#5c3a21] shadow-inner">
                    <CoffeeCupIcon size={40} />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-[#3d2b1f]">That’s all of them</h2>
                  <p className="text-sm font-sans text-[#6b4c3b]">You saved {seleccionados.length} {seleccionados.length === 1 ? 'coffee shop' : 'coffee shops'}.</p>
                  <div className="flex flex-col gap-3 mt-2 w-full max-w-[240px]">
                    <button type="button" data-action="picks" className="bg-[#3d2b1f] text-beige font-sans text-sm font-semibold px-8 py-3.5 rounded-full shadow-md active:scale-95 transition-transform">See my picks</button>
                    <button type="button" data-action="home" className="min-h-11 text-[#6b4c3b] font-sans text-sm font-semibold underline underline-offset-4">Back to Discover</button>
                    <button type="button" data-action="restart" className="min-h-11 text-[#6b4c3b] font-sans text-sm font-semibold underline underline-offset-4">Start again</button>
                  </div>
                </div>

                <div className="text-[11px] font-sans text-[#6b4c3b]/40 tracking-wider">
                  SUMAY COFFEE CLUB
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
