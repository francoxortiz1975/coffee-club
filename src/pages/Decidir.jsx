import { useNavigate } from 'react-router-dom'
import { DiceIcon, HeartIcon } from '../components/Icons'

export default function Decidir() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-[calc(100vh-96px)]">

      {/* Mitad superior — Shuffle */}
      <button
        onClick={() => navigate('/decidir/aleatorio')}
        className="flex-1 flex flex-col items-center justify-center gap-4 bg-cafe-dark text-beige active:opacity-90 transition-opacity"
      >
        <DiceIcon size={48} className="opacity-80" />
        <div className="text-center">
          <p className="text-2xl font-serif font-bold tracking-tight">Aleatorio</p>
          <p className="text-sm text-beige/60 mt-1">Una cafetería al azar</p>
        </div>
      </button>

      {/* Divisor */}
      <div className="h-px bg-beige/10" />

      {/* Mitad inferior — Swipe */}
      <button
        onClick={() => navigate('/decidir/swipe')}
        className="flex-1 flex flex-col items-center justify-center gap-4 bg-beige text-cafe-dark active:bg-cafe-accent/10 transition-colors"
      >
        <div className="flex gap-4 items-center">
          <HeartIcon size={36} className="text-green-400" />
          <HeartIcon size={36} className="text-red-300 opacity-60" />
        </div>
        <div className="text-center">
          <p className="text-2xl font-serif font-bold text-cafe-dark tracking-tight">Swipe</p>
          <p className="text-sm text-cafe-accent/60 mt-1">Me interesa · No me interesa</p>
        </div>
      </button>

    </div>
  )
}
