/* The scratch-off foil: kraft paper with a crayon-written label, lit from the top-left like the beans.
 Everything is painted into one canvas so scratching erases the lighting along with the foil. */
import { wax, letters } from './crayon'

const rand = (a, b) => a + Math.random() * (b - a)
const rr = (x, a, b, w, h, r) => { x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath() }

function fit(x, text, size, family, maxW) {
  x.font = `${size}px ${family}`
  const w = x.measureText(text).width
  return w > maxW ? size * (maxW / w) : size
}

// lines: the words, top to bottom. Their size and tilt are laid out by how many there are.
export function paintFoil(ctx, W, H, dpr, o) {
  const { lines: words, family = 'CF', radius = 28 } = o
  ctx.save()
  // 1. kraft base, uneven like real paper
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#c9a06a'); g.addColorStop(0.5, '#b58a57'); g.addColorStop(1, '#9d7345')
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
  for (let i = 0; i < 16; i++) {
    const cx = rand(0, W), cy = rand(0, H), r = rand(36, 100), light = i % 2
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    rg.addColorStop(0, light ? 'rgba(236,206,160,0.13)' : 'rgba(70,40,15,0.12)'); rg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = rg; ctx.fillRect(cx - r, cy - r, r * 2, r * 2)
  }
  // 2. the texture that was already approved: speckle and fine fibres
  for (let i = 0; i < 2600; i++) { ctx.globalAlpha = rand(0.1, 0.34); ctx.fillStyle = i % 2 ? '#dcb783' : '#7d5830'; const s = rand(0.6, 1.9); ctx.fillRect(rand(0, W), rand(0, H), s, s) }
  ctx.globalAlpha = 0.07; ctx.strokeStyle = '#3a200e'; ctx.lineWidth = 1
  for (let y = -H; y < H * 2; y += 5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y + rand(-6, 6)); ctx.stroke() }
  ctx.globalAlpha = 1

  // 3. crayon label (a pale wax edge underneath makes the strokes read as raised)
  const layout = words.length === 3
    ? [[0.3, 0.205, -0.05, 0.5], [0.5, 0.17, 0.02, 0.5], [0.7, 0.28, -0.04, 0.55]]
    : [[0.34, 0.215, -0.06, 0.5], [0.6, 0.3, -0.03, 0.55]]
  const lines = words.map((t, i) => [t, ...layout[i]])
  const draw = (m) => {
    m.fillStyle = m.strokeStyle = '#000'
    for (const [t, yy, sz, rot, xx] of lines) {
      const size = fit(m, t, sz * W, family, W * 0.78)
      letters(m, t, W * xx, H * yy, size, family, { rot, lw: 0.05 })
    }
  }
  const hi = wax(W, H, dpr, draw, { color: '#f1d9a8', bite: 0.34, seed: 41 })
  const lo = wax(W, H, dpr, draw, { color: '#3a1d0c', bite: 0.3, seed: 12 })
  ctx.globalAlpha = 0.55; ctx.drawImage(hi, 1.5, 2, W, H); ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(lo, 0, 0, W, H); ctx.globalCompositeOperation = 'source-over'

  // 4. light from the top-left, shade to the bottom-right, a little darker at the corners
  const L = ctx.createLinearGradient(0, 0, W, H)
  L.addColorStop(0, 'rgba(255,240,208,0.34)'); L.addColorStop(0.42, 'rgba(255,240,208,0)'); L.addColorStop(0.62, 'rgba(35,16,2,0)'); L.addColorStop(1, 'rgba(35,16,2,0.40)')
  ctx.fillStyle = L; ctx.fillRect(0, 0, W, H)
  const V = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.78)
  V.addColorStop(0, 'rgba(30,14,2,0)'); V.addColorStop(1, 'rgba(30,14,2,0.22)')
  ctx.fillStyle = V; ctx.fillRect(0, 0, W, H)

  // 5. bevelled edge: lit on the top-left, in shadow on the bottom-right
  ctx.save(); rr(ctx, 0, 0, W, H, radius); ctx.clip()
  const B = ctx.createLinearGradient(0, 0, W, H)
  B.addColorStop(0, 'rgba(255,238,205,0.55)'); B.addColorStop(0.45, 'rgba(255,238,205,0.04)'); B.addColorStop(0.55, 'rgba(30,12,0,0.04)'); B.addColorStop(1, 'rgba(30,12,0,0.55)')
  ctx.lineWidth = 5; ctx.strokeStyle = B; rr(ctx, 1, 1, W - 2, H - 2, radius - 1); ctx.stroke()
  ctx.restore()
  ctx.restore()
}

