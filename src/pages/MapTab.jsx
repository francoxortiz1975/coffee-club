import { useSearchParams } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import Segmented from '../components/Segmented'
import { PARIS_OUTLINE_D, PARIS_SEINE_D } from '../lib/parisMap'
import { useVisitas } from '../context/VisitasContext'

// Placeholder until the treasure map is built: Explore (every café) and My Paris (the ones you stamped).
export default function MapTab() {
  const [params, setParams] = useSearchParams()
  const mode = params.get('mode') === 'mine' ? 'mine' : 'explore'
  const { visitas } = useVisitas()

  return (
    <div className="pb-4">
      <AppHeader title="Map">
        <Segmented
          label="Map mode"
          value={mode}
          onChange={(m) => setParams(m === 'mine' ? { mode: 'mine' } : {}, { replace: true })}
          options={[{ id: 'explore', label: 'Explore' }, { id: 'mine', label: 'My Paris' }]}
        />
      </AppHeader>

      <div className="px-4 mt-4">
        <div className="relative rounded-3xl overflow-hidden shadow-md" style={{ background: 'radial-gradient(120% 110% at 50% 42%, #f0dcaa 0%, #e2c98f 65%, #b98c4f 100%)', boxShadow: 'inset 0 0 0 2px rgba(90,58,26,.3), 0 6px 20px rgba(0,0,0,.2)' }}>
          <svg viewBox="-20 -10 340 250" className="w-full" aria-hidden="true">
            <defs><clipPath id="mt-clip"><path d={PARIS_OUTLINE_D} /></clipPath></defs>
            <path d={PARIS_OUTLINE_D} fill="#ecd29a" opacity=".75" />
            <path d={PARIS_SEINE_D} fill="none" stroke="#6d8a93" strokeWidth="8" strokeLinecap="round" opacity=".85" clipPath="url(#mt-clip)" />
            <path d={PARIS_SEINE_D} fill="none" stroke="#a9c1c4" strokeWidth="3" strokeLinecap="round" clipPath="url(#mt-clip)" />
            <path d={PARIS_OUTLINE_D} fill="none" stroke="#3b2410" strokeWidth="2" />
          </svg>
          <div className="px-5 pb-5 -mt-2 text-center">
            <p className="text-2xl text-[#4a2410]" style={{ fontFamily: "'Parisienne', cursive" }}>The treasure map is being drawn</p>
            <p className="text-sm text-[#6b4a26] mt-2">
              {mode === 'explore'
                ? 'Every coffee shop will be an X on the map, with a dotted trail to follow.'
                : `Every café you visit gets a wax stamp. You have ${visitas.length} so far.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
