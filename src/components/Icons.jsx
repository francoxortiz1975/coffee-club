const defaults = { width: 24, height: 24, strokeWidth: 1.5, stroke: 'currentColor', fill: 'none' }

const s = (props) => ({ ...defaults, ...props })

export function CoffeeCupIcon({ size = 24, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2c0 0 .5 1.5 0 3" />
      <path d="M10 2c0 0 .5 1.5 0 3" />
      <path d="M14 2c0 0 .5 1.5 0 3" />
      <path d="M4 7h12l-1.5 10H5.5L4 7z" />
      <path d="M16 9h2a2 2 0 0 1 0 4h-2" />
      <path d="M2 21h16" />
    </svg>
  )
}

export function HeartIcon({ size = 24, filled = false, className = '' }) {
  return (
    <svg {...s({ width: size, height: size, fill: filled ? 'currentColor' : 'none' })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z" />
    </svg>
  )
}

export function PinIcon({ size = 16, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  )
}

export function SearchIcon({ size = 18, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export function DiceIcon({ size = 24, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function MapIcon({ size = 24, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  )
}

export function UserIcon({ size = 24, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

export function ArrowUpIcon({ size = 20, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5,12 12,5 19,12" />
    </svg>
  )
}

export function ArrowLeftIcon({ size = 20, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12,19 5,12 12,5" />
    </svg>
  )
}

export function ShareIcon({ size = 20, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <line x1="8.4" y1="10.9" x2="15.6" y2="6.1" />
      <line x1="8.4" y1="13.1" x2="15.6" y2="17.9" />
    </svg>
  )
}

export function XIcon({ size = 20, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function ExternalLinkIcon({ size = 18, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6H6V7h6" />
      <polyline points="15,3 21,3 21,9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

// Historia icons
export function SeedlingIcon({ size = 28, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" />
      <path d="M12 12C12 7 7 4 4 6c3 0 6 2 8 6z" />
      <path d="M12 12c0-5 5-8 8-6-3 0-6 2-8 6z" />
    </svg>
  )
}

export function WaveIcon({ size = 28, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round">
      <path d="M2 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <path d="M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
    </svg>
  )
}

export function BoxIcon({ size = 28, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21,8 12,13 3,8" />
      <path d="M3 8l9-5 9 5v9l-9 5-9-5V8z" />
      <line x1="12" y1="13" x2="12" y2="22" />
    </svg>
  )
}

export function TrendDownIcon({ size = 28, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22,17 13,8 9,12 2,5" />
      <polyline points="16,17 22,17 22,11" />
    </svg>
  )
}

export function MountainIcon({ size = 28, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,3 22,21 2,21" />
      <polyline points="7,21 12,13 16,17" />
    </svg>
  )
}

export function SparkleIcon({ size = 28, className = '' }) {
  return (
    <svg {...s({ width: size, height: size })} className={className} viewBox="0 0 24 24" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
