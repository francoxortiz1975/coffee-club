import { useMemo, useState, useEffect, useRef } from 'react'
import { beanSVG, cupSVG, cupOutlineSVG } from '../lib/beanArt'
import { loyaltyCopyEs } from '../lib/loyaltyCopy'
import './loyalty.css'

/* The loyalty card in the app: a burlap board with ten boxes. Every visited café is a bean; the tenth
   box is the cup you earn. It fills from the real visit count, then starts a fresh card.
   The SVG strings come from lib/beanArt.js, which builds them from numbers only (never from user input). */

const SLOTS = 10
const seedOf = (i) => 11 + i * 137
const angleOf = (i) => ((i * 47) % 116) - 58

export function BeanRow({ items }) {
  // items: [{ id, visited, title }] -> small stitched / filled beans (used inside each barrio card)
  const faces = useMemo(
    () => items.map((_, i) => ({ on: beanSVG(seedOf(i + 3), angleOf(i + 3)), out: beanSVG(seedOf(i + 3), angleOf(i + 3), { outline: true }) })),
    [items.length], // eslint-disable-line react-hooks/exhaustive-deps
  )
  return (
    <div className="lc-row">
      {items.map((it, i) => (
        <span
          key={it.id}
          className={`lc-mini ${it.visited ? 'on' : ''}`}
          title={it.title}
          role="img"
          aria-label={`${it.title}: ${it.visited ? 'visited' : 'not visited'}`}
          dangerouslySetInnerHTML={{ __html: it.visited ? faces[i].on : faces[i].out }}
        />
      ))}
    </div>
  )
}

export default function LoyaltyCard({ total, copy = loyaltyCopyEs }) {
  const shown = total <= 0 ? 0 : ((total - 1) % SLOTS) + 1 // 0..10: how much of the current card is filled
  const cups = Math.floor(total / SLOTS)
  const [intro, setIntro] = useState(true) // on first show the beans are dealt in one after another
  const slotRefs = useRef([])

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 1600)
    return () => clearTimeout(t)
  }, [])

  const faces = useMemo(
    () => Array.from({ length: SLOTS }, (_, i) => ({
      on: i === SLOTS - 1 ? cupSVG() : beanSVG(seedOf(i), angleOf(i)),
      out: i === SLOTS - 1 ? cupOutlineSVG() : beanSVG(seedOf(i), angleOf(i), { outline: true }),
    })),
    [],
  )

  const d = shown
  const text = d <= 0 ? copy.c0 : d === 1 ? copy.c1 : d === 9 ? copy.c9 : d >= 10 ? copy.c10 : copy.cN.replace('{n}', d).replace('{r}', 10 - d)

  // Tap a bean: it turns 60 degrees and settles back. Tap the cup: it hops. Same moves as the landing card.
  function tap(i) {
    if (i >= shown || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const slot = slotRefs.current[i]
    const ic = slot?.querySelector('svg:not(.out)')
    if (!ic || slot.dataset.busy) return
    slot.dataset.busy = '1'
    const cup = i === SLOTS - 1
    const frames = cup
      ? [{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(-10px) rotate(-7deg)', offset: 0.35 }, { transform: 'translateY(0) rotate(4deg)', offset: 0.65 }, { transform: 'none' }]
      : [{ transform: 'rotate(0deg) scale(1)' }, { transform: 'rotate(60deg) scale(1.16)', offset: 0.42 }, { transform: 'rotate(-7deg) scale(1.03)', offset: 0.74 }, { transform: 'rotate(0deg) scale(1)' }]
    const done = () => { delete slot.dataset.busy }
    ic.animate(frames, { duration: cup ? 560 : 640, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }).finished.then(done, done)
  }

  return (
    <section className="lc" aria-label={copy.aria(shown, cups)}>
      <div className="lc-head">
        <p className="lc-title">{copy.title}</p>
        {cups > 0 && <p className="lc-cups">{copy.cups(cups)}</p>}
      </div>
      <div className="lc-board">
        <div className="lc-slots">
          {faces.map((f, i) => {
            const on = i < shown
            const next = i === shown && shown < SLOTS
            return (
              <button
                type="button"
                key={i}
                ref={(el) => { slotRefs.current[i] = el }}
                className={`lc-slot ${i === SLOTS - 1 ? 'cup' : ''} ${on ? 'on' : ''} ${next ? 'next' : ''} `}
                style={{ '--gd': `${(i * 0.17).toFixed(2)}s`, '--td': `${((i * 1.37) % 7).toFixed(2)}s`, '--in': intro ? `${i * 90}ms` : '0ms' }}
                onClick={() => tap(i)}
                tabIndex={on ? 0 : -1}
                aria-hidden={on ? undefined : true}
                aria-label={on ? (i === SLOTS - 1 ? 'Cup' : `Bean ${i + 1}`) : undefined}
              >
                {/* key on `on` so a newly earned bean mounts fresh and plays its landing animation */}
                <span key={on ? 'b' : 'o'} className={`lc-face ${on ? 'lc-land' : ''}`} dangerouslySetInnerHTML={{ __html: on ? f.on : f.out }} />
              </button>
            )
          })}
        </div>
        <p className="lc-count" aria-live="polite">{text}</p>
      </div>
    </section>
  )
}
