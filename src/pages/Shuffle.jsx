import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useFavoritos } from '../context/FavoritosContext'
import { CoffeeCupIcon, HeartIcon, XIcon, PinIcon } from '../components/Icons'

// ─── Shuffle Mode ────────────────────────────────────────────────
function ShuffleMode() {
  const [cafe, setCafe] = useState(null)
  const [spinning, setSpinning] = useState(false)

  function handleShuffle() {
    setSpinning(true)
    setCafe(null)
    setTimeout(() => {
      const random = cafes[Math.floor(Math.random() * cafes.length)]
      setCafe(random)
      setSpinning(false)
    }, 700)
  }

  return (
    <div className="flex flex-col items-center px-4 pt-4">
      <button
        onClick={handleShuffle}
        className={`bg-cafe-dark text-beige text-base font-bold py-4 px-10 rounded-full shadow-lg active:scale-95 transition-all ${spinning ? 'animate-spin-once opacity-70' : ''}`}
      >
        🎲 Sorpréndeme
      </button>

      <div className={`mt-8 w-full transition-all duration-300 ${cafe ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {cafe && <ShuffleCard cafe={cafe} onReshuffle={handleShuffle} />}
      </div>
    </div>
  )
}

function ShuffleCard({ cafe, onReshuffle }) {
  const { favoritos, toggleFavorito } = useFavoritos()
  const esFavorito = favoritos.includes(cafe.id)

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="w-full h-52 bg-cafe-accent/20 flex items-center justify-center relative">
        {cafe.fotos?.[0]
          ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
          : <CoffeeCupIcon size={48} className="text-cafe-accent/25" />}
        <button
          onClick={() => toggleFavorito(cafe.id)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow transition-colors ${esFavorito ? 'text-red-400' : 'text-cafe-accent/40'}`}
        >
          <HeartIcon size={15} filled={esFavorito} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-0.5">
          <h2 className="text-lg font-serif font-bold text-cafe-dark">{cafe.nombre}</h2>
          <span className="text-sm text-cafe-accent font-semibold ml-2">{cafe.precio}</span>
        </div>
        <p className="text-xs text-cafe-accent/60 mb-2">📍 {cafe.barrio}</p>
        <p className="text-sm text-cafe-dark/75 mb-4">{cafe.especialidad}</p>

        <div className="flex gap-2">
          <Link
            to={`/cafe/${cafe.id}`}
            className="flex-1 text-center text-sm font-semibold bg-cafe-dark text-beige py-2.5 rounded-xl"
          >
            Ver más
          </Link>
          <button
            onClick={onReshuffle}
            className="px-4 text-sm font-semibold border border-cafe-accent/30 text-cafe-accent py-2.5 rounded-xl"
          >
            🎲 Otro
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Swipe Mode ──────────────────────────────────────────────────
function SwipeMode() {
  const [index, setIndex] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [animating, setAnimating] = useState(false)
  const startXRef = useRef(0)
  const { toggleFavorito } = useFavoritos()

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
    if (Math.abs(offsetX) > 80) {
      doSwipe(offsetX > 0 ? 'right' : 'left')
    } else {
      setOffsetX(0)
    }
  }

  function doSwipe(dir) {
    if (animating) return
    setAnimating(true)
    if (dir === 'right') toggleFavorito(cafe.id)
    setOffsetX(dir === 'right' ? 500 : -500)
    setTimeout(() => {
      setIndex((i) => i + 1)
      setOffsetX(0)
      setAnimating(false)
    }, 320)
  }

  if (!cafe) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-8 text-center gap-4">
        <span className="text-5xl">☕</span>
        <p className="text-cafe-dark font-serif font-bold text-lg">Ya viste todo el Centro Histórico</p>
        <p className="text-cafe-accent/60 text-sm">Pronto habrá más cafeterías</p>
        <button
          onClick={() => setIndex(0)}
          className="mt-2 bg-cafe-dark text-beige text-sm font-semibold px-6 py-2.5 rounded-full"
        >
          Volver a empezar
        </button>
      </div>
    )
  }

  const rotation = offsetX * 0.04
  const likeOpacity = Math.max(0, Math.min(offsetX / 80, 1))
  const nopeOpacity = Math.max(0, Math.min(-offsetX / 80, 1))

  return (
    <div className="flex flex-col items-center px-4 pt-2 gap-6">
      {/* Contador */}
      <p className="text-xs text-cafe-accent/40">{index + 1} / {cafes.length}</p>

      {/* Card deslizable */}
      <div
        className="w-full relative select-none"
        style={{
          transform: `translateX(${offsetX}px) rotate(${rotation}deg)`,
          transition: animating ? 'transform 0.32s ease' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Badge SERÍA */}
        <div
          className="absolute top-5 left-5 z-10 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full rotate-[-15deg]"
          style={{ opacity: likeOpacity }}
        >
          ❤️ SERÍA
        </div>
        {/* Badge PASO */}
        <div
          className="absolute top-5 right-5 z-10 bg-red-400 text-white text-sm font-bold px-3 py-1 rounded-full rotate-[15deg]"
          style={{ opacity: nopeOpacity }}
        >
          PASO ✗
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="w-full h-64 bg-cafe-accent/20 flex items-center justify-center">
            {cafe.fotos?.[0]
              ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
              : <CoffeeCupIcon size={56} className="text-cafe-accent/25" />}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-0.5">
              <h2 className="text-lg font-serif font-bold text-cafe-dark">{cafe.nombre}</h2>
              <span className="text-sm text-cafe-accent font-semibold ml-2">{cafe.precio}</span>
            </div>
            <p className="text-xs text-cafe-accent/60 mb-2">📍 {cafe.barrio}</p>
            <p className="text-sm text-cafe-dark/70 mb-1">{cafe.especialidad}</p>
            <p className="text-xs text-gray-400 line-clamp-2">{cafe.historia}</p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-6 items-center">
        <button
          onClick={() => doSwipe('left')}
          className="w-14 h-14 rounded-full border-2 border-red-300 text-red-400 flex items-center justify-center shadow active:scale-90 transition-transform"
        >
          <XIcon size={22} />
        </button>
        <Link
          to={`/cafe/${cafe.id}`}
          className="w-10 h-10 rounded-full border border-cafe-accent/30 text-cafe-accent text-base flex items-center justify-center"
        >
          ↗
        </Link>
        <button
          onClick={() => doSwipe('right')}
          className="w-14 h-14 rounded-full border-2 border-green-300 text-green-500 flex items-center justify-center shadow active:scale-90 transition-transform"
        >
          <HeartIcon size={22} />
        </button>
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────
export default function Shuffle() {
  const [modo, setModo] = useState('shuffle')

  return (
    <div className="flex flex-col min-h-screen pb-4">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-4">Shuffle</h1>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-1 shadow-sm">
          <button
            onClick={() => setModo('shuffle')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors ${
              modo === 'shuffle' ? 'bg-cafe-dark text-beige' : 'text-cafe-accent/60'
            }`}
          >
            🎲 Shuffle
          </button>
          <button
            onClick={() => setModo('swipe')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors ${
              modo === 'swipe' ? 'bg-cafe-dark text-beige' : 'text-cafe-accent/60'
            }`}
          >
            💘 Swipe
          </button>
        </div>
      </div>

      {modo === 'shuffle' ? <ShuffleMode /> : <SwipeMode />}
    </div>
  )
}
