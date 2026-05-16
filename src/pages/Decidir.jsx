import { useNavigate } from 'react-router-dom'
import { DiceIcon } from '../components/Icons'

export default function Decidir() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-[calc(100vh-96px)]">

      {/* Mitad superior — Shuffle */}
      <button
        onClick={() => navigate('/decidir/aleatorio')}
        className="flex-1 flex flex-col items-center justify-center gap-4 text-beige active:opacity-90 transition-opacity"
        style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)' }}
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
        className="flex-1 flex flex-col items-center justify-center gap-4 text-cafe-dark active:bg-white/20 transition-colors"
      >
        {/* Icono: dos flechas indicando swipe izquierda/derecha */}
        <svg width="64" height="36" viewBox="0 0 64 36" fill="none" className="text-beige">
          <path d="M22 6 L10 18 L22 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 6 L54 18 L42 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="text-center">
          <p className="text-2xl font-serif font-bold text-beige tracking-tight">Swipe</p>
          <p className="text-sm text-beige/60 mt-1">Me interesa · No me interesa</p>
        </div>
      </button>

    </div>
  )
}
