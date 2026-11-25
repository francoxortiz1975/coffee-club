import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// sumayclub.app/members: the door for people who already have access. Same hang-tag language as the landing.
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function Members() {
  const [on, setOn] = useState(reduced)
  useEffect(() => {
    document.title = 'Members · Sumay'
    if (on) return undefined
    const id = setTimeout(() => setOn(true), 120)
    return () => clearTimeout(id)
  }, [on])

  const up = (d) => ({ transform: `translateY(${on ? 0 : 112}%)`, transition: `transform 1s ${EASE} ${d}ms` })
  const bar = (d, h) => ({ height: h, background: '#2a1a10', transform: `scaleX(${on ? 1 : 0})`, transition: `transform 1.1s ${EASE} ${d}ms`, transformOrigin: 'left' })

  return (
    <main className="fixed inset-0 flex flex-col text-[#2a1a10] bg-[#e3e3e0]" style={{ fontFamily: "'Geist Variable', system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <section className="flex-1 flex flex-col justify-end px-6 pb-10 mx-auto w-full max-w-xl">
        <span className="block" style={bar(0, 6)} />
        <h1 className="mt-4 font-normal text-[clamp(3rem,14vw,5.2rem)] leading-[0.94] tracking-[-0.055em]">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]"><span className="block" style={up(150)}>Members.</span></span>
        </h1>
        <span className="block mt-4" style={bar(350, 2)} />
        <p className="mt-3 text-[clamp(1.05rem,4.4vw,1.3rem)] tracking-[-0.03em] text-[#4a342a]">
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]"><span className="block" style={up(450)}>Welcome to the club.</span></span>
        </p>
        <Link to="/?app=1" className="mt-8 min-h-14 flex items-center justify-between px-5 bg-[#2a1a10] text-[#f5f0e8] text-[17px] tracking-[-0.02em] active:opacity-80 transition-opacity" style={{ opacity: on ? 1 : 0, transition: `opacity .8s ease 700ms` }}>
          <span>Enter</span><span aria-hidden="true">→</span>
        </Link>
        <Link to="/landing" className="mt-5 text-[14px] tracking-[-0.01em] text-[#4a342a] underline underline-offset-4 self-start" style={{ opacity: on ? 1 : 0, transition: 'opacity .8s ease 900ms' }}>Not a member yet? Request an invitation</Link>
      </section>
      <p className="h-[3.2%] min-h-7 flex items-center justify-center bg-[#2a1a10] text-[11px] font-medium tracking-[0.22em] text-[#f5f0e8]/85">SUMAYCLUB.APP</p>
    </main>
  )
}
