import { NavLink } from 'react-router-dom'
import { MapIcon, DiceIcon, CoffeeCupIcon } from './Icons'

const tabs = [
  { to: '/', label: 'Descubrir', Icon: MapIcon },
  { to: '/decidir', label: 'Decidir', Icon: DiceIcon },
  { to: '/perfil', label: 'Perfil', Icon: CoffeeCupIcon },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-beige border-t border-cafe-dark/10 flex justify-around items-start pt-3 pb-6 z-50 max-w-md mx-auto">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 text-xs font-medium transition-colors ${
              isActive ? 'text-cafe-dark' : 'text-cafe-accent/40'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={22} className={isActive ? 'stroke-[2]' : 'stroke-[1.5]'} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
