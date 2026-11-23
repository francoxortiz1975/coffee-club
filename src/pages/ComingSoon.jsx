import { useEffect } from 'react'

// The public face of sumayclub.app for now: a very quiet "we open soon" screen. The full landing page lives on at /landing-full.
const OPENS = { date: '2026-11-24', label: '18:00' }   // Paris time

function parisToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date()) // YYYY-MM-DD
}
function when() {
  const days = Math.round((Date.parse(OPENS.date) - Date.parse(parisToday())) / 86400000)
  const word = days === 1 ? 'Tomorrow' : days === 0 ? 'Today' : days < 0 ? null : new Date(`${OPENS.date}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
  return word ? `${word} · ${OPENS.label}` : 'Now open'
}

export default function ComingSoon() {
  useEffect(() => { document.title = 'Sumay, the Coffee Club' }, [])
  return (
    <main className="fixed inset-0 flex flex-col text-[#2a1a10]" style={{ background: '#2a1a10' }}>
      <section className="relative basis-[58%] shrink-0 flex flex-col justify-end px-7 pb-9" style={{ background: "#efe6d4 url('/landing/paper.webp') center/cover" }}>
        <h1 className="font-display font-bold tracking-tight leading-[0.98] text-[clamp(3rem,15vw,5.4rem)]">
          Sumay,<br />the Coffee Club.
        </h1>
        <p className="font-sans text-[clamp(1.1rem,4.6vw,1.5rem)] mt-4 text-[#6b4c3b]">Starting in Paris.</p>
      </section>

      <section className="relative flex-1 flex flex-col items-start justify-between px-7 pt-8 pb-8 text-[#f5f0e8]" style={{ background: 'linear-gradient(160deg, #3d2b27, #2a1d1b 70%, #261918)' }}>
        <div>
          <p className="font-sans text-[11px] font-semibold tracking-[0.2em] text-[#b8d04a]">OPENING</p>
          <p className="font-display font-bold text-[clamp(1.8rem,8vw,2.6rem)] leading-tight mt-1">{when()}</p>
          <p className="font-sans text-sm text-[#f5f0e8]/70 mt-1">Paris time</p>
        </div>
        <p className="self-center font-sans text-[12px] tracking-[0.22em] text-[#f5f0e8]/80">SUMAYCLUB.APP</p>
      </section>
    </main>
  )
}
