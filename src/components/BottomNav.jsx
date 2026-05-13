import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Descubrir', icon: '🗺️' },
  { to: '/shuffle', label: 'Shuffle', icon: '🎲' },
  { to: '/perfil', label: 'Perfil', icon: '☕' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-beige border-t border-cafe-dark/10 flex justify-around items-start pt-3 pb-6 z-50 max-w-md mx-auto">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 px-4 text-xs font-medium transition-colors ${
              isActive ? 'text-cafe-dark' : 'text-cafe-accent/60'
            }`
          }
        >
          <span className="text-xl">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
