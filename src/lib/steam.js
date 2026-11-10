/* Real-looking steam: soft puffs that rise from the coffee, sway wider as they climb, grow and thin out.
 It comes in waves and rests between them, so it appears and disappears. Stops when its host leaves the page. */
let spriteCache = null
const sprite = () => {
  if (spriteCache) return spriteCache
  const c = document.createElement('canvas'); c.width = c.height = 64
  const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,250,240,0.42)'); g.addColorStop(0.45, 'rgba(255,250,240,0.16)'); g.addColorStop(1, 'rgba(255,250,240,0)')
  x.fillStyle = g; x.fillRect(0, 0, 64, 64)
  spriteCache = c
  return c
}
const rand = (a, b) => a + Math.random() * (b - a)
export function startSteam(host, ref, opt = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const up = opt.up || 0, dpr = Math.min(window.devicePixelRatio || 1, 2)
  const hr = host.getBoundingClientRect(), r = ref.getBoundingClientRect()
  const pad = opt.pad || 0, W = hr.width + pad * 2, H = hr.height + up
  const cv = document.createElement('canvas'); cv.className = 'steam-cv'
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
  cv.style.cssText = `position:absolute;left:${-pad}px;top:${-up}px;width:${W}px;height:${H}px;pointer-events:none`
  host.appendChild(cv)
  const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr)
  const spr = sprite()
  const u = r.width / 200
  const ex = pad + r.left - hr.left + r.width * (0.5 + (opt.dx || 0)), ey = r.top - hr.top + up + r.height * (opt.ey || 0.3)
  const lanes = [-2, -1, 0, 1, 2].map((k) => ({ off: k * 7, ph: rand(0, 6.28), f: rand(1.1, 1.8), f2: rand(2.2, 3.4) }))
  let parts = [], acc = 0, last = performance.now(), t0 = last
  function frame(now) {
    if (!cv.isConnected) return
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    const t = (now - t0) / 1000
    const wave = Math.pow(Math.max(0, Math.sin(t * 0.95 + 0.9)), 0.6)           // 0..1, with real gaps between waves
    acc += dt * (wave * 78 + 3)
    while (acc >= 1) { acc -= 1; const L = lanes[(Math.random() * 5) | 0]; parts.push({ lane: L, x0: ex + (L.off + rand(-4, 4)) * u, y: ey + rand(-2, 2) * u, age: 0, life: rand(2.6, 3.6), s0: rand(6, 10) * u, s1: rand(24, 38) * u, v: rand(34, 50) * u, jit: rand(-0.5, 0.5) }) }
    ctx.clearRect(0, 0, W, H)
    parts = parts.filter((p) => p.age < p.life)
    for (const p of parts) {
      p.age += dt; p.y -= p.v * dt * (1 - 0.35 * (p.age / p.life))
      const k = p.age / p.life
      const sway = (Math.sin(p.age * p.lane.f + p.lane.ph + p.jit) + 0.55 * Math.sin(p.age * p.lane.f2 + p.lane.ph * 1.7)) * (3 + 22 * k) * u, drift = 6 * u * p.age
      const s = p.s0 + (p.s1 - p.s0) * Math.pow(k, 0.8)
      const a = Math.min(1, p.age / 0.3) * Math.pow(1 - k, 1.2) * 0.9
      ctx.globalAlpha = a; ctx.drawImage(spr, p.x0 + sway + drift - s / 2, p.y - s * 0.7, s, s * 1.4)
    }
    ctx.globalAlpha = 1
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

