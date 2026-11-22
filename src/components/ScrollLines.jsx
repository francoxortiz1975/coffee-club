import { useEffect, useRef } from 'react'
import TypeText from './TypeText'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Lines of text that light up as they pass through the middle of the screen, and dim again after.
// Turned off by prefers-reduced-motion (everything stays fully visible).
export default function ScrollLines({ lines, className = '' }) {
  const refs = useRef([])

  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      refs.current.forEach((el) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - vh * 0.55) / (vh * 0.5)
        el.style.opacity = String(Math.max(0.22, 1 - d * 0.85))
        el.style.transform = `translateY(${Math.min(14, d * 10)}px)`
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [lines])

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {lines.map((t, i) => (
        <p key={i} ref={(el) => { refs.current[i] = el }} className={`will-change-transform transition-[opacity] duration-150 font-sans tracking-tight ${i === 0 ? 'text-[30px] leading-[1.08] font-extrabold' : 'text-[19px] leading-snug font-semibold'}`}><TypeText text={t} /></p>
      ))}
    </div>
  )
}
