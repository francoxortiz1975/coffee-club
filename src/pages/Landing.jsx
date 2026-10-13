import { useEffect, useRef, useState } from 'react'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/geist'
import '@fontsource/gwendolyn/latin-400.css'
import './landing.css'
import cafes from '../data/cafes.json'
import InAppBrowserBanner from '../components/InAppBrowserBanner'
import { supabase } from '../lib/supabase'
import { copy, LANGS } from '../lib/landingCopy'
import { useLandingLang } from '../lib/useLandingLang'

const WAITLIST_KEY = 'samay_waitlist_email'
const THEME_KEY = 'sumay_theme'

const FEATURED = [
  { id: 'republica-del-cacao', photo: '/images/republica-del-cacao/place.jpg', big: true },
  { id: 'coffee-factory', photo: '/images/coffee-factory/cover.jpg' },
  { id: 'quito-deli', photo: '/images/quito-deli/place.jpg' },
]
const BEANS_COLLECTED = 7
const BEANS_TOTAL = 10

// Scroll suave sin agregar #hash a la URL (el webview de Instagram no parsea bien el #).
function scrollToId(id) {
  return (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY)
      return saved === 'dark' || saved === 'light' ? saved : null
    } catch {
      return null
    }
  })
  const choose = (next) => {
    setTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // sin persistencia, el cambio igual aplica en esta sesión.
    }
  }
  return [theme, choose]
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal, .collect') ?? []
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          io.unobserve(entry.target)
        }
      }),
      { threshold: 0.18 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}

// Reproduce solo mientras se ve; respeta prefers-reduced-motion mostrando el poster.
function LoopVideo({ src, poster, label }) {
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

function Phone({ className = '', children }) {
  return (
    <div className={`phone ${className}`}>
      <div className="screen">{children}</div>
    </div>
  )
}

function BeanDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <mask id="sl-bean-mask">
          <g transform="rotate(-30 12 12)">
            <ellipse cx="12" cy="12" rx="6.5" ry="9.5" fill="white" />
            <path d="M12 3 Q14.5 7 14.5 12 Q14.5 17 12 21" stroke="black" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          </g>
        </mask>
      </defs>
    </svg>
  )
}

function Bean() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" fill="currentColor" mask="url(#sl-bean-mask)" />
    </svg>
  )
}

// Taza de madera de la colección (misma paleta que CoffeeMugIcon), con vapor y arte en la crema.
function Cup() {
  return (
    <svg viewBox="0 0 120 124" aria-hidden="true">
      <defs>
        <linearGradient id="sl-cup-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bd8049" />
          <stop offset="1" stopColor="#7a4a23" />
        </linearGradient>
      </defs>
      <g className="steam" fill="none" stroke="#a98660" strokeWidth="3.2" strokeLinecap="round">
        <path d="M40 34 C34 27 46 22 40 13" />
        <path d="M58 32 C52 24 64 19 58 8" />
        <path d="M76 34 C70 27 82 22 76 13" />
      </g>
      <ellipse cx="58" cy="108" rx="46" ry="9" fill="#d9c3a0" />
      <ellipse cx="58" cy="106" rx="40" ry="6.5" fill="#e8d6b6" />
      <path d="M90 56 C112 52 114 84 90 88" fill="none" stroke="#8b5a2b" strokeWidth="8.5" strokeLinecap="round" />
      <path d="M91 58 C108 56 109 80 91 84" fill="none" stroke="#b98550" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 48 H96 V74 C96 94 80 104 58 104 C36 104 20 94 20 74 Z" fill="url(#sl-cup-wood)" />
      <path d="M31 62 C42 66 62 59 84 66 M27 76 C42 82 72 76 90 83 M36 91 C50 95 66 93 82 95" fill="none" stroke="#4a2a0f" strokeOpacity="0.28" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="58" cy="48" rx="38" ry="10" fill="#f6ead5" stroke="#d6bd96" />
      <ellipse cx="58" cy="49" rx="33" ry="7.6" fill="#3a1f10" />
      <ellipse cx="58" cy="49" rx="27" ry="5.7" fill="#cf9a68" />
      <path d="M58 53 C51 49 51 44.6 54.4 44.6 C56.4 44.6 58 46.4 58 46.4 C58 46.4 59.6 44.6 61.6 44.6 C65 44.6 65 49 58 53 Z" fill="#f8eddb" />
      <ellipse cx="38" cy="46.5" rx="5" ry="1.2" fill="#fff" opacity="0.5" />
    </svg>
  )
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="seg" role="group" aria-label="Language">
      {LANGS.map((code) => (
        <button key={code} type="button" onClick={() => setLang(code)} aria-pressed={lang === code}>
          {code}
        </button>
      ))}
    </div>
  )
}

function ThemeToggle({ t, effective, onChoose }) {
  return (
    <div className="seg" role="group" aria-label={t.theme}>
      {['dark', 'light'].map((mode) => (
        <button key={mode} type="button" onClick={() => onChoose(mode)} aria-pressed={effective === mode}>
          {t[mode]}
        </button>
      ))}
    </div>
  )
}

function WaitlistForm({ t, lang }) {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    const limpio = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
      setError(t.errorInvalid)
      return
    }

    setEnviando(true)
    // Idioma y ciudad viajan en `source` (landing:<lang>:<ciudad>) para no
    // depender de columnas nuevas en la tabla waitlist.
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: limpio,
        mensaje: mensaje.trim() || null,
        user_agent: navigator.userAgent.slice(0, 500),
        source: `landing:${lang}:${ciudad || 'na'}`,
      })
    setEnviando(false)

    if (insertError) {
      // 23505 = unique_violation (email duplicado). Tratarlo como éxito.
      if (insertError.code === '23505') {
        setEnviado(true)
        return
      }
      setError(t.errorGeneric)
      console.error('waitlist insert error:', insertError)
      return
    }

    // Backup local también, por si limpia datos.
    try {
      const existentes = JSON.parse(localStorage.getItem(WAITLIST_KEY) || '[]')
      if (!existentes.some((item) => item.email === limpio)) {
        existentes.push({ email: limpio, mensaje: mensaje.trim(), lang, ciudad, at: Date.now() })
      }
      localStorage.setItem(WAITLIST_KEY, JSON.stringify(existentes))
    } catch {
      // localStorage bloqueado: el registro ya quedó en Supabase.
    }
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="success" role="status">
        <strong>{t.successTitle}</strong>
        {t.successBody}
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="sl-email">{t.email}</label>
        <input
          id="sl-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="sl-city">{t.city}</label>
        <select id="sl-city" value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
          <option value="">{t.cityNone}</option>
          {Object.entries(t.cities).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="sl-message">{t.message}</label>
        <textarea id="sl-message" value={mensaje} onChange={(e) => setMensaje(e.target.value)} maxLength={400} />
        <span className="help">{t.messageHelp}</span>
      </div>
      <button className="btn btn-dark" type="submit" disabled={enviando}>
        {enviando ? t.submitting : t.submit}
      </button>
      {error && <p className="error" role="alert">{error}</p>}
      <p className="terms">{t.terms}</p>
    </form>
  )
}

export default function Landing() {
  const [lang, setLang] = useLandingLang()
  const [theme, chooseTheme] = useTheme()
  const t = copy[lang]
  const rootRef = useReveal()

  useEffect(() => {
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.metaDescription)
  }, [t])

  // El fondo del body queda a la vista en el overscroll: lo alineamos con el tema.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
    if (bg) document.body.style.backgroundColor = bg
    return () => { document.body.style.backgroundColor = '' }
  }, [theme, rootRef])

  const effectiveTheme = theme ?? 'dark'

  function addCafe(e) {
    scrollToId('waitlist')(e)
    setTimeout(() => document.getElementById('sl-message')?.focus({ preventScroll: true }), 600)
  }

  const cafe = (id) => cafes.find((c) => c.id === id)

  return (
    <div className="sl" data-theme={theme ?? undefined} ref={rootRef}>
      <InAppBrowserBanner t={t.inApp} />

      <nav className="nav" aria-label="Main">
        <div className="wrap nav-inner">
          <img className="logo" src="/logo.png" alt="Sumay Coffee Club" />
          <span className="tag">{t.betaTag}</span>
          <span className="spacer" />
          <LangToggle lang={lang} setLang={setLang} />
          <a className="btn btn-primary" href="/landing" onClick={scrollToId('waitlist')}>{t.navCta}</a>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>
              {t.heroTitle[0]} <span className="hand">{t.heroTitle[1]}</span>
            </h1>
            <p className="lead">{t.heroLead}</p>
            <div className="cta-row">
              <a className="btn btn-primary" href="/landing" onClick={scrollToId('waitlist')}>{t.heroCta}</a>
              <a className="link" href="/landing" onClick={scrollToId('how')}>{t.heroSecondary}</a>
            </div>
          </div>
          <div className="hero-visual">
            <figure className="hero-photo">
              <img src="/images/coffee-factory/food.jpg" alt={t.heroPhotoAlt} />
            </figure>
            <Phone className="hero-phone">
              <img src="/landing/app-discover.webp" alt={t.heroPhoneAlt} />
            </Phone>
          </div>
        </div>
      </header>

      <section className="statement">
        <div className="wrap">
          <p className="reveal">
            {t.statement.a}<span className="hl">{t.statement.hl1}</span>{t.statement.b}
            <span className="hl">{t.statement.hl2}</span>{t.statement.c}
          </p>
        </div>
      </section>

      <section className="how" id="how">
        <div className="wrap stack">
          <article className="panel panel-discover" style={{ '--i': 0 }}>
            <div className="panel-copy">
              <h2>{t.panels.discover.title}</h2>
              <p>{t.panels.discover.body}</p>
            </div>
            <div className="panel-visual">
              <div className="mosaic">
                <img src="/images/republica-del-cacao/food.jpg" alt="" loading="lazy" />
                <img src="/images/coffee-factory/place.jpg" alt="" loading="lazy" />
                <img src="/images/quito-deli/food.jpg" alt="" loading="lazy" />
              </div>
            </div>
          </article>

          <article className="panel panel-decide" style={{ '--i': 1 }}>
            <div className="panel-copy">
              <h2>{t.panels.decide.title}</h2>
              <p>{t.panels.decide.body}</p>
            </div>
            <div className="panel-visual">
              <Phone className="bleed-phone">
                <LoopVideo src="/landing/app-swipe.mp4" poster="/landing/app-swipe-poster.webp" label={t.panels.decide.alt} />
              </Phone>
            </div>
          </article>

          <article className="panel panel-invite" style={{ '--i': 2 }}>
            <div className="bg"><img src="/images/coffee-factory/place.jpg" alt="" loading="lazy" /></div>
            <div className="panel-copy">
              <h2>{t.panels.invite.title}</h2>
              <p>{t.panels.invite.body}</p>
            </div>
            <div className="panel-visual">
              <Phone className="bleed-phone">
                <img src="/landing/app-envelope.webp" alt={t.panels.invite.alt} loading="lazy" />
              </Phone>
            </div>
          </article>
        </div>
      </section>

      <section className="beans">
        <div className="wrap beans-grid">
          <div className="reveal">
            <h2>{t.beans.title}</h2>
            <p className="note">{t.beans.note}</p>
          </div>
          <div className="board">
            <div className="collect" role="img" aria-label={t.beans.label}>
              <BeanDefs />
              {Array.from({ length: BEANS_TOTAL }, (_, i) => (
                <div
                  key={i}
                  className={`token${i < BEANS_COLLECTED ? ' on' : ''}`}
                  style={{ '--n': i }}
                >
                  <Bean />
                </div>
              ))}
              <div className="cup-tile">
                <Cup />
                <span className="cap">{t.beans.cup}</span>
              </div>
            </div>
            <p className="count">{t.beans.count}</p>
          </div>
        </div>
      </section>

      <section className="cafes">
        <div className="wrap">
          <div className="cafes-head reveal">
            <span className="hand">{t.cafes.bornIn}</span>
            <h2>{t.cafes.title}</h2>
            <p>{t.cafes.body}</p>
            <a className="btn btn-primary" href="/landing" onClick={addCafe}>{t.cafes.cta}</a>
          </div>
          <div className="bento">
            {FEATURED.map(({ id, photo, big }, i) => {
              const data = cafe(id)
              return (
                <article key={id} className={`cafe${big ? ' big' : ''} reveal`} style={{ '--d': `${i * 100}ms` }}>
                  <div className="ph"><img src={photo} alt={t.cafes.alts[id]} loading="lazy" /></div>
                  <div>
                    <h3>{data.nombre}</h3>
                    <p className="meta">{data.barrio} · {data.precio}</p>
                    <p className="note">{t.cafes.notes[id]}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="invites">
        <div className="wrap invites-grid">
          <div className="reveal">
            <h2>{t.invites.titleA}<em>{t.invites.titleEm}</em></h2>
            <p>{t.invites.body}</p>
            <ul className="facts">
              {t.invites.facts.map((fact) => <li key={fact}>{fact}</li>)}
            </ul>
          </div>
          <Phone className="invite-phone reveal">
            <LoopVideo src="/landing/app-invite.mp4" poster="/landing/app-invite-poster.webp" label={t.invites.alt} />
          </Phone>
        </div>
      </section>

      <section className="waitlist" id="waitlist">
        <div className="wrap">
          <div className="wl-panel">
            <div>
              <h2>{t.waitlist.title}</h2>
              <p className="sub">{t.waitlist.sub}</p>
            </div>
            <WaitlistForm t={t.waitlist} lang={lang} />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-inner">
          <img className="logo" src="/logo.png" alt="Sumay" />
          <span className="made">{t.footer.made}</span>
          <span className="spacer" />
          <a className="link" href="mailto:hola@sumayclub.app">{t.footer.contact}</a>
          <ThemeToggle t={t.footer} effective={effectiveTheme} onChoose={chooseTheme} />
        </div>
      </footer>
    </div>
  )
}
