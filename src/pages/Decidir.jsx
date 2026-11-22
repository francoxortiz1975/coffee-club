import { useNavigate } from 'react-router-dom'
import { DiceIcon } from '../components/Icons'
import AppHeader from '../components/AppHeader'
import DiscoverSwitch from '../components/DiscoverSwitch'
import CitySwitch from '../components/CitySwitch'

// Discover > Swipe: two ways to let the app help you choose.
export default function Decidir() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-[calc(100dvh-96px)] pb-3">
      <AppHeader title="Discover">
        <div className="flex items-center justify-between mb-2"><CitySwitch /></div>
        <DiscoverSwitch value="swipe" />
      </AppHeader>

      <div className="flex-1 flex flex-col gap-3 px-4 mt-4 min-h-0">
        <button
          onClick={() => navigate('/decidir/aleatorio')}
          className="flex-1 rounded-3xl flex flex-col items-center justify-center gap-4 text-beige active:opacity-90 transition-opacity shadow-md"
          style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)' }}
        >
          <DiceIcon size={44} className="opacity-80" />
          <div className="text-center">
            <p className="text-2xl font-display font-bold tracking-tight">Random</p>
            <p className="text-sm text-beige/80 mt-1">A coffee shop at random</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/decidir/swipe')}
          className="flex-1 rounded-3xl flex flex-col items-center justify-center text-cafe-dark active:opacity-90 transition-opacity shadow-md overflow-hidden"
          style={{ background: "url('/texture-bg.webp') center/cover" }}
        >
          {/* The pattern behind is busy, so the label sits on a soft dark card to stay readable */}
          <div className="flex flex-col items-center gap-3 bg-[#2a1510]/80 backdrop-blur-md rounded-3xl px-8 py-6 shadow-xl">
            <svg width="64" height="36" viewBox="0 0 64 36" fill="none" className="text-beige" aria-hidden="true">
              <path d="M22 6 L10 18 L22 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M42 6 L54 18 L42 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-beige tracking-tight">Swipe</p>
              <p className="text-sm text-beige/80 mt-1">Interested · Not interested</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
