import { useEffect, useRef } from 'react'
import '@fontsource/finger-paint/latin-400.css'
import { mountScratchCard } from '../lib/scratchCard'

const loadFont = (f) => (document.fonts ? document.fonts.load(f).catch(() => {}) : Promise.resolve())

// The playable loyalty card. React owns the static shell; lib/scratchCard.js draws and animates inside it.
// It only starts when the section is near the viewport, so the canvas work never delays the first paint.
export default function ScratchCard({ copy, onJoin }) {
  const rootRef = useRef(null)
  const ctlRef = useRef(null)
  const latest = useRef({ copy, onJoin })

  useEffect(() => {
    latest.current.onJoin = onJoin
  })

  useEffect(() => {
    latest.current.copy = copy
    ctlRef.current?.setCopy(copy)
  }, [copy])

  useEffect(() => {
    const root = rootRef.current
    let cancelled = false
    let io = null
    const start = () => {
      if (cancelled || ctlRef.current) return
      Promise.all([loadFont('40px "Finger Paint"'), loadFont('36px Parisienne')]).then(() => {
        if (cancelled || ctlRef.current) return
        ctlRef.current = mountScratchCard(root, { copy: latest.current.copy, onJoin: () => latest.current.onJoin?.() })
      })
    }
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); start() }
      }, { rootMargin: '400px 0px' })
      io.observe(root)
    } else {
      start()
    }
    return () => {
      cancelled = true
      io?.disconnect()
      ctlRef.current?.destroy()
      ctlRef.current = null
    }
  }, [])

  return (
    <div className="sc" ref={rootRef}>
      <div className="sc-stage" role="group" aria-label={copy.stage}>
        <div className="sc-padwrap" />
        <p className="sc-caption" aria-live="polite" />
        <button className="sc-alt" type="button" hidden>{copy.alt}</button>
      </div>
      <div className="sc-board" role="group" aria-label={copy.card}>
        <div className="sc-slots" />
        <p className="sc-count" />
      </div>
    </div>
  )
}
