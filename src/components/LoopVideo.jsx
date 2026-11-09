import { useEffect, useRef } from 'react'

// Reproduce solo mientras se ve; respeta prefers-reduced-motion mostrando el poster.
export default function LoopVideo({ src, poster, label }) {
  const ref = useRef(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return undefined
    video.muted = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.35 },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} />
}
