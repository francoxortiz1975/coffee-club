import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CompassIcon, MapIcon, CoffeeBeanOutlineIcon, InviteIcon } from './Icons'
import { useInvitaciones } from '../context/InvitacionesContext'
import { isUpcoming } from '../lib/plans'

// Four tabs. Profile is not a tab: it opens from the avatar on every screen.
const tabs = [
  { id: 'discover', to: '/', label: 'Discover', Icon: CompassIcon, match: (p) => p === '/' || p.startsWith('/decidir') || p.startsWith('/cafe/') || p.startsWith('/journey') || p.startsWith('/shelf/') },
  { id: 'map', to: '/map', label: 'Map', Icon: MapIcon, match: (p) => p.startsWith('/map') },
  { id: 'collect', to: '/collect', label: 'Collect', Icon: CoffeeBeanOutlineIcon, match: (p) => p.startsWith('/collect') },
  { id: 'invite', to: '/invite', label: 'Invite', Icon: InviteIcon, match: (p) => p.startsWith('/invite') && !p.startsWith('/invitacion') },
]

const SEEN_KEY = 'sumay_inv_seen'
function readSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')) } catch { return new Set() }
}

export default function BottomNav() {
  const { pathname } = useLocation()
  const { recibidas, invKey } = useInvitaciones()
  // In immersive screens (the swipe book) the bar starts as a small pill.
  const isFeaturePage = pathname.includes('/decidir/') || pathname.includes('/invitacion')
  const [expanded, setExpanded] = useState(!isFeaturePage)

  useEffect(() => {
    setExpanded(!isFeaturePage)
  }, [pathname, isFeaturePage])

  // Unread = received, still upcoming, and not seen since you last opened the Invite tab.
  const onInvite = tabs[3].match(pathname)
  useEffect(() => {
    if (!onInvite) return
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(recibidas.map(invKey))) } catch { /* private mode */ }
  }, [onInvite, recibidas, invKey])
  const unread = onInvite ? 0 : (() => {
    const seen = readSeen()
    return recibidas.filter((i) => isUpcoming(i) && !seen.has(invKey(i))).length
  })()

  return (
    <div className="fixed left-0 right-0 z-50 max-w-md mx-auto px-4 flex justify-center pointer-events-none" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
      <nav
        aria-label="Main"
        onClick={() => !expanded && setExpanded(true)}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => isFeaturePage && setExpanded(false)}
        className={`pointer-events-auto transition-all duration-300 ease-out shadow-2xl border backdrop-blur-xl flex items-center justify-around select-none ${
          expanded
            ? 'w-full bg-white/85 border-cafe-dark/15 rounded-2xl py-1 px-2'
            : 'w-auto bg-[#241710]/90 border-amber-700/30 text-beige rounded-full py-0 px-2 gap-1 cursor-pointer active:scale-95'
        }`}
      >
        {tabs.map(({ id, to, label, Icon, match }) => {
          const isActive = match(pathname)
          const badge = id === 'invite' ? unread : 0
          return (
            <Link
              key={id}
              to={to}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => isFeaturePage && setExpanded(false)}
              className={`relative flex items-center justify-center transition-all duration-200 min-h-11 ${
                expanded
                  ? `flex-1 flex-col gap-0.5 text-xs font-sans font-medium rounded-xl mx-0.5 my-0.5 py-1.5 ${isActive ? 'bg-cafe-dark text-beige font-bold' : 'text-cafe-accent hover:text-cafe-dark'}`
                  : `gap-1.5 min-w-11 px-2.5 text-xs ${isActive ? 'text-amber-300 font-bold' : 'text-beige/70 hover:text-beige'}`
              }`}
            >
              <span className="relative">
                <Icon size={expanded ? 22 : 18} className={isActive ? 'stroke-[2]' : 'stroke-[1.5]'} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#7a2e1d] text-beige text-[11px] font-bold flex items-center justify-center">{badge}</span>
                )}
              </span>
              {expanded ? <span>{label}</span> : isActive && <span className="text-xs font-sans font-semibold">{label}</span>}
            </Link>
          )
        })}

        {!expanded && <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse mr-2" />}
      </nav>
    </div>
  )
}
