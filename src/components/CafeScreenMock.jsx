import cafes from '../data/cafes.json'
import { ArrowLeftIcon, HeartIcon, UsersIcon } from './Icons'
import { OCASION_LABELS } from '../lib/ocasiones'
import { toLines } from '../lib/textLines'
import TypeText from './TypeText'

// A faithful picture of the café screen for the landing: the same photo, name, tags, big sentence and Culture card as the
// real page, in a phone. It is only a picture (nothing here is tappable, and it never touches the app's state).
export default function CafeScreenMock({ id = 'ceramicafe-genevieve' }) {
  const c = cafes.find((x) => x.id === id)
  if (!c) return null
  const lines = toLines(c.descripcion)
  return (
    <div className="mx-auto w-[300px] rounded-[38px] border-[6px] border-[#0f0907] bg-[#e3e3e0] shadow-[0_40px_60px_-20px_rgba(0,0,0,.7)] overflow-hidden select-none" aria-label={`The ${c.nombre} screen`} role="img">
      <div className="relative h-[150px] bg-[#cfcfcc]">
        <img src={c.fotos[0]} alt="" className="w-full h-full object-cover" />
        <span className="absolute left-3 top-3 w-9 h-9 rounded-full bg-white/85 text-[#3d2b1f] flex items-center justify-center"><ArrowLeftIcon size={16} /></span>
        <span className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/85 text-[#6b4c3b] flex items-center justify-center"><HeartIcon size={16} /></span>
      </div>
      <div className="px-4 pt-4 pb-5 text-[#2a1a10]" style={{ fontFamily: "'Geist Variable', system-ui, sans-serif" }}>
        <h3 className="font-display text-[25px] leading-[1.04] font-bold"><TypeText text={c.nombre} speed={30} /></h3>
        <p className="mt-1 text-[11px] text-[#6b4c3b]/70">{c.barrio}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="text-[11px] bg-[#f5f0e8] border border-[#6b4c3b]/30 text-[#6b4c3b] rounded-full px-2.5 py-0.5">{c.tipo}</span>
          {c.ocasiones.map((o) => <span key={o} className="text-[11px] bg-[#3d2b1f] text-[#f5f0e8] rounded-full px-2.5 py-0.5">{OCASION_LABELS[o] ?? o}</span>)}
        </div>
        <p className="mt-4 text-[22px] leading-[1.06] font-extrabold tracking-tight"><TypeText text={lines[0] || c.historia} speed={22} /></p>
        {lines[1] && <p className="mt-3 text-[14px] leading-snug font-semibold text-[#2a1a10]/80 line-clamp-3">{lines[1]}</p>}
        {c.cultura && (
          <div className="mt-4 rounded-2xl bg-[#3d2b1f] text-[#f5f0e8] p-3.5">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] text-[#b8d04a]"><UsersIcon size={14} />CULTURE</p>
            <p className="mt-1.5 text-[13px] leading-snug font-semibold line-clamp-4">{c.cultura}</p>
          </div>
        )}
      </div>
    </div>
  )
}
