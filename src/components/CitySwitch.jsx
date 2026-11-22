import { useState } from 'react'
import { CITIES, useCity } from '../lib/city'
import { PinIcon } from './Icons'

// A small "Paris ▾" button; opens a sheet to pick the city.
export default function CitySwitch({ dark = false }) {
  const { city, setCity } = useCity()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`City: ${city}. Change city`}
        className={`relative min-h-11 px-3 -ml-1 rounded-full flex items-center gap-1.5 text-sm font-sans font-semibold active:scale-95 transition-transform ${dark ? 'text-beige' : 'text-cafe-dark'}`}
      >
        <PinIcon size={14} />
        {city}
        <span aria-hidden="true" className="text-xs opacity-70">▾</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end justify-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md bg-[#faf4ec] rounded-t-3xl p-5 pb-8 shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Choose a city">
            <h3 className="text-lg font-display font-bold text-cafe-dark mb-3">Choose a city</h3>
            <div className="flex flex-col gap-2">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCity(c); setOpen(false) }}
                  aria-pressed={c === city}
                  className={`min-h-12 rounded-2xl px-4 flex items-center justify-between text-base font-sans font-semibold active:scale-[0.98] transition-transform ${c === city ? 'bg-cafe-dark text-beige' : 'bg-white/70 border border-cafe-accent/20 text-cafe-dark'}`}
                >
                  {c}
                  {c === city && <span aria-hidden="true">✓</span>}
                </button>
              ))}
            </div>
            <p className="text-xs text-cafe-accent/70 mt-3">The treasure map is Paris only for now.</p>
          </div>
        </div>
      )}
    </>
  )
}
