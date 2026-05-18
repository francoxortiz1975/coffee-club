import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useFavoritos } from '../context/FavoritosContext'
import { ArrowLeftIcon, DiceIcon, HeartIcon, PinIcon, CoffeeCupIcon } from '../components/Icons'

export default function ShufflePage() {
  const navigate = useNavigate()
  const [cafe, setCafe] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const { favoritos, toggleFavorito } = useFavoritos()

  function handleShuffle() {
    setSpinning(true)
    setCafe(null)
    setTimeout(() => {
      const random = cafes[Math.floor(Math.random() * cafes.length)]
      setCafe(random)
      setSpinning(false)
    }, 700)
  }

  const esFavorito = cafe ? favoritos.includes(cafe.id) : false

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)' }}>
      {/* Header */}
      <div
        className="flex items-center px-5 pb-6"
        style={{ paddingTop: 'calc(48px + env(safe-area-inset-top))' }}
      >
        <button onClick={() => navigate(-1)} className="text-beige/60 mr-4">
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-xl font-serif font-bold text-beige">Aleatorio</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-5">
        {/* Botón principal */}
        <button
          onClick={handleShuffle}
          disabled={spinning}
          className={`w-28 h-28 rounded-full border-2 border-beige/30 text-beige flex items-center justify-center transition-all active:scale-95 ${spinning ? 'animate-spin opacity-60' : 'hover:border-beige/60'}`}
        >
          <DiceIcon size={44} />
        </button>

        <p className="text-beige/40 text-sm mt-4 mb-8">
          {spinning ? 'Escogiendo...' : cafe ? 'Toca para cambiar' : 'Toca para descubrir'}
        </p>

        {/* Card resultado */}
        {cafe && (
          <div className={`w-full bg-[#faf4ec] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${cafe ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="w-full h-48 bg-cafe-accent/10 flex items-center justify-center relative">
              {cafe.fotos?.[0]
                ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
                : <CoffeeCupIcon size={48} className="text-cafe-accent/20" />}
              <button
                onClick={() => toggleFavorito(cafe.id)}
                className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow transition-colors ${esFavorito ? 'text-[#b8d04a]' : 'text-cafe-accent/40'}`}
              >
                <HeartIcon size={15} filled={esFavorito} />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-lg font-serif font-bold text-cafe-dark">{cafe.nombre}</h2>
                <span className="text-sm text-cafe-accent font-semibold ml-2">{cafe.precio}</span>
              </div>
              <p className="text-xs text-cafe-accent/60 mb-3 flex items-center gap-1">
                <PinIcon size={11} />{cafe.barrio}
              </p>
              <p className="text-sm text-cafe-dark/70 mb-4">{cafe.especialidad}</p>
              <Link
                to={`/cafe/${cafe.id}`}
                className="block text-center text-sm font-semibold bg-cafe-dark text-beige py-2.5 rounded-xl"
              >
                Ver más
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
