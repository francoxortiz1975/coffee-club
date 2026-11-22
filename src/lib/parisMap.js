import { PARIS_OUTLINE_LNGLAT } from '../data/parisOutline'

/* Paris on a flat map. Everything is in "map units" of 100 m, with north up.
   The outline is the real boundary of Paris. The Seine is hand-placed from the bridges, accurate to a few
   hundred metres, which is plenty for a drawn map. */

const LAT0 = 48.86
const LNG0 = 2.35
const KX = (111320 * Math.cos((LAT0 * Math.PI) / 180)) / 100 // units per degree of longitude
const KY = 110574 / 100 // units per degree of latitude

export function project(lat, lng) {
  return { x: (lng - LNG0) * KX, y: -(lat - LAT0) * KY }
}

const r1 = (n) => Math.round(n * 10) / 10

// Catmull-Rom through points, as one SVG path
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

const outlinePts = PARIS_OUTLINE_LNGLAT.map(([lng, lat]) => {
  const { x, y } = project(lat, lng)
  return [x, y]
})
export const OUTLINE_D = 'M' + outlinePts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join('L') + 'Z'

// The Seine through Paris, east to west: [lat, lng]
export const SEINE_LATLNG = [
  [48.8200, 2.3860], [48.8310, 2.3835], [48.8372, 2.3772], [48.8433, 2.3682], [48.8500, 2.3622],
  [48.8531, 2.3535], [48.8553, 2.3470], [48.8576, 2.3395], [48.8605, 2.3272], [48.8628, 2.3182],
  [48.8640, 2.3012], [48.8610, 2.2930], [48.8558, 2.2877], [48.8512, 2.2815], [48.8462, 2.2740],
  [48.8392, 2.2714], [48.8350, 2.2660],
]
export const SEINE_D = smoothPath(SEINE_LATLNG.map(([la, ln]) => { const p = project(la, ln); return [p.x, p.y] }))

// The two islands in the middle of the city
export const ISLANDS = [
  { ...project(48.8553, 2.3470), rx: 2.5, ry: 0.75, rot: -14 }, // Île de la Cité
  { ...project(48.8517, 2.3565), rx: 1.25, ry: 0.55, rot: -30 }, // Île Saint-Louis
]

export const LANDMARKS = [
  { id: 'eiffel', name: 'Eiffel Tower', ...project(48.8584, 2.2945) },
  { id: 'arc', name: 'Arc de Triomphe', ...project(48.8738, 2.2950) },
  { id: 'notredame', name: 'Notre-Dame', ...project(48.8530, 2.3499) },
  { id: 'sacrecoeur', name: 'Sacré-Cœur', ...project(48.8867, 2.3431) },
  { id: 'louvre', name: 'Louvre', ...project(48.8606, 2.3376) },
  { id: 'bastille', name: 'Bastille', ...project(48.8533, 2.3692) },
]

// The drawing area: the outline plus a margin
const xs = outlinePts.map((p) => p[0])
const ys = outlinePts.map((p) => p[1])
const PAD = 4
export const WORLD = {
  minX: Math.min(...xs) - PAD,
  minY: Math.min(...ys) - PAD,
  w: Math.max(...xs) - Math.min(...xs) + PAD * 2,
  h: Math.max(...ys) - Math.min(...ys) + PAD * 2,
}
export const WORLD_VIEWBOX = `${r1(WORLD.minX)} ${r1(WORLD.minY)} ${r1(WORLD.w)} ${r1(WORLD.h)}`

// Old names, still used by the small preview on the Collect tab
export const PARIS_OUTLINE_D = OUTLINE_D
export const PARIS_SEINE_D = SEINE_D
