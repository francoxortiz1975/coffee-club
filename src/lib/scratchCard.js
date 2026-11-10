import { beanSVG, cupSVG, cupOutlineSVG } from './beanArt'
import { wax, letters } from './crayon'
import { paintFoil } from './foil'
import { startSteam } from './steam'

/* The loyalty card demo on the landing: scratch today's box, the bean flies into the card, ten beans make a cup.
   Plain DOM + canvas on purpose (pointer events, WAAPI), mounted once by <ScratchCard />.
   opts: { copy, startAt, onJoin }. Returns { destroy, setCopy }. */
export function mountScratchCard(root, opts = {}) {
  let copy = opts.copy
  const startAt = opts.startAt ?? 7
  const host = root.closest('.sl') || document.body
  const ac = new AbortController()
  const sig = { signal: ac.signal }
  let dead = false
  const $ = (s, el = root) => el.querySelector(s)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const rand = (a, b) => a + Math.random() * (b - a)
  const buzz = (() => { let t = 0; return (p) => { const n = performance.now(); if (n - t > 70) { t = n; navigator.vibrate && navigator.vibrate(p) } } })()


  const newBean = () => ({ kind: 'bean', seed: 1 + Math.floor(Math.random() * 9000), angle: rand(-58, 58) })
  const faceHTML = (m) => (m.kind === 'cup' ? cupSVG() : beanSVG(m.seed, m.angle))

  const state = { done: 0, busy: false, marks: [], plan: [], landing: -1 }
  const slotsEl = $('.sc-slots'), wrap = $('.sc-padwrap'), caption = $('.sc-caption'), countEl = $('.sc-count'), altBtn = $('.sc-alt')
  let current = null

  /* ---------- the card ---------- */
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('div')
    s.className = 'sc-slot' + (i === 9 ? ' cup' : '')
    slotsEl.appendChild(s)
  }
  function renderSlot(i) {
    const s = slotsEl.children[i], m = state.landing === i ? null : state.marks[i]
    s.style.setProperty('--gd', (i * 0.17).toFixed(2) + 's')
    s.style.setProperty('--td', ((i * 1.37) % 7).toFixed(2) + 's')
    s.classList.toggle('on', !!m)
    const p = state.plan[i]
    s.innerHTML = m ? faceHTML(m) : !p ? '' : i === 9 ? cupOutlineSVG() : beanSVG(p.seed, p.angle, { outline: true })
  }
  const countText = (d) => (d <= 0 ? copy.c0 : d === 1 ? copy.c1 : d === 9 ? copy.c9 : d >= 10 ? copy.c10 : copy.cN.replace('{n}', d).replace('{r}', 10 - d))
  function renderCard() {
    if (dead) return
    for (let i = 0; i < 10; i++) {
      renderSlot(i)
      slotsEl.children[i].classList.toggle('next', i === state.done)
    }
    const d = state.done
    paintCount(countText(d))
  }


  /* the counter under the card, written in crayon like the foil label */
  let countMsg = ''
  function paintCount(msg) {
    countMsg = msg
    if (!countEl.firstChild) countEl.innerHTML = '<span class="sc-sr" aria-live="polite"></span><canvas aria-hidden="true"></canvas>'
    countEl.firstChild.textContent = msg
    const cv = countEl.querySelector('canvas'), W = Math.round(countEl.getBoundingClientRect().width) || 360, H = 46
    const ctx = sizeCanvas(cv, W, H)
    ctx.clearRect(0, 0, W, H)
    const fam = '"Finger Paint"'
    let size = 26
    ctx.font = `${size}px ${fam}`
    const w0 = ctx.measureText(msg).width
    if (w0 > W - 14) size *= (W - 14) / w0
    ctx.font = `${size}px ${fam}`
    const tw = ctx.measureText(msg).width
    const draw = (m) => { m.fillStyle = m.strokeStyle = '#000'; letters(m, msg, 6 + tw / 2, H / 2 + 1, size, fam, { jitter: 0.8, rot: -0.012, lw: 0.04 }) }
    const hi = wax(W, H, dpr, draw, { color: '#f4dfb2', bite: 0.34, seed: 77 })
    const lo = wax(W, H, dpr, draw, { color: '#2b1509', bite: 0.3, seed: 31 })
    ctx.globalAlpha = 0.7; ctx.drawImage(hi, 1.2, 1.6, W, H); ctx.globalAlpha = 1; ctx.drawImage(lo, 0, 0, W, H)
  }
  addEventListener('resize', () => countMsg && paintCount(countMsg), sig)

  /* ---------- helpers ---------- */
  function coverage(w, h, n = 14) {
    const cells = new Uint8Array(n * n); let count = 0
    return {
      add(x, y, r) {
        const cw = w / n, ch = h / n
        const x0 = Math.max(0, Math.floor((x - r) / cw)), x1 = Math.min(n - 1, Math.floor((x + r) / cw))
        const y0 = Math.max(0, Math.floor((y - r) / ch)), y1 = Math.min(n - 1, Math.floor((y + r) / ch))
        for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) {
          const k = j * n + i
          if (!cells[k] && Math.hypot((i + 0.5) * cw - x, (j + 0.5) * ch - y) < r * 0.9) { cells[k] = 1; count++ }
        }
      },
      get ratio() { return count / (n * n) },
    }
  }
  function sizeCanvas(c, w, h) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); return x }
  function local(pad, e) { const r = pad.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height } }

  /* ---------- dust (foil shavings) ---------- */
  const dust = document.createElement('canvas'); dust.className = 'sc-dust'; dust.setAttribute('aria-hidden', 'true'); host.appendChild(dust)
  const dctx = dust.getContext('2d'); let parts = [], raf = 0
  function fitDust() { dust.width = innerWidth * dpr; dust.height = innerHeight * dpr; dctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
  fitDust(); addEventListener('resize', fitDust, sig)
  function emit(x, y, n) {
    if (reduce) return
    for (let i = 0; i < n && parts.length < 160; i++) parts.push({ x: x + rand(-10, 10), y: y + rand(-10, 10), vx: rand(-1.2, 1.2), vy: rand(-2, 0.2), s: rand(1.5, 3.6), life: rand(34, 62), c: ['#b58a57', '#d2a972', '#8a6234'][i % 3] })
    if (!raf) raf = requestAnimationFrame(tickDust)
  }
  function tickDust() {
    dctx.clearRect(0, 0, innerWidth, innerHeight)
    parts = parts.filter((p) => p.life-- > 0)
    for (const p of parts) { p.vy += 0.3; p.x += p.vx; p.y += p.vy; dctx.globalAlpha = Math.min(1, p.life / 24); dctx.fillStyle = p.c; dctx.fillRect(p.x, p.y, p.s, p.s) }
    dctx.globalAlpha = 1
    raf = parts.length ? requestAnimationFrame(tickDust) : 0
    if (!raf) dctx.clearRect(0, 0, innerWidth, innerHeight)
  }

  /* ---------- the box of the day ---------- */
  function newPad() {
    if (dead) return
    wrap.innerHTML = ''
    if (state.done >= 10) { showDone(); return }
    const isCup = state.done === 9
    const spec = state.plan[state.done]
    const pad = document.createElement('div')
    pad.className = 'sc-pad' + (reduce ? '' : ' sc-in')
    pad.tabIndex = 0
    pad.setAttribute('role', 'button')
    pad.setAttribute('aria-label', isCup ? copy.padCup : copy.padBean)
    wrap.appendChild(pad)
    caption.textContent = isCup ? copy.capCup : copy.capBean
    altBtn.hidden = false
    current = scratchPad(pad, spec, isCup)
    pad.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); current.complete() } })
    pad.addEventListener('contextmenu', (e) => e.preventDefault())
    renderCard()
  }

  function showDone() {
    if (dead) return
    altBtn.hidden = true; caption.textContent = ''
    wrap.style.aspectRatio = 'auto'
    wrap.innerHTML = `<div class="sc-done"><div class="sc-bigcup">${cupSVG()}</div><p class="sc-done-title"></p><div class="sc-done-actions"><button class="btn btn-primary" type="button" data-join></button><button class="sc-again" type="button" data-again></button></div></div>`
    $('.sc-done-title', wrap).textContent = copy.doneTitle
    $('[data-join]', wrap).textContent = copy.join
    $('[data-again]', wrap).textContent = copy.again
    startSteam($('.sc-bigcup', wrap), $('.sc-bigcup svg', wrap), { dx: -0.07, ey: 0.37, up: 90 })
    if (!reduce) $('.sc-bigcup svg', wrap).animate([{ transform: 'scale(.7) rotate(-6deg)', opacity: 0 }, { transform: 'scale(1.08) rotate(2deg)', opacity: 1, offset: 0.6 }, { transform: 'none', opacity: 1 }], { duration: 700, easing: 'cubic-bezier(0.3,1.2,0.4,1)' })
    $('[data-join]', wrap).onclick = () => opts.onJoin?.()
    $('[data-again]', wrap).onclick = () => reset(startAt)
  }
  /* ----- scratch ----- */
  function scratchPad(pad, spec, isCup) {
    pad.innerHTML = `<div class="sc-under ${isCup ? 'sc-cupbox' : ''}">${faceHTML(spec)}</div><canvas class="sc-foil"></canvas>`
    const canvas = $('canvas', pad), under = $('.sc-under', pad), r0 = pad.getBoundingClientRect()
    const ctx = sizeCanvas(canvas, r0.width, r0.height)
    const W = r0.width, H = r0.height
    paintFoil(ctx, W, H, dpr, { lines: isCup ? copy.foilCup : copy.foilBean, family: '"Finger Paint"', radius: 28 })
    ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 40

    const cov = coverage(W, H)
    let drawing = false, last = null, finished = false
    pad.addEventListener('pointerdown', (e) => {
      if (state.busy || finished) return
      pad.setPointerCapture(e.pointerId); drawing = true
      const p = local(pad, e); last = { x: p.x, y: p.y }
      ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, 7); ctx.fill(); cov.add(p.x, p.y, 20)
      emit(e.clientX, e.clientY, 4); buzz(6)
    })
    pad.addEventListener('pointermove', (e) => {
      if (!drawing || finished) return
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]
      for (const ev of (evs.length ? evs : [e])) {
        const p = local(pad, ev)
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke()
        const d = Math.hypot(p.x - last.x, p.y - last.y), steps = Math.max(1, Math.ceil(d / 8))
        for (let i = 0; i <= steps; i++) cov.add(last.x + ((p.x - last.x) * i) / steps, last.y + ((p.y - last.y) * i) / steps, 20)
        last = p
        emit(ev.clientX, ev.clientY, d > 3 ? 2 : 0)
      }
      buzz(4)
      if (cov.ratio >= 0.5) finish()
    })
    const up = () => { drawing = false }
    pad.addEventListener('pointerup', up); pad.addEventListener('pointercancel', up)

    async function finish() {
      if (finished || state.busy) return
      finished = true; state.busy = true; altBtn.hidden = true
      canvas.style.transition = reduce ? 'none' : 'opacity 0.32s ease'; canvas.style.opacity = 0
      buzz([10, 30, 16])
      const svg = under.lastElementChild
      if (!reduce) {
        // it pops out of the foil: squash, stretch, settle
        svg.animate([
          { transform: 'scale(1)' },
          { transform: 'scale(1.16, 0.86)', offset: 0.3 },
          { transform: 'scale(0.94, 1.1)', offset: 0.55 },
          { transform: 'scale(1.03, 0.98)', offset: 0.78 },
          { transform: 'scale(1)' },
        ], { duration: 640, easing: 'ease-out' })
        if (isCup) startSteam(under, svg, { dx: -0.07, ey: 0.37 })
        await sleep(isCup ? 2600 : 820)
      }
      await fly(pad, spec)
    }
    return { complete: finish }
  }

  /* ----- flight into the slot: only the bean travels, the box lets go ----- */
  async function fly(pad, spec) {
    if (dead) return
    const i = state.done, slot = slotsEl.children[i]
    const face = [...$('.sc-under', pad).querySelectorAll('svg')].pop()         // the bean (or cup) itself
    const fr = face.getBoundingClientRect(), sr = slot.getBoundingClientRect()
    const isCup = spec.kind === 'cup'
    const ghost = document.createElement('div')
    ghost.className = 'sc-ghost' + (isCup ? ' cup' : '')
    ghost.innerHTML = faceHTML(spec)
    Object.assign(ghost.style, { left: fr.left + 'px', top: fr.top + 'px', width: fr.width + 'px', height: fr.height + 'px' })
    host.appendChild(ghost)
    face.style.visibility = 'hidden'
    state.landing = i; state.marks[i] = spec; state.done++
    if (reduce) pad.remove()
    else pad.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.94)' }], { duration: 260, easing: 'ease-in', fill: 'forwards' })
    const hold = state.done < 10
    if (hold) setTimeout(() => { newPad(); state.busy = false }, reduce ? 0 : 320)   // the next box comes in while this bean travels
    if (!reduce) {
      const cupK = 1.44, cupShift = [-0.03, -0.05]   // the earned cup sits bigger than a bean
      const dx = sr.left + sr.width / 2 - (fr.left + fr.width / 2) + (isCup ? cupShift[0] * cupK * sr.width : 0), dy = sr.top + sr.height / 2 - (fr.top + fr.height / 2) + (isCup ? cupShift[1] * cupK * sr.width : 0)
      const sc = (sr.width * (isCup ? cupK : 0.88)) / fr.width
      if (!isCup) $('svg', ghost).animate([{ filter: 'drop-shadow(6px 8px 6px rgba(0,0,0,0.55))' }, { filter: 'drop-shadow(0px 22px 14px rgba(0,0,0,0.4))', offset: 0.45 }, { filter: 'drop-shadow(1px 3px 2px rgba(10,4,0,0.6))' }], { duration: 640, easing: 'ease-in-out', fill: 'forwards' })
      await ghost.animate([
        { transform: 'none' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 44}px) scale(${((1 + sc) / 2) * 1.1})`, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(${sc})` },
      ], { duration: 640, easing: 'cubic-bezier(0.45, 0, 0.2, 1)', fill: 'forwards' }).finished
    }
    ghost.remove()
    if (dead) return
    state.landing = -1
    renderCard()
    if (!reduce) {
      // lands with a little weight: the icon squashes, then settles
      const ic = [...slot.querySelectorAll('svg')].pop()
      if (ic) ic.animate([{ transform: 'scale(1.12, 0.88)' }, { transform: 'scale(0.96, 1.05)', offset: 0.5 }, { transform: 'none' }], { duration: 380, easing: 'ease-out' })
    }
    if (!hold) { state.busy = false; newPad() }
  }

  /* ---------- play with the beans: hover (or tap) a collected bean and it turns 60 degrees and settles back ---------- */
  function spinSlot(slot) {
    if (reduce || slot.dataset.busy) return
    const ic = [...slot.querySelectorAll('svg')].pop()
    if (!ic || ic.classList.contains('out')) return
    slot.dataset.busy = '1'
    const isCup = slot.classList.contains('cup')
    const frames = isCup
      ? [{ transform: 'translateY(0) rotate(0)' }, { transform: 'translateY(-10px) rotate(-7deg)', offset: 0.35 }, { transform: 'translateY(0) rotate(4deg)', offset: 0.65 }, { transform: 'none' }]
      : [{ transform: 'rotate(0deg) scale(1)', filter: 'drop-shadow(1px 3px 2px rgba(10,4,0,0.6))' }, { transform: 'rotate(60deg) scale(1.16)', filter: 'drop-shadow(0px 11px 7px rgba(10,4,0,0.4))', offset: 0.42 }, { transform: 'rotate(-7deg) scale(1.03)', filter: 'drop-shadow(1px 4px 3px rgba(10,4,0,0.55))', offset: 0.74 }, { transform: 'rotate(0deg) scale(1)', filter: 'drop-shadow(1px 3px 2px rgba(10,4,0,0.6))' }]
    const a = ic.animate(frames, { duration: isCup ? 560 : 640, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' })
    a.finished.then(() => { delete slot.dataset.busy }, () => { delete slot.dataset.busy })
  }
  slotsEl.addEventListener('pointerover', (e) => { const s = e.target.closest('.sc-slot.on'); if (s && !s.contains(e.relatedTarget)) spinSlot(s) }, sig)
  slotsEl.addEventListener('click', (e) => { const s = e.target.closest('.sc-slot.on'); if (s) spinSlot(s) }, sig)

  /* ---------- controls ---------- */
  function reset(done) {
    state.plan = Array.from({ length: 10 }, (_, i) => (i === 9 ? { kind: 'cup' } : newBean()))
    state.done = done; state.marks = []
    for (let i = 0; i < done; i++) state.marks[i] = state.plan[i]
    state.busy = false; wrap.style.aspectRatio = ''
    newPad()
  }
  altBtn.onclick = () => { if (!state.busy && current) current.complete() }

  function setCopy(c) {
    if (dead || c === copy) return
    copy = c
    if (countMsg) paintCount(countText(state.done))
    if (state.busy) return
    if (state.done >= 10) showDone()
    else newPad()
  }
  function destroy() {
    dead = true
    ac.abort()
    cancelAnimationFrame(raf)
    dust.remove()
    host.querySelectorAll('.sc-ghost').forEach((g) => g.remove())
    wrap.innerHTML = ''; slotsEl.innerHTML = ''; countEl.innerHTML = ''; caption.textContent = ''
  }

  reset(startAt)
  return { destroy, setCopy }
}
