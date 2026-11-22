import './parisMap.css'

// The parts of the parchment look that sit on top of any map: old paper edges, ribbon title, compass, zoom buttons.
export default function MapDecor({ onZoomIn, onZoomOut, onFit, onAll, badge }) {
  const stop = (e) => e.stopPropagation()
  return (
    <>
      <div className="pm-burn" />
      <svg className="pm-ribbon" viewBox="0 0 220 34" aria-hidden="true">
        <path d="M2 4H218L208 17l10 13H2L12 17Z" fill="#e0bf82" stroke="#3b2410" strokeWidth="1.2" />
        <text x="110" y="23" textAnchor="middle" fontFamily="Parisienne, cursive" fontSize="19" fill="#4a2410">Paris · Coffee Quest</text>
      </svg>
      <svg className="pm-compass" viewBox="-36 -40 72 76" aria-hidden="true">
        <g stroke="#3b2410" fill="none">
          <circle r="26" strokeWidth="1" /><circle r="21" strokeWidth=".5" strokeDasharray="1.5 2" />
          <path d="M0-28L5 0 0 28-5 0Z" fill="#8a2b1c" strokeWidth=".8" /><path d="M-28 0L0-5 28 0 0 5Z" fill="#e9d19a" strokeWidth=".8" />
          <text y="-31" textAnchor="middle" fontFamily="Parisienne, cursive" fontSize="14" fill="#3b2410" stroke="none">N</text>
        </g>
      </svg>
      <div className="pm-zoom">
        <button type="button" aria-label="Zoom in" onPointerDown={stop} onClick={onZoomIn}>+</button>
        <button type="button" aria-label="Zoom out" onPointerDown={stop} onClick={onZoomOut}>−</button>
        <button type="button" aria-label="Show the cafés" onPointerDown={stop} onClick={onFit}>◎</button>
        <button type="button" aria-label="Show all of Paris" className="pm-all" onPointerDown={stop} onClick={onAll}>All</button>
        {badge && <button type="button" aria-label={`My Paris: ${badge.label} coffee shops stamped. Show only mine`} aria-pressed={badge.on} className={`pm-all pm-mine ${badge.on ? 'on' : ''}`} onPointerDown={stop} onClick={badge.onClick}>{badge.label}</button>}
      </div>
    </>
  )
}
