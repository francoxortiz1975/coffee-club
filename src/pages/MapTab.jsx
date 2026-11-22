import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import cafesData from '../data/cafes.json'
import AppHeader from '../components/AppHeader'
import Segmented from '../components/Segmented'
import ParisMap from '../components/ParisMap'
import { useVisitas } from '../context/VisitasContext'
import { CoffeeCupIcon, PinIcon } from '../components/Icons'

// Map tab: Explore (every café as an X on the map) and My Paris (the ones you stamped).
export default function MapTab() {
  const [params, setParams] = useSearchParams()
  const mode = params.get('mode') === 'mine' ? 'mine' : 'explore'
  const { visitas, toggleVisita } = useVisitas()
  const [selectedId, setSelectedId] = useState(null)

  const cafes = useMemo(() => cafesData.filter((c) => c.ciudad === 'Paris' && c.lat != null && c.lng != null), [])
  const stamped = useMemo(() => new Set(visitas), [visitas])
  const selected = cafes.find((c) => c.id === selectedId)
  const stampedHere = cafes.filter((c) => stamped.has(c.id)).length

  return (
    <div className="flex flex-col h-[calc(100dvh-96px)]">
      <AppHeader title="Map">
        <Segmented
          label="Map mode"
          value={mode}
          onChange={(m) => { setSelectedId(null); setParams(m === 'mine' ? { mode: 'mine' } : {}, { replace: true }) }}
          options={[{ id: 'explore', label: 'Explore' }, { id: 'mine', label: 'My Paris' }]}
        />
      </AppHeader>

      <div className="relative flex-1 min-h-0 mt-3">
        {cafes.length === 0 ? (
          <div className="absolute inset-x-4 top-0 bottom-2 rounded-3xl bg-[#faf4ec] flex items-center justify-center text-center px-8 text-cafe-accent/70 text-sm">
            No coffee shops on the map yet.
          </div>
        ) : (
          <>
            <div className="absolute inset-x-4 top-0 bottom-2">
              <ParisMap cafes={cafes} stamped={stamped} mode={mode} selectedId={selectedId} onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))} />
            </div>

            <div className="absolute left-6 right-6 bottom-5 z-10">
              {selected ? (
                <div className="bg-[#fffaf0] rounded-2xl p-3 shadow-xl">
                  <div className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl bg-cafe-accent/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {selected.fotos?.[0] ? <img src={selected.fotos[0]} alt="" className="w-full h-full object-cover" /> : <CoffeeCupIcon size={22} className="text-cafe-accent/30" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-display font-bold text-cafe-dark truncate">{selected.nombre}</p>
                      <p className="text-xs text-cafe-accent/70 flex items-center gap-1 truncate"><PinIcon size={11} className="shrink-0" />{selected.direccion || selected.barrio}</p>
                    </div>
                    <button onClick={() => setSelectedId(null)} aria-label="Close" className="w-11 h-11 -mr-1 flex items-center justify-center text-cafe-accent/60 text-xl">×</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Link to={`/invitacion/${selected.id}/setup`} className="min-h-11 rounded-xl bg-[#b8d04a] text-[#1f1409] text-sm font-bold flex items-center justify-center active:scale-95 transition-transform">Invite</Link>
                    <button
                      onClick={() => toggleVisita(selected.id)}
                      aria-pressed={stamped.has(selected.id)}
                      className={`min-h-11 rounded-xl text-sm font-bold flex items-center justify-center active:scale-95 transition-transform ${stamped.has(selected.id) ? 'bg-[#626d27] text-[#f2f6d0]' : 'bg-cafe-dark text-beige'}`}
                    >
                      {stamped.has(selected.id) ? '✓ Been here' : 'Been here'}
                    </button>
                    <Link to={`/cafe/${selected.id}`} className="min-h-11 rounded-xl bg-[#efe4d0] text-cafe-dark text-sm font-semibold flex items-center justify-center active:scale-95 transition-transform">Details</Link>
                    <a href={selected.googleMaps} target="_blank" rel="noopener noreferrer" className="min-h-11 rounded-xl bg-[#efe4d0] text-cafe-dark text-sm font-semibold flex items-center justify-center active:scale-95 transition-transform">Directions</a>
                  </div>
                </div>
              ) : mode === 'mine' ? (
                <div className="bg-[#fffaf0]/95 rounded-2xl px-4 py-3 shadow-lg">
                  <p className="text-sm font-display font-bold text-cafe-dark">{stampedHere} of {cafes.length} coffee shops stamped</p>
                  <div className="h-1.5 rounded-full bg-cafe-accent/15 mt-2 overflow-hidden" aria-hidden="true">
                    <div className="h-full bg-[#b8d04a]" style={{ width: `${(stampedHere / cafes.length) * 100}%` }} />
                  </div>
                </div>
              ) : (
                <p className="mx-auto w-fit bg-[#fffaf0]/90 rounded-full px-4 py-2 text-xs font-sans font-semibold text-cafe-dark shadow-md">Tap an X to see the café</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
