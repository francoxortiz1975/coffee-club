import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/geist'
import '@fontsource/parisienne/latin-400.css'
import './landing.css'
import cafes from '../data/cafes.json'
import InAppBrowserBanner from '../components/InAppBrowserBanner'
import { supabase } from '../lib/supabase'
import { copy } from '../lib/landingCopy'
import { useLandingLang } from '../lib/useLandingLang'
import { useTheme } from '../lib/useTheme'
import { ThemeToggle } from '../components/LandingChrome'
import LoopVideo from '../components/LoopVideo'
import ScratchCard from '../components/ScratchCard'

// The playable invitation only loads when its panel is near the screen (it brings its own fonts and art).
const InvitationDemo = lazy(() => import('../components/invitation/InvitationDemo'))

function NearScreen({ children, fallback = null }) {
  const ref = useRef(null)
  const [near, setNear] = useState(() => typeof window !== 'undefined' && !('IntersectionObserver' in window))
  useEffect(() => {
    if (near) return undefined
    const io = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { setNear(true); io.disconnect() } }, { rootMargin: '600px 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [near])
  return <div ref={ref} style={{ position: 'absolute', inset: 0 }}>{near ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}</div>
}
import { getRef } from '../lib/waitlist'

const WAITLIST_KEY = 'samay_waitlist_email'

const FEATURED = [
  { id: 'republica-del-cacao', photo: '/images/republica-del-cacao/place.jpg', big: true },
  { id: 'coffee-factory', photo: '/images/coffee-factory/cover.jpg' },
  { id: 'quito-deli', photo: '/images/quito-deli/place.jpg' },
]

// Scroll suave sin agregar #hash a la URL (el webview de Instagram no parsea bien el #).
function scrollToId(id) {
  return (e) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const els = ref.current?.querySelectorAll('.reveal') ?? []
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

function Phone({ className = '', children }) {
  return (
    <div className={`phone ${className}`}>
      <div className="screen">{children}</div>
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
        source: `landing:${lang}:${ciudad || 'na'}:${getRef() || 'direct'}`,
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
  const [lang] = useLandingLang()
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

  const joinWaitlist = () => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

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
                <NearScreen fallback={<img src="/landing/app-envelope.webp" alt={t.panels.invite.alt} loading="lazy" decoding="async" />}>
                  <InvitationDemo replay={t.panels.invite.replay} />
                </NearScreen>
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
          <ScratchCard copy={t.beans.play} onJoin={joinWaitlist} />
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
          <Link className="link" to="/privacy">{t.footer.privacy}</Link>
          <a className="link" href="mailto:hola@sumayclub.app">{t.footer.contact}</a>
          <ThemeToggle t={t.footer} effective={effectiveTheme} onChoose={chooseTheme} />
        </div>
      </footer>
    </div>
  )
}
