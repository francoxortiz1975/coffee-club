import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { MapIcon, DiceIcon, CoffeeCupIcon } from './Icons'

const tabs = [
  { to: '/', label: 'Descubrir', Icon: MapIcon },
  { to: '/decidir', label: 'Decidir', Icon: DiceIcon },
  { to: '/perfil', label: 'Perfil', Icon: CoffeeCupIcon },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  // En sub-rutas como /decidir/swipe o /decidir/aleatorio la barra inicia minificada por defecto
  const isFeaturePage = pathname.includes('/decidir/') || pathname.includes('/invitacion')
  const [expanded, setExpanded] = useState(!isFeaturePage)

  useEffect(() => {
    // Si cambia de página a una feature, auto-minimizar
    if (isFeaturePage) {
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }, [pathname, isFeaturePage])

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 max-w-md mx-auto px-4 flex justify-center pointer-events-none">
      <nav
        onClick={() => !expanded && setExpanded(true)}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => isFeaturePage && setExpanded(false)}
        className={`pointer-events-auto transition-all duration-300 ease-out shadow-2xl border backdrop-blur-xl flex items-center justify-around select-none ${
          expanded
            ? 'w-full bg-white/85 border-cafe-dark/15 rounded-2xl py-2.5 px-3'
            : 'w-auto bg-[#241710]/90 border-amber-700/30 text-beige rounded-full py-1.5 px-5 gap-6 cursor-pointer active:scale-95'
        }`}
      >
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => isFeaturePage && setExpanded(false)}
            className={({ isActive }) =>
              `flex items-center gap-1.5 transition-all duration-200 ${
                expanded
                  ? `flex-col text-xs font-serif font-medium ${
                      isActive ? 'text-cafe-dark font-bold' : 'text-cafe-accent/50 hover:text-cafe-dark'
                    }`
                  : `text-xs ${
                      isActive
                        ? 'text-amber-300 font-bold scale-110'
                        : 'text-beige/50 hover:text-beige'
                    }`
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={expanded ? 20 : 16}
                  className={isActive ? 'stroke-[2.2]' : 'stroke-[1.5]'}
                />
                {expanded ? (
                  <span>{label}</span>
                ) : (
                  isActive && <span className="text-[11px] font-serif font-semibold">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Indicador sutil para expandir cuando está minificada */}
        {!expanded && (
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse ml-[-8px]" />
        )}
      </nav>
    </div>
  )
}
