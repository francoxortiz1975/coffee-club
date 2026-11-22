// One line icon per kind of slurp, drawn in the same stroke style as the tab icons. Replaces the emojis.
const PATHS = {
  // sliders: the dials you adjust
  Technique: <><line x1="4" y1="7" x2="20" y2="7" /><circle cx="9" cy="7" r="2.2" /><line x1="4" y1="17" x2="20" y2="17" /><circle cx="15" cy="17" r="2.2" /></>,
  // a kettle
  Method: <><path d="M6 10h10v7a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" /><path d="M16 12h2a2 2 0 0 1 0 4h-2" /><path d="M9 6c0-1.5 1.5-1.5 1.5-3M12.5 6c0-1.5 1.5-1.5 1.5-3" /></>,
  // a cup
  Recipe: <><path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" /><path d="M16 10.5h1.5a2 2 0 0 1 0 4H16" /><line x1="4" y1="21" x2="17" y2="21" /></>,
  // a globe
  Origin: <><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><line x1="3" y1="12" x2="21" y2="12" /></>,
  // an open book
  Story: <><path d="M3 5.5C5.5 4.5 9 4.5 12 6.5c3-2 6.5-2 9-1v13c-2.5-1-6-1-9 1-3-2-6.5-2-9-1z" /><line x1="12" y1="6.5" x2="12" y2="19.5" /></>,
  // a nose, for smell and taste
  Tasting: <><path d="M12 4v8.5c0 1.5-2 2.2-2 4a2.5 2.5 0 0 0 2 2.5" /><path d="M12 19c1.7 0 3-1 3-2.7s-1.8-2.2-1.8-3.8" /><path d="M9.5 13.5a2.5 2.5 0 1 0 0 5M17 7.5c1.2.8 2 2 2 3.5" /></>,
  // the tower
  Paris: <><path d="M12 2.5v3" /><path d="M10.2 21l1-11h1.6l1 11" /><path d="M9 21h6" /><path d="M10.7 13.5h2.6M10.1 17h3.8" /><path d="M7 21h10" /></>,
  // a light bulb
  Tip: <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" /></>,
}

export default function SlurpIcon({ kind, size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[kind] || PATHS.Technique}
    </svg>
  )
}
