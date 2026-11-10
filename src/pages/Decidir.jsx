import { useNavigate } from 'react-router-dom'
import { DiceIcon } from '../components/Icons'

export default function Decidir() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-[calc(100dvh-96px)]">

      {/* Mitad superior — Shuffle */}
      <button
        onClick={() => navigate('/decidir/aleatorio')}
        className="flex-1 flex flex-col items-center justify-center gap-4 text-beige active:opacity-90 transition-opacity"
        style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)' }}
      >
        <DiceIcon size={48} className="opacity-80" />
        <div className="text-center">
          <p className="text-2xl font-display font-bold tracking-tight">Aleatorio</p>
          <p className="text-sm text-beige/80 mt-1">Una cafetería al azar</p>
        </div>
      </button>

      {/* Divisor */}
      <div className="h-px bg-beige/10" />

      {/* Mitad inferior — Swipe */}
      <button
        onClick={() => navigate('/decidir/swipe')}
        className="flex-1 flex flex-col items-center justify-center gap-4 text-cafe-dark active:bg-white/20 transition-colors"
      >
        {/* The pattern behind is busy, so the label sits on a soft dark card to stay readable */}
        <div className="flex flex-col items-center gap-3 bg-[#2a1510]/80 backdrop-blur-md rounded-3xl px-8 py-6 shadow-xl">
          {/* Icono: dos flechas indicando swipe izquierda/derecha */}
          <svg width="64" height="36" viewBox="0 0 64 36" fill="none" className="text-beige">
            <path d="M22 6 L10 18 L22 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M42 6 L54 18 L42 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-beige tracking-tight">Swipe</p>
            <p className="text-sm text-beige/80 mt-1">Me interesa · No me interesa</p>
          </div>
        </div>
      </button>

    </div>
  )
}
