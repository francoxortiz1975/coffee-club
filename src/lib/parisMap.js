/* Paris as a stylized outline, in a 300 x 230 box. This is a hand-made approximation (placeholder) so the
   screens have a shape to draw. The real map will replace these points with the official Paris outline. */
export const PARIS_W = 300
export const PARIS_H = 230

const OUTLINE = [[40, 14], [78, 10], [120, 8], [166, 12], [208, 24], [246, 40], [272, 58], [290, 84], [298, 114], [290, 142], [270, 162], [246, 178], [226, 198], [196, 214], [156, 222], [112, 218], [78, 204], [48, 182], [26, 156], [10, 126], [8, 96], [14, 66], [24, 40]]
const SEINE = [[262, 176], [236, 158], [208, 142], [182, 128], [162, 120], [142, 112], [124, 104], [106, 108], [92, 120], [78, 134], [64, 152], [46, 168], [24, 184]]

const r1 = (n) => Math.round(n * 10) / 10

// Catmull-Rom through the points, as one SVG path
export function smoothPath(p, closed = false) {
  const n = p.length
  const g = (i) => p[(i + n) % n]
  let d = `M${r1(p[0][0])} ${r1(p[0][1])}`
  const end = closed ? n : n - 1
  for (let i = 0; i < end; i++) {
    const p0 = closed ? g(i - 1) : p[Math.max(0, i - 1)]
    const p1 = g(i)
    const p2 = closed ? g(i + 1) : p[i + 1]
    const p3 = closed ? g(i + 2) : p[Math.min(n - 1, i + 2)]
    d += ` C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`
  }
  return d + (closed ? 'Z' : '')
}

export const PARIS_OUTLINE_D = smoothPath(OUTLINE, true)
export const PARIS_SEINE_D = smoothPath(SEINE, false)
