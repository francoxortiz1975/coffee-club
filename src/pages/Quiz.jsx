import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toPng } from 'html-to-image'
import {
  ArrowLeft, BookOpen, Check, Coffee, CoffeeBean, Compass, Flame, Heart, Laptop, Plant,
  ShareNetwork, Sparkle, UsersThree,
} from '@phosphor-icons/react'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/geist'
import '@fontsource/parisienne/latin-400.css'
import './landing.css'
import './quiz.css'
import { quizCopy, HOODS, RATE } from '../lib/quizCopy'
import { useLandingLang } from '../lib/useLandingLang'
import { joinWaitlist } from '../lib/waitlist'
import LoopVideo from '../components/LoopVideo'

const STEPS = ['intro', 'looking', 'mood', 'level', 'pace', 'hoods', 'building', 'profile', 'join', 'done']
const QUESTIONS = ['looking', 'mood', 'level', 'pace', 'hoods']
const WAITLIST_KEY = 'samay_waitlist_email'
const ICONS = {
  new: Compass, learn: BookOpen, rewards: CoffeeBean,
  work: Laptop, date: Heart, friends: UsersThree, solo: BookOpen,
  start: Plant, getting: Coffee, know: Flame, specialty: Sparkle,
}

const toggle = (list, v, max = 99) => (list.includes(v) ? list.filter((x) => x !== v) : list.length < max ? [...list, v] : list)

function pickArchetype(sel) {
  const has = (k, v) => sel[k].includes(v)
  const score = {
    remote: has('mood', 'work') ? 3 : 0,
    romantic: has('mood', 'date') ? 3 : 0,
    social: has('mood', 'friends') ? 3 : 0,
    quiet: has('mood', 'solo') ? 3 : 0,
    explorer: has('look', 'new') ? 3 : 0,
    connoisseur: (has('look', 'learn') ? 2 : 0) + (sel.level === 'know' ? 2 : sel.level === 'specialty' ? 3 : 0),
    collector: (has('look', 'rewards') ? 3 : 0) + (sel.freq === 'high' ? 1 : 0),
  }
  let best = 'taster', top = 0
  for (const k of ['remote', 'romantic', 'social', 'quiet', 'explorer', 'connoisseur', 'collector']) {
    if (score[k] > top) { top = score[k]; best = k }
  }
  return best
}

function BeanBoard({ label }) {
  return (
    <div className="board" role="img" aria-label={label}>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <mask id="sq-bean-mask">
            <g transform="rotate(-30 12 12)">
              <ellipse cx="12" cy="12" rx="6.5" ry="9.5" fill="white" />
              <path d="M12 3 Q14.5 7 14.5 12 Q14.5 17 12 21" stroke="black" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </g>
          </mask>
        </defs>
      </svg>
      <div className="slots">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`slot${i === 0 ? ' on' : ''}${i === 9 ? ' cup' : ''}`}>
            {i === 9 ? <Coffee size={22} weight="regular" aria-hidden="true" /> : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" fill="currentColor" mask="url(#sq-bean-mask)" /></svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Tile({ id, pressed, onClick, label, hint }) {
  const Icon = ICONS[id]
  return (
    <button type="button" className="tile" aria-pressed={pressed} onClick={onClick}>
      <span className="ic">{Icon && <Icon size={26} aria-hidden="true" />}</span>
      <span><span className="t">{label}</span><span className="s">{hint}</span></span>
      <span className="chk"><Check size={14} weight="bold" aria-hidden="true" /></span>
    </button>
  )
}

export default function Quiz() {
  const [lang] = useLandingLang()
  const t = quizCopy[lang]
  const [step, setStep] = useState('intro')
  const [back, setBack] = useState(false)
  const [sel, setSel] = useState({ look: [], mood: [], level: null, freq: null, hoods: [] })
  const [tab, setTab] = useState(0)
  const [auto, setAuto] = useState(true)
  const [checked, setChecked] = useState(0)
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState('')
  const [logoData, setLogoData] = useState('')
  const cardRef = useRef(null)
  const headingRef = useRef(null)
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  const index = STEPS.indexOf(step)
  const archetypeKey = pickArchetype(sel)
  const [archName, archLine] = t.profile.archetypes[archetypeKey]
  const profileData = { archetype: archetypeKey, look: sel.look, mood: sel.mood, level: sel.level, freq: sel.freq, hoods: sel.hoods, lang }

  function go(id, isBack = false) {
    if (id === 'building') setChecked(0)
    setBack(isBack)
    setStep(id)
  }
  const next = () => go(STEPS[Math.min(index + 1, STEPS.length - 1)])
  // "atrás" desde el perfil salta la pantalla de espera
  const prev = () => go(step === 'profile' ? 'hoods' : STEPS[Math.max(index - 1, 0)], true)

  useEffect(() => {
    document.title = t.docTitle
    document.documentElement.lang = lang
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.metaDescription)
  }, [t, lang])

  // el fondo del body queda a la vista en el overscroll
  useEffect(() => {
    document.body.style.backgroundColor = '#1e0f0b'
    return () => { document.body.style.backgroundColor = '' }
  }, [])

  // foco al título al cambiar de pantalla (lectores de pantalla y teclado)
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }) }, [step])

  // intro: las tres pestañas rotan solas hasta que la persona elige una
  useEffect(() => {
    if (step !== 'intro' || !auto || reduce) return undefined
    const id = setInterval(() => setTab((n) => (n + 1) % 3), 5500)
    return () => clearInterval(id)
  }, [step, auto, reduce])

  // pausa breve que muestra el trabajo, luego pasa solo al perfil
  useEffect(() => {
    if (step !== 'building') return undefined
    const gap = reduce ? 150 : 650
    const timers = [1, 2, 3].map((n) => setTimeout(() => setChecked(n), gap * n))
    timers.push(setTimeout(() => { setBack(false); setStep('profile') }, gap * 4 + 250))
    return () => timers.forEach(clearTimeout)
  }, [step, reduce])

  // el logo como data URL para que la imagen compartible lo incluya
  useEffect(() => {
    fetch('/logo.png').then((r) => r.blob()).then((blob) => {
      const reader = new FileReader()
      reader.onload = () => setLogoData(String(reader.result))
      reader.readAsDataURL(blob)
    }).catch(() => {})
  }, [])

  function weeksText() {
    if (!sel.freq) return ''
    if (sel.freq === 'rare') return t.pace.weeks.rare
    const w = Math.max(1, Math.ceil(9 / RATE[sel.freq]))
    return w === 1 ? t.pace.weeks.one : t.pace.weeks.many.replace('{n}', w)
  }

  const tagList = [
    ...sel.look.map((v) => t.tags.look[v]),
    ...sel.mood.map((v) => t.tags.mood[v]),
    ...(sel.level ? [t.tags.level[sel.level]] : []),
    ...sel.hoods.map((v) => t.hoods.near.replace('{x}', v)),
  ].slice(-4)

  const shareUrl = `${window.location.origin}/quiz?ref=share&lang=${lang}`
  const shareText = t.shareText.replace('{name}', archName)

  function flash(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(`${shareText} ${shareUrl}`); flash(t.copied) } catch { /* sin portapapeles */ }
  }
  async function shareProfile() {
    try {
      if (cardRef.current) {
        const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
        const file = new File([await (await fetch(dataUrl)).blob()], 'sumay-coffee-profile.png', { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text: `${shareText} ${shareUrl}` })
          return
        }
      }
      if (navigator.share) { await navigator.share({ text: shareText, url: shareUrl }); return }
      await copyLink()
    } catch (e) {
      if (e?.name !== 'AbortError') await copyLink()
    }
  }
  async function invite() {
    try {
      if (navigator.share) { await navigator.share({ text: shareText, url: shareUrl }); return }
      await copyLink()
    } catch (e) {
      if (e?.name !== 'AbortError') await copyLink()
    }
  }

  async function submit(e) {
    e.preventDefault()
    setErr('')
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) { setErr(t.join.errInvalid); return }
    setSending(true)
    const res = await joinWaitlist({ email: clean, lang, profile: profileData })
    setSending(false)
    if (!res.ok) { setErr(t.join.errGeneric); console.error('waitlist error:', res.error); return }
    try {
      const saved = JSON.parse(localStorage.getItem(WAITLIST_KEY) || '[]')
      if (!saved.some((x) => x.email === clean)) saved.push({ email: clean, lang, profile: profileData, at: Date.now() })
      localStorage.setItem(WAITLIST_KEY, JSON.stringify(saved))
    } catch { /* localStorage bloqueado: el registro ya quedó guardado */ }
    go('done')
  }

  // ---------- pieces ----------
  const qNumber = QUESTIONS.indexOf(step) + 1
  const hasAnswer = { looking: sel.look.length, mood: sel.mood.length, level: sel.level ? 1 : 0, pace: sel.freq ? 1 : 0, hoods: sel.hoods.length }

  const top = (
    <div className="top">
      <button type="button" className="icon-btn" onClick={prev} aria-label={t.back}><ArrowLeft size={22} /></button>
      <div className="progress" role="progressbar" aria-valuemin={1} aria-valuemax={5} aria-valuenow={qNumber} aria-label={`${qNumber} / 5`}>
        {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= qNumber ? 'done' : ''} />)}
      </div>
      <button type="button" className="skip" onClick={next}>{t.skip}</button>
    </div>
  )
  const cta = (label) => (
    <button type="button" className={`cta${hasAnswer[step] ? '' : ' quiet'}`} onClick={next}>{hasAnswer[step] ? label : t.skipNow}</button>
  )
  const tuning = (
    <div className="tuning">
      <div className="lbl">{t.tuning.label}</div>
      <div className="row">{tagList.length ? tagList.map((x) => <span key={x} className="qtag">{x}</span>) : <span className="empty-note">{t.tuning.empty}</span>}</div>
    </div>
  )
  function tilesFor(group, key, single = false) {
    const opts = t[group].options
    return (
      <div className="tiles" role="group" aria-label={t[group].title}>
        {Object.entries(opts).map(([id, [label, hint]]) => {
          const pressed = single ? sel[key] === id : sel[key].includes(id)
          const onClick = () => setSel((s) => ({ ...s, [key]: single ? (s[key] === id ? null : id) : toggle(s[key], id) }))
          return <Tile key={id} id={id} pressed={pressed} onClick={onClick} label={label} hint={hint} />
        })}
      </div>
    )
  }

  // ---------- screens ----------
  let body

  if (step === 'intro') {
    body = (
      <section className="screen intro" key="intro">
        <div className="brandrow">
          <img src={logoData || '/logo.png'} alt="Sumay Coffee Club" />
        </div>
        <h1 ref={headingRef} tabIndex={-1}>{t.intro.title}<span className="hand big">{t.intro.hand}</span></h1>
        <p className="now">{t.intro.nowIn}</p>
        <div className="stage" role="tabpanel">
          {tab === 0 && <div className="phone" key="t0"><div className="scr"><LoopVideo src="/landing/app-swipe.mp4" poster="/landing/app-swipe-poster.webp" label={t.intro.alts[0]} /></div></div>}
          {tab === 1 && <BeanBoard key="t1" label={t.intro.alts[1]} />}
          {tab === 2 && <div className="phone" key="t2"><div className="scr"><LoopVideo src="/landing/app-invite.mp4" poster="/landing/app-invite-poster.webp" label={t.intro.alts[2]} /></div></div>}
        </div>
        <div className="tabs" role="tablist" aria-label="Sumay">
          {t.intro.tabs.map((label, i) => (
            <button key={label} type="button" role="tab" aria-selected={tab === i} onClick={() => { setTab(i); setAuto(false) }}>{label}</button>
          ))}
        </div>
        <p className="caption" aria-live="polite">{t.intro.captions[tab]}</p>
        <div className="actions">
          <button type="button" className="cta" onClick={next}>{t.intro.cta}</button>
          <span className="sub">{t.intro.sub}</span>
          <Link className="link" to="/landing">{t.intro.more}</Link>
        </div>
      </section>
    )
  } else if (step === 'looking') {
    body = (
      <section className="screen" key="looking" aria-labelledby="h">
        {top}
        <h2 id="h" className="title" ref={headingRef} tabIndex={-1}>{t.looking.title}</h2>
        <p className="lede">{t.looking.lede}</p>
        {tilesFor('looking', 'look')}
        {tuning}
        {cta(t.next)}
      </section>
    )
  } else if (step === 'mood') {
    body = (
      <section className="screen" key="mood" aria-labelledby="h">
        {top}
        <h2 id="h" className="title" ref={headingRef} tabIndex={-1}>{t.mood.title}</h2>
        <p className="lede">{t.mood.lede}</p>
        {tilesFor('mood', 'mood')}
        {tuning}
        {cta(t.next)}
      </section>
    )
  } else if (step === 'level') {
    body = (
      <section className="screen" key="level" aria-labelledby="h">
        {top}
        <h2 id="h" className="title" ref={headingRef} tabIndex={-1}>{t.level.title}</h2>
        <p className="lede">{t.level.lede}</p>
        {tilesFor('level', 'level', true)}
        {tuning}
        {cta(t.next)}
      </section>
    )
  } else if (step === 'pace') {
    body = (
      <section className="screen" key="pace" aria-labelledby="h">
        {top}
        <h2 id="h" className="title" ref={headingRef} tabIndex={-1}>{t.pace.title}</h2>
        <p className="lede">{t.pace.lede}</p>
        <div className="tiles" role="group" aria-label={t.pace.title}>
          {Object.entries(t.pace.options).map(([id, [label, hint]]) => (
            <button key={id} type="button" className="tile" aria-pressed={sel.freq === id} onClick={() => setSel((s) => ({ ...s, freq: s.freq === id ? null : id }))}>
              <span className="ic"><Coffee size={26} aria-hidden="true" /></span>
              <span><span className="t">{label}</span><span className="s">{hint}</span></span>
              <span className="chk"><Check size={14} weight="bold" aria-hidden="true" /></span>
            </button>
          ))}
        </div>
        <div className={`pace${sel.freq ? '' : ' idle'}`} aria-live="polite">
          <CoffeeBean size={30} aria-hidden="true" color="#b8d04a" />
          {sel.freq
            ? <div><div className="p1">{t.pace.result.replace('{w}', weeksText())}</div><div className="p2">{t.pace.resultSub}</div></div>
            : <span>{t.pace.idle}</span>}
        </div>
        {cta(t.next)}
      </section>
    )
  } else if (step === 'hoods') {
    body = (
      <section className="screen" key="hoods" aria-labelledby="h">
        {top}
        <h2 id="h" className="title" ref={headingRef} tabIndex={-1}>{t.hoods.title}</h2>
        <p className="lede">{t.hoods.lede}</p>
        <div className="chips" role="group" aria-label={t.hoods.title}>
          {HOODS.map((h) => (
            <button key={h} type="button" className="chip" aria-pressed={sel.hoods.includes(h)} onClick={() => setSel((s) => ({ ...s, hoods: toggle(s.hoods, h, 3) }))}>{h}</button>
          ))}
        </div>
        {tuning}
        {cta(t.hoods.cta)}
      </section>
    )
  } else if (step === 'building') {
    body = (
      <section className="screen building" key="building" aria-live="polite">
        <h2 ref={headingRef} tabIndex={-1}>{t.building.title} <span className="hand" style={{ fontSize: '1.2em' }}>{t.building.hand}</span></h2>
        <ul className="checks">
          {t.building.checks.map((label, i) => (
            <li key={label} className={checked > i ? 'ok' : ''}><span className="dot"><Check size={14} weight="bold" aria-hidden="true" /></span><span>{label}</span></li>
          ))}
        </ul>
      </section>
    )
  } else if (step === 'profile') {
    const rows = []
    if (sel.look.length) rows.push([Compass, t.profile.traits.look, sel.look.map((v) => t.tags.look[v]).join(', ')])
    if (sel.mood.length) rows.push([Laptop, t.profile.traits.mood, sel.mood.map((v) => t.tags.mood[v]).join(', ')])
    if (sel.level) rows.push([Flame, t.profile.traits.level, t.levelLabel[sel.level]])
    if (sel.freq) rows.push([Coffee, t.profile.traits.pace, t.freqLabel[sel.freq]])
    body = (
      <section className="screen" key="profile">
        <div className="top">
          <button type="button" className="icon-btn" onClick={prev} aria-label={t.back}><ArrowLeft size={22} /></button>
          <span style={{ flex: 1 }} />
        </div>
        <h2 className="title" ref={headingRef} tabIndex={-1} style={{ marginBottom: 14 }}>{t.profile.title}</h2>
        <div className="pcard" ref={cardRef}>
          <div className="kicker"><img src={logoData || '/logo.png'} alt="Sumay" /><span>{t.profile.kicker}</span></div>
          <div className="arch">{archName}</div>
          <p className="line">{archLine}</p>
          {rows.length > 0 && (
            <ul className="traits">
              {rows.map(([Icon, k, v]) => <li key={k}><Icon size={20} aria-hidden="true" /><span><b>{k}</b>&nbsp; {v}</span></li>)}
            </ul>
          )}
          <div className="url">sumayclub.app</div>
        </div>
        <div className="stack">
          <button type="button" className="cta quiet" onClick={shareProfile}><ShareNetwork size={20} aria-hidden="true" /> {t.profile.share}</button>
          <button type="button" className="cta" onClick={next}>{t.profile.cta}</button>
        </div>
      </section>
    )
  } else if (step === 'join') {
    body = (
      <section className="screen" key="join">
        <div className="top">
          <button type="button" className="icon-btn" onClick={prev} aria-label={t.back}><ArrowLeft size={22} /></button>
          <span style={{ flex: 1 }} />
        </div>
        <h2 className="title" ref={headingRef} tabIndex={-1}>{t.join.title}</h2>
        <p className="lede">{t.join.lede}</p>
        <div className="teaser">
          <BeanBoard label={t.intro.alts[1]} />
          <p className="fine">{t.join.teaser}</p>
        </div>
        <form onSubmit={submit} noValidate style={{ display: 'contents' }}>
          <div className="field">
            <label htmlFor="sq-email">{t.join.email}</label>
            <input id="sq-email" name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.join.placeholder} />
            <div className="err" role="alert">{err}</div>
          </div>
          <div className="stack">
            <button type="submit" className="cta" disabled={sending}>{sending ? t.join.sending : t.join.submit}</button>
            <p className="fine" style={{ textAlign: 'center' }}>{t.join.fine} <Link to="/privacy" style={{ textDecoration: 'underline' }}>{t.join.privacy}</Link></p>
          </div>
        </form>
      </section>
    )
  } else {
    body = (
      <section className="screen" key="done">
        <div className="brandrow">
          <img src={logoData || '/logo.png'} alt="Sumay" />
        </div>
        <div style={{ flex: 1 }} />
        <h2 className="title" ref={headingRef} tabIndex={-1} style={{ marginBottom: 0 }}>{t.done.title}</h2>
        <p className="bigdone">{t.done.hand}</p>
        <p className="lede">{t.done.body}</p>
        <div style={{ flex: 1 }} />
        <div className="stack" style={{ marginTop: 0 }}>
          <button type="button" className="cta" onClick={invite}><UsersThree size={20} aria-hidden="true" /> {t.done.invite}</button>
          <button type="button" className="cta quiet" onClick={shareProfile}><ShareNetwork size={20} aria-hidden="true" /> {t.done.share}</button>
        </div>
        <div className="legal">
          <Link className="link" to="/landing">{t.done.story}</Link>
          <Link className="link" to="/privacy">{t.done.privacy}</Link>
        </div>
      </section>
    )
  }

  return (
    <div className="sl sq">
      <main className={`frame${back ? ' back' : ''}`}>
        {body}
        {toast && <div className="toast" role="status">{toast}</div>}
      </main>
    </div>
  )
}
