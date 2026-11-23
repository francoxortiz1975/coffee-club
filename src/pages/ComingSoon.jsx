import { useEffect } from 'react'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'

// All serif (Cormorant Garamond, the same one as the invitation letter), nothing else.
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
    <main className="fixed inset-0 flex flex-col text-[#2a1a10]" style={{ background: '#2a1a10', fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif" }}>
      <section className="relative basis-[58%] shrink-0 flex flex-col justify-end px-7 pb-9" style={{ background: "#efe6d4 url('/landing/paper.webp') center/cover" }}>
        <h1 className="font-semibold leading-[0.95] text-[clamp(3.4rem,17vw,6rem)]">
          Sumay,<br />the Coffee Club.
        </h1>
        <p className="italic text-[clamp(1.4rem,6vw,1.9rem)] mt-4 text-[#6b4c3b]">Starting in Paris.</p>
      </section>

      <section className="relative flex-1 flex flex-col items-start justify-between px-7 pt-8 pb-8 text-[#f5f0e8]" style={{ background: 'linear-gradient(160deg, #3d2b27, #2a1d1b 70%, #261918)' }}>
        <div>
          <p className="text-sm font-semibold tracking-[0.22em] text-[#b8d04a]">OPENING</p>
          <p className="font-semibold text-[clamp(2.2rem,10vw,3.2rem)] leading-tight mt-1">{when()}</p>
          <p className="italic text-lg text-[#f5f0e8]/75 mt-0.5">Paris time</p>
        </div>
        <p className="self-center text-base font-medium tracking-[0.24em] text-[#f5f0e8]/80">SUMAYCLUB.APP</p>
      </section>
    </main>
  )
}
