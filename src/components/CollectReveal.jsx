import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import cafes from '../data/cafes.json'
import { useVisitas } from '../context/VisitasContext'
import { copy } from '../lib/landingCopy'
import ScratchCard from './ScratchCard'
import './scratchCollect.css'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const play = copy.en.beans.play

// Plays once when a café is marked as visited. It is the landing's playable card: scratch the foil, the bean pops out,
// flies into its slot on your card, and the count updates. Ten beans: the cup.
function Reveal({ fresh, onClose }) {
  const cafe = cafes.find((c) => c.id === fresh.cafeId)
  const [done, setDone] = useState(false)
  const slot = (fresh.n - 1) % 10   // beans already on the card before this one

  useEffect(() => {
    if (!done || reduced()) return
    confetti({ particleCount: slot === 9 ? 140 : 50, spread: 70, origin: { y: 0.72 }, colors: ['#b8d04a', '#f5f0e8', '#d2a972'], disableForReducedMotion: true })
  }, [done, slot])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && done) onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, onClose])

  return (
    <div role="dialog" aria-modal="true" aria-label="Collect your bean" className="scx fixed inset-0 z-[60] overflow-y-auto bg-[#160d07]/90 backdrop-blur-sm">
      <div className="min-h-full flex flex-col items-center justify-center px-5 py-8" style={{ paddingTop: 'calc(32px + env(safe-area-inset-top))', paddingBottom: 'calc(32px + env(safe-area-inset-bottom))' }}>
        <p className="text-[11px] font-sans font-semibold tracking-[0.14em] text-[#cdbba3]">YOU WERE AT</p>
        <p className="font-display font-bold text-[#f5f0e8] text-[26px] leading-tight text-center mt-1 mb-6">{cafe?.nombre || 'a new café'}</p>

        <ScratchCard copy={play} startAt={slot} single onCollected={() => setDone(true)} />

        <div className="h-16 mt-6 flex items-center">
          {done && (
            <button onClick={onClose} className="min-h-12 px-10 rounded-full bg-[#b8d04a] text-[#1f1409] text-base font-bold active:scale-95 transition-transform">Done</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CollectReveal() {
  const { fresh, clearFresh } = useVisitas()
  return fresh ? <Reveal key={fresh.key} fresh={fresh} onClose={clearFresh} /> : null
}
