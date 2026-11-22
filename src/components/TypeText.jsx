import { useEffect, useRef, useState } from 'react'
import '../components/slurpTag.css'

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Text that writes itself, once, the first time it scrolls into view. The space it needs is reserved from the start,
// so nothing jumps. With reduced motion it is simply there.
export default function TypeText({ text, speed = 20 }) {
  const ref = useRef(null)
  const still = useState(reduced)[0]
  const [seen, setSeen] = useState(still)
  const [n, setN] = useState(still ? text.length : 0)

  useEffect(() => {
    if (seen) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { rootMargin: '0px 0px -10% 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [seen])

  useEffect(() => {
    if (!seen || n >= text.length) return
    const ch = text[n - 1]
    const id = setTimeout(() => setN((x) => x + 1), n === 0 ? 150 : /[.!?]/.test(ch) ? speed * 9 : /[,;:]/.test(ch) ? speed * 4 : speed)
    return () => clearTimeout(id)
  }, [seen, n, text, speed])

  const typing = seen && n < text.length
  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, n)}{typing && <span className="tag-caret" />}</span>
      <span aria-hidden="true" className="opacity-0">{text.slice(n)}</span>
    </span>
  )
}
