/* Sumay coffee icons as inline SVG strings: smooth silhouette, soft gradients, one light from the top-left,
 a soft cast shadow. Computed in screen space so tilting a bean never rotates its light.
 Every string is generated here from numbers, never from user input. */
let uid = 0
const f = (n) => Math.round(n * 10) / 10
const P = (p) => f(p[0]) + ' ' + f(p[1])
const rotp = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c] }
function rng(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const shade = (h, k) => '#' + hex(h).map((v) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, '0')).join('')

// dashed stitching with a white glint that sweeps across it now and then, like light on glass
const stitch = (cls, paths, id, w, dash, tf = '', glint = true) => `<svg class="${cls}" viewBox="-100 -100 200 200" aria-hidden="true" overflow="visible">
${glint ? `<defs><mask id="${id}g" maskUnits="userSpaceOnUse" x="-140" y="-140" width="280" height="280"><g class="glint"><rect x="-17" y="-170" width="34" height="340" fill="#fff" transform="rotate(26)"/><rect x="26" y="-170" width="9" height="340" fill="#fff" opacity=".7" transform="rotate(26)"/></g></mask></defs>` : ''}
<g ${tf ? `transform="${tf}"` : ''} fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="${w}" stroke-dasharray="${dash} ${dash}">
<g transform="translate(1 1.6)" stroke="rgba(30,14,2,.45)">${paths}</g>
<g stroke="#f4e8d2" stroke-opacity=".62">${paths}</g>
${glint ? `<g stroke="#ffffff" stroke-width="${w + 0.8}" mask="url(#${id}g)">${paths}</g>` : ''}
</g></svg>`

export function beanSVG(seed = 1, deg = -30, opt = {}) {
  const id = 'bn' + ++uid
  const r = rng(seed * 977 + 11)
  const a = (deg * Math.PI) / 180
  const R = (p) => rotp(p, a)
  const pea = !!opt.peaberry
  const hw = pea ? 70 : 63 + r() * 7, hh = pea ? 74 : 84 + r() * 5
  const j = () => (r() - 0.5) * 6
  const k = () => 0.56 + r() * 0.08
  const T = R([j(), -hh]), Rt = R([hw, j()]), B = R([j(), hh]), Lf = R([-hw, j()])
  // handles (rotate too)
  const c = (x, y) => R([x, y])
  const k1 = k(), k2 = k(), k3 = k(), k4 = k()
  const body =
    `M${P(T)} C${P(c(k1 * hw, -hh))} ${P(c(hw, -k1 * hh))} ${P(Rt)} ` +
    `C${P(c(hw, k2 * hh))} ${P(c(k2 * hw, hh))} ${P(B)} ` +
    `C${P(c(-k3 * hw, hh))} ${P(c(-hw, k3 * hh))} ${P(Lf)} ` +
    `C${P(c(-hw, -k4 * hh))} ${P(c(-k4 * hw, -hh))} ${P(T)}Z`

  if (opt.outline) {
    return stitch('bean3d out', `<path d="${body}" transform="scale(1.09)"/>`, id, 4.6, 10, '', false)
  }
  // crease: tapered S
  const s1 = r() < 0.5 ? 1 : -1, amp = 0.34 + r() * 0.22, off = (r() - 0.5) * 6
  const p0 = [off, -hh * 0.78], p1 = [s1 * hw * amp, -hh * 0.3], p2 = [-s1 * hw * amp, hh * 0.3], p3 = [off, hh * 0.78]
  const bez = (t) => {
    const u = 1 - t
    return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i])
  }
  const N = 44, left = [], right = [], mid = []
  const wmax = pea ? 14 : 19 + r() * 4
  for (let i = 0; i <= N; i++) {
    const t = i / N, q = bez(t), q2 = bez(Math.min(1, t + 0.01)), q1 = bez(Math.max(0, t - 0.01))
    let tx = q2[0] - q1[0], ty = q2[1] - q1[1]; const l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l
    const w = wmax * Math.pow(Math.sin(Math.PI * t), 0.55) * 0.5
    left.push(R([q[0] - ty * w, q[1] + tx * w])); right.push(R([q[0] + ty * w, q[1] - tx * w])); mid.push(R(q))
  }
  const crease = 'M' + left.map(P).join(' L') + ' L' + right.reverse().map(P).join(' L') + 'Z'

  // the lobe away from the light gets a darker wash
  const nrm = (() => { const a1 = mid[Math.floor(N / 2) - 1], a2 = mid[Math.floor(N / 2) + 1]; const tx = a2[0] - a1[0], ty = a2[1] - a1[1], l = Math.hypot(tx, ty) || 1; return [-ty / l, tx / l] })()
  const away = nrm[0] * 0.6 + nrm[1] * 0.8 > 0 ? 1 : -1 // normal pointing away from the light (-.6,-.8) => dot with (+.6,+.8)
  const ext = (p, q, s) => [p[0] + (p[0] - q[0]) * s, p[1] + (p[1] - q[1]) * s]
  const e0 = ext(mid[0], mid[3], 6), e1 = ext(mid[N], mid[N - 3], 6)
  const far = (p) => [p[0] + nrm[0] * away * 220, p[1] + nrm[1] * away * 220]
  const lobe = 'M' + [e0, ...mid, e1, far(e1), far(e0)].map(P).join(' L') + 'Z'

  // roast: each bean a touch lighter or darker
  const roast = 0.9 + r() * 0.2
  const g0 = shade('#e6ae75', roast), g1 = shade('#b9713a', roast), g2 = shade('#744120', roast), g3 = shade('#472411', roast)

  return `<svg class="bean3d" viewBox="-100 -100 200 200" aria-hidden="true" overflow="visible">
<defs>
<linearGradient id="${id}b" gradientUnits="userSpaceOnUse" x1="-52" y1="-84" x2="58" y2="92"><stop offset="0" stop-color="${g0}"/><stop offset=".36" stop-color="${g1}"/><stop offset=".74" stop-color="${g2}"/><stop offset="1" stop-color="${g3}"/></linearGradient>
<linearGradient id="${id}l" gradientUnits="userSpaceOnUse" x1="-40" y1="-60" x2="60" y2="70"><stop offset="0" stop-color="#2a1006" stop-opacity=".04"/><stop offset="1" stop-color="#2a1006" stop-opacity=".46"/></linearGradient>
<linearGradient id="${id}c" gradientUnits="userSpaceOnUse" x1="-22" y1="-52" x2="30" y2="56"><stop offset="0" stop-color="#fff6d6"/><stop offset=".5" stop-color="#f3cc88"/><stop offset="1" stop-color="#d98f43"/></linearGradient>
<radialGradient id="${id}h" gradientUnits="userSpaceOnUse" cx="-30" cy="-44" r="64"><stop offset="0" stop-color="#ffe7c4" stop-opacity=".62"/><stop offset="1" stop-color="#ffe7c4" stop-opacity="0"/></radialGradient>
<clipPath id="${id}k"><path d="${body}"/></clipPath>
</defs>
<path d="${body}" fill="url(#${id}b)"/>
<g clip-path="url(#${id}k)">
<path d="${lobe}" fill="url(#${id}l)"/>
<circle cx="-30" cy="-44" r="64" fill="url(#${id}h)"/>
<path d="${crease}" transform="translate(9 10)" fill="#2a1006" opacity=".42"/>
<path d="${crease}" fill="url(#${id}c)"/>
</g>
</svg>`
}

const CUP_BODY = 'M-66 -21 C-69 18 -46 46 0 48 C46 46 69 18 66 -21Z'
const CUP_OPEN = 'M-66 -21 C-69 18 -46 46 0 48 C46 46 69 18 66 -21'
const CUP_HANDLE = 'M60 -10 C114 -22 114 32 55 28'
const GROUP = 'translate(-16 -2) scale(1.08)'
// latte art: a solid heart, then bands that wrap around it and all meet at one point below. Drawn flat, then squashed into the cup's oval.
const rosetta = (id) => {
  // exactly: one line, one heart, another line. Each line is a crescent hugging the heart, pointed at both ends.
  const heart = 'M0 21 C-7 14 -18 4 -18 -10 C-18 -24 -7 -30 0 -21 C7 -30 18 -24 18 -10 C18 4 7 14 0 21Z'
  const heart2 = 'M0 14 C-5 9 -12 3 -12 -7 C-12 -16 -5 -21 0 -15 C5 -21 12 -16 12 -7 C12 3 5 9 0 14Z'
  const wing = (sx) => {
    const p = (x, y) => `${(sx * x).toFixed(1)} ${y}`
    return `M${p(13, -35)} C${p(26, -42)} ${p(42, -27)} ${p(42, -7)} C${p(42, 13)} ${p(21, 38)} ${p(4, 41)} C${p(13, 33)} ${p(33, 14)} ${p(33, -7)} C${p(33, -23)} ${p(25, -37)} ${p(13, -35)}Z`
  }
  return `<g clip-path="url(#${id}k2)"><g transform="translate(0 -20.5) scale(1.1 .56)"><g fill="url(#${id}w)"><path d="${wing(-1)}"/><path d="${wing(1)}"/><path d="${heart}"/></g><path d="${heart2}" fill="#fff8ee" opacity=".85"/></g></g>`
}
function cup() {
  const id = 'cp' + ++uid
  return `<svg class="cup3d" viewBox="-100 -100 200 200" aria-hidden="true" overflow="visible">
<defs>
<linearGradient id="${id}a" gradientUnits="userSpaceOnUse" x1="-66" y1="-30" x2="68" y2="56"><stop offset="0" stop-color="#fff6e4"/><stop offset=".42" stop-color="#f4e0bd"/><stop offset=".8" stop-color="#e2c698"/><stop offset="1" stop-color="#cba777"/></linearGradient>
<linearGradient id="${id}f" gradientUnits="userSpaceOnUse" x1="-66" y1="0" x2="66" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".52" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#7a4a14" stop-opacity=".34"/></linearGradient>
<linearGradient id="${id}r" gradientUnits="userSpaceOnUse" x1="-60" y1="-52" x2="60" y2="8"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#ecd5aa"/></linearGradient>
<radialGradient id="${id}k" gradientUnits="userSpaceOnUse" cx="0" cy="-21" r="58" gradientTransform="translate(0 -21) scale(1 .51) translate(0 21)"><stop offset="0" stop-color="#4a2e1b"/><stop offset=".7" stop-color="#3b2316"/><stop offset="1" stop-color="#2a170c"/></radialGradient>
<linearGradient id="${id}i" gradientUnits="userSpaceOnUse" x1="0" y1="-52" x2="0" y2="-4"><stop offset="0" stop-color="#1e0d02" stop-opacity=".55"/><stop offset=".55" stop-color="#1e0d02" stop-opacity="0"/></linearGradient>
<linearGradient id="${id}w" gradientUnits="userSpaceOnUse" x1="-40" y1="-37" x2="40" y2="40"><stop offset="0" stop-color="#f6ead6"/><stop offset="1" stop-color="#d8c3a0"/></linearGradient>
<linearGradient id="${id}h" gradientUnits="userSpaceOnUse" x1="60" y1="-24" x2="116" y2="36"><stop offset="0" stop-color="#e8d2a6"/><stop offset=".5" stop-color="#f7e8ca"/><stop offset="1" stop-color="#d2b27e"/></linearGradient>
<filter id="${id}s" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="4.5"/></filter>
<clipPath id="${id}c"><path d="${CUP_BODY}"/></clipPath>
<clipPath id="${id}k2"><ellipse cx="0" cy="-21" rx="57" ry="28.6"/></clipPath>
</defs>
<g transform="${GROUP}">
<ellipse cx="14" cy="51" rx="68" ry="10" fill="#2a1200" opacity=".5" filter="url(#${id}s)"/>
<path d="M-30 42 C-30 57 30 57 30 42Z" fill="#d3b583"/>
<path d="${CUP_HANDLE}" transform="translate(1.8 2.6)" fill="none" stroke="#3a2008" stroke-opacity=".34" stroke-width="15" stroke-linecap="round" filter="url(#${id}s)"/>
<path d="${CUP_HANDLE}" fill="none" stroke="url(#${id}h)" stroke-width="14" stroke-linecap="round"/>
<path d="${CUP_BODY}" fill="url(#${id}a)"/>
<g clip-path="url(#${id}c)"><rect x="-72" y="-26" width="144" height="82" fill="url(#${id}f)"/><ellipse cx="-34" cy="36" rx="36" ry="20" fill="#b98a55" opacity=".34" filter="url(#${id}s)"/></g>
<ellipse cx="0" cy="-21" rx="66" ry="35" fill="url(#${id}r)"/>
<ellipse cx="0" cy="-21" rx="58" ry="29.5" fill="url(#${id}k)"/>
<ellipse cx="0" cy="-21" rx="58" ry="29.5" fill="url(#${id}i)"/>
${rosetta(id)}
</g>
</svg>`
}
function cupOutline() {
  const id = 'co' + ++uid
  const P = `<path d="${CUP_OPEN}"/><ellipse cx="0" cy="-21" rx="66" ry="35"/><path d="M64 -14 C122 -30 122 36 60 33"/><path d="M64 -2 C106 -14 106 24 60 21"/>`
  return stitch('cup3d out', P, id, 4.2, 9, GROUP)
}

export const cupSVG = cup
export const cupOutlineSVG = cupOutline
