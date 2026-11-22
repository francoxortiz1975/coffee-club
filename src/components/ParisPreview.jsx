import { Link } from 'react-router-dom'
import { PARIS_OUTLINE_D, PARIS_SEINE_D } from '../lib/parisMap'

// Small parchment preview of "My Paris" on the Collect tab. It opens the Map tab in My Paris mode.
export default function ParisPreview({ visited }) {
  return (
    <Link
      to="/map?mode=mine"
      className="relative block h-28 rounded-2xl overflow-hidden shadow-sm active:scale-[0.99] transition-transform"
      style={{ background: 'radial-gradient(120% 120% at 50% 40%, #f0dcaa 0%, #e2c98f 65%, #b98c4f 100%)', boxShadow: 'inset 0 0 0 1px rgba(90,58,26,.25), 0 2px 8px rgba(0,0,0,.12)' }}
    >
      <svg viewBox="-10 -6 320 242" className="absolute right-0 top-0 h-full w-auto opacity-90" aria-hidden="true">
        <defs><clipPath id="pp-clip"><path d={PARIS_OUTLINE_D} /></clipPath></defs>
        <path d={PARIS_OUTLINE_D} fill="#ecd29a" opacity=".7" />
        <path d={PARIS_SEINE_D} fill="none" stroke="#6d8a93" strokeWidth="8" strokeLinecap="round" opacity=".8" clipPath="url(#pp-clip)" />
        <path d={PARIS_OUTLINE_D} fill="none" stroke="#3b2410" strokeWidth="2" />
      </svg>
      <div className="relative p-4 max-w-[60%]">
        <p className="text-[11px] font-sans font-semibold tracking-widest text-[#6b4a26]">MY PARIS</p>
        <p className="text-base font-display font-bold text-[#3b2410] leading-tight mt-1">
          {visited} {visited === 1 ? 'café' : 'cafés'} stamped
        </p>
        <p className="text-xs text-[#6b4a26] mt-1">Open the map ›</p>
      </div>
    </Link>
  )
}
