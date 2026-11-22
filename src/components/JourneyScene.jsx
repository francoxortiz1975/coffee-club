import './journeyScene.css'

// A soft, slow background that changes with the chapter. Fixed behind the page, never blocks touches.
// Motion is CSS only and is turned off by prefers-reduced-motion.
const SCENES = {
  basics: { a: '#f3dfb8', b: '#d9a766', fx: 'steam' },
  methods: { a: '#cfe3df', b: '#6f9c98', fx: 'drops' },
  drinks: { a: '#ecd2b4', b: '#a87450', fx: 'steam' },
  origins: { a: '#dfe9c0', b: '#7fa05a', fx: 'mist', hills: true },
  tasting: { a: '#efd5d6', b: '#b3788a', fx: 'sparkle' },
  paris: { a: '#f3c9a0', b: '#3c3f6b', fx: 'sparkle', roofs: true },
}

const dots = Array.from({ length: 14 }, (_, i) => ({ left: (i * 37) % 100, delay: -((i * 1.7) % 9), dur: 7 + ((i * 3) % 6), size: 6 + ((i * 5) % 12) }))

export default function JourneyScene({ chapter = 'basics' }) {
  return (
    <div className="jscene" aria-hidden="true">
      {Object.entries(SCENES).map(([id, s]) => (
        <div key={id} className={`jscene-layer ${id === chapter ? 'on' : ''}`} style={{ background: `linear-gradient(180deg, ${s.a}, ${s.b})` }}>
          {dots.map((d, i) => (
            <span key={i} className={`jfx ${s.fx}`} style={{ left: `${d.left}%`, animationDelay: `${d.delay}s`, animationDuration: `${d.dur}s`, width: d.size, height: s.fx === 'drops' ? d.size * 2 : d.size }} />
          ))}
          {s.hills && (
            <svg className="jhills" viewBox="0 0 400 160" preserveAspectRatio="none"><path d="M0 110 Q70 40 150 90 T300 70 T400 100 V160 H0Z" fill="#5f8a45" opacity=".55" /><path d="M0 135 Q90 85 190 125 T400 115 V160 H0Z" fill="#46703a" opacity=".7" /></svg>
          )}
          {s.roofs && (
            <svg className="jhills" viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 120V80l20-14 20 14v-18l25-16 25 16v20h20V58l30-24 30 24v24h25V70l22-12 22 12v14h20V64l28-22 28 22v56Z" fill="#1d2038" opacity=".85" /></svg>
          )}
        </div>
      ))}
    </div>
  )
}
