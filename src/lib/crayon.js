/* Crayon: turns any drawing into something a child coloured in with a wax crayon:
 thick uneven strokes, rough edges, paper tooth showing through, streaks along the stroke. */
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
function hashN(x, y, s) { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1274126177)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295 }
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf)
  const a = hashN(xi, yi, s), b = hashN(xi + 1, yi, s), c = hashN(xi, yi + 1, s), d = hashN(xi + 1, yi + 1, s)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))

// draw(ctx) paints solid shapes in any opaque colour; returns a canvas with the crayon treatment in `color`
function wax(w, h, dpr, draw, o = {}) {
  const { color = '#3a2112', angle = -0.55, bite = 0.4, seed = 7, edge = 1 } = o
  const c = document.createElement('canvas'); c.width = Math.round(w * dpr); c.height = Math.round(h * dpr)
  const x = c.getContext('2d'); x.scale(dpr, dpr)
  x.filter = 'blur(' + edge + 'px)'; draw(x); x.filter = 'none'
  const img = x.getImageData(0, 0, c.width, c.height), d = img.data, col = rgb(color)
  const ca = Math.cos(angle), sa = Math.sin(angle)
  for (let py = 0; py < c.height; py++) {
    for (let px = 0; px < c.width; px++) {
      const i = (py * c.width + px) * 4, a = d[i + 3]
      if (!a) continue
      const X = px / dpr, Y = py / dpr
      const along = X * ca + Y * sa, across = -X * sa + Y * ca
      const tooth = vnoise(X * 1.5, Y * 1.5, seed) * 0.55 + hashN(Math.floor(X * 1.2), Math.floor(Y * 1.2), seed + 3) * 0.45
      const streak = vnoise(across * 1.3, along * 0.045, seed + 11)
      const press = vnoise(X * 0.05, Y * 0.05, seed + 19)
      const t = tooth * 0.5 + streak * 0.32 + press * 0.18
      const k = smooth(bite - 0.1, bite + 0.16, t)
      d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]
      d[i + 3] = Math.min(255, a * (0.08 + 0.92 * k) * (0.78 + 0.22 * press * 1.6))
    }
  }
  x.putImageData(img, 0, 0)
  return c
}

// hand-lettering: every glyph a little off (size, tilt, baseline), like a kid wrote it
function letters(x, text, cx, cy, size, font, o = {}) {
  const { jitter = 1, rot = 0, lw = 0.045 } = o
  x.save(); x.translate(cx, cy); x.rotate(rot)
  x.font = `${size}px ${font}`; x.textBaseline = 'middle'; x.textAlign = 'left'
  x.lineJoin = 'round'; x.lineCap = 'round'; x.lineWidth = size * lw
  const ws = [...text].map((ch) => x.measureText(ch).width), total = ws.reduce((a, b) => a + b, 0)
  let px = -total / 2
  ;[...text].forEach((ch, i) => {
    const r = () => (Math.random() - 0.5) * 2
    x.save(); x.translate(px + ws[i] / 2, r() * size * 0.05 * jitter); x.rotate(r() * 0.07 * jitter); x.scale(1 + r() * 0.06 * jitter, 1 + r() * 0.07 * jitter)
    x.fillText(ch, -ws[i] / 2, 0); x.strokeText(ch, -ws[i] / 2, 0); x.restore()
    px += ws[i]
  })
  x.restore()
}

export { wax, letters }
