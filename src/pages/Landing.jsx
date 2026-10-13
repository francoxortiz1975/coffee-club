import { useEffect, useRef, useState } from 'react'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/geist'
import '@fontsource/parisienne/latin-400.css'
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

// Taza minimalista, mismo lenguaje plano que los beans: forma sólida de un solo color.
function Cup() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g className="steam" strokeWidth="1.5">
        <path d="M8.2 2.6c-.9 1 .9 1.9 0 3.1" />
        <path d="M12 2.2c-.9 1.1.9 2 0 3.5" />
        <path d="M15.8 2.6c-.9 1 .9 1.9 0 3.1" />
      </g>
      <path d="M4.5 9.2h12.2v4.4a5.3 5.3 0 0 1-5.3 5.3H9.8a5.3 5.3 0 0 1-5.3-5.3z" fill="currentColor" stroke="none" />
      <path d="M16.7 10.6h1.1a2.5 2.5 0 0 1 0 5h-1.7" />
      <path d="M3 21.1h15.6" strokeWidth="1.9" />
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
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="sl-city">{t.city}</label>
        <select id="sl-city" name="city" value={ciudad} onChange={(e) => setCiudad(e.target.value)}>
          <option value="">{t.cityNone}</option>
          {Object.entries(t.cities).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="sl-message">{t.message}</label>
        <textarea id="sl-message" name="message" value={mensaje} onChange={(e) => setMensaje(e.target.value)} maxLength={400} />
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

  function skipToContent(e) {
    e.preventDefault()
    const main = document.getElementById('main')
    main?.focus({ preventScroll: true })
    main?.scrollIntoView({ block: 'start' })
  }

  return (
    <div className="sl" data-theme={theme ?? undefined} ref={rootRef}>
      <InAppBrowserBanner t={t.inApp} />
      <a className="skip" href="/landing" onClick={skipToContent}>{t.skip}</a>

      <nav className="nav" aria-label="Main">
        <div className="wrap nav-inner">
          <img className="logo" src="/logo.png" alt="Sumay Coffee Club" />
          <span className="tag">{t.betaTag}</span>
          <span className="spacer" />
          <LangToggle lang={lang} setLang={setLang} />
          <a className="btn btn-primary" href="/landing" onClick={scrollToId('waitlist')}>{t.navCta}</a>
        </div>
      </nav>

      <main id="main" tabIndex={-1}>
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
              <img src="/images/coffee-factory/food.jpg" alt={t.heroPhotoAlt} width="1400" height="933" fetchPriority="high" decoding="async" />
            </figure>
            <Phone className="hero-phone">
              <img src="/landing/app-discover.webp" alt={t.heroPhoneAlt} width="720" height="1565" decoding="async" />
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
                <img src="/images/republica-del-cacao/food.jpg" alt="" loading="lazy" decoding="async" />
                <img src="/images/coffee-factory/place.jpg" alt="" loading="lazy" decoding="async" />
                <img src="/images/quito-deli/food.jpg" alt="" loading="lazy" decoding="async" />
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
            <div className="bg"><img src="/images/coffee-factory/place.jpg" alt="" loading="lazy" decoding="async" /></div>
            <div className="panel-copy">
              <h2>{t.panels.invite.title}</h2>
              <p>{t.panels.invite.body}</p>
            </div>
            <div className="panel-visual">
              <Phone className="bleed-phone">
                <img src="/landing/app-envelope.webp" alt={t.panels.invite.alt} loading="lazy" decoding="async" />
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
              {Array.from({ length: BEANS_TOTAL }, (_, i) => {
                const isCup = i === BEANS_TOTAL - 1
                const collected = i < BEANS_COLLECTED
                return (
                  <div
                    key={i}
                    className={`token${collected ? ' on' : ''}${isCup ? ' cup' : ''}`}
                    style={{ '--n': i }}
                  >
                    {isCup ? <Cup /> : <Bean />}
                  </div>
                )
              })}
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
                  <div className="ph"><img src={photo} alt={t.cafes.alts[id]} loading="lazy" decoding="async" /></div>
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
      </main>

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
