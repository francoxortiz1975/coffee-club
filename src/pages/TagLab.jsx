import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import '../components/slurpTag.css'

// Prototype: the kraft-tag look on other views. Not linked from the app. Open /lab/tag.
const paris = cafes.filter((c) => c.ciudad === 'Paris')

const Label = ({ children }) => <p className="text-[11px] font-sans font-semibold tracking-[0.12em] uppercase mb-2 text-[#2a1a10]/70 px-1">{children}</p>

function CafeTag({ c, visited }) {
  return (
    <Link to={`/cafe/${c.id}`} className="tag tag-paper block rounded-md shadow-sm overflow-hidden active:scale-[0.98] transition-transform">
      <img src={c.fotos[0]} alt="" className="w-full h-40 object-cover" />
      <div className="px-4 pt-3 pb-4">
        <span className="tag-rule" />
        <div className="flex items-start justify-between gap-3 mt-3">
          <p className="font-sans font-bold text-[26px] leading-[1.05] tracking-tight">{c.nombre}</p>
          {visited && <span className="tag-stamp shrink-0 mt-1">been<br />here</span>}
        </div>
        <span className="tag-rule thin mt-3" />
        <div className="flex items-end justify-between mt-3 font-sans">
          <p className="text-[11px] font-semibold tracking-[0.12em]">{c.tipo.toUpperCase()}</p>
          <p className="text-right font-bold leading-tight"><span className="block text-[11px] tracking-wide">{c.ciudad.toUpperCase()}</span><span className="text-[22px]">{c.barrio}</span></p>
        </div>
      </div>
    </Link>
  )
}

function InviteTag({ c }) {
  return (
    <div className="tag tag-paper rounded-md shadow-sm px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-sans font-semibold tracking-[0.12em]">INVITATION · SENT</p>
        <span className="tag-stamp">Sat<br /><span className="text-[15px] font-bold">14</span></span>
      </div>
      <span className="tag-rule mt-3" />
      <p className="font-sans text-[18px] mt-3">Coffee with Maria at</p>
      <p className="font-sans font-bold text-[30px] leading-[1.03] tracking-tight mt-1">{c.nombre}</p>
      <span className="tag-rule thin mt-3" />
      <div className="tag-perf mt-4 pt-3 flex items-center justify-between font-sans">
        <p className="text-[12px] font-semibold tracking-[0.12em]">4:00 PM</p>
        <span className="tag-btn solid !min-h-10 !px-4 text-sm flex items-center">Open ›</span>
      </div>
    </div>
  )
}

function DetailTag({ c }) {
  return (
    <div className="tag tag-paper rounded-md shadow-sm overflow-hidden">
      <img src={c.fotos[0]} alt="" className="w-full h-52 object-cover" />
      <div className="px-4 pt-4 pb-5">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-sans font-semibold tracking-[0.12em]">{c.tipo.toUpperCase()}</p>
          <span className="tag-stamp">$$<br />price</span>
        </div>
        <span className="tag-rule mt-3" />
        <p className="font-sans text-[20px] mt-3">{c.barrio} · {c.ciudad}</p>
        <span className="tag-rule thin mt-2" />
        <p className="font-sans font-bold text-[38px] leading-[1.02] tracking-tight mt-4">{c.nombre}</p>
        <span className="tag-rule mt-5" />
        <div className="grid grid-cols-3 gap-2 mt-4 font-sans text-center">
          {['Invite', 'Been here', 'Directions'].map((t, i) => <span key={t} className={`tag-btn ${i === 0 ? 'solid' : ''} flex items-center justify-center text-[13px] !px-1`}>{t}</span>)}
        </div>
      </div>
    </div>
  )
}

function CardTag() {
  return (
    <div className="tag tag-paper rounded-md shadow-sm px-4 py-4">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-sans font-semibold tracking-[0.12em]">MY CARD</p>
        <span className="tag-stamp"><span className="text-[15px] font-bold">4</span>/10</span>
      </div>
      <span className="tag-rule mt-3" />
      <p className="font-sans font-bold text-[34px] leading-[1.02] tracking-tight mt-3">Ten beans make a cup.</p>
      <span className="tag-rule thin mt-3" />
      <div className="flex gap-2 mt-4">
        {Array.from({ length: 10 }, (_, i) => <span key={i} className={`flex-1 aspect-square rounded-full border-2 border-[var(--ink)] ${i < 4 ? 'bg-[var(--ink)]' : ''}`} />)}
      </div>
    </div>
  )
}

export default function TagLab() {
  return (
    <div className="px-4 pt-6 pb-10 flex flex-col gap-8 bg-[#f5f0e8] min-h-screen">
      <div><p className="font-display font-bold text-2xl text-cafe-dark">Tag look lab</p><p className="text-sm text-cafe-dark/70">Prototype only, not linked from the app.</p></div>
      <section><Label>Discover · café card</Label><div className="flex flex-col gap-4">{paris.slice(0, 2).map((c, i) => <CafeTag key={c.id} c={c} visited={i === 0} />)}</div></section>
      <section><Label>Café page</Label><DetailTag c={paris[2]} /></section>
      <section><Label>Invite · a plan</Label><InviteTag c={paris[0]} /></section>
      <section><Label>Collect · my card</Label><CardTag /></section>
    </div>
  )
}
