import { useState, useEffect } from 'react'
import cafes from '../data/cafes.json'
import InAppBrowserBanner from '../components/InAppBrowserBanner'
import { supabase } from '../lib/supabase'
import { copy, LANGS } from '../lib/landingCopy'
import { useLandingLang } from '../lib/useLandingLang'
import {
  CoffeeCupIcon, CoffeeBeanIcon, CoffeeMugIcon, HeartIcon,
  DiceIcon, InviteIcon, PinIcon, SparkleIcon,
} from '../components/Icons'

const WAITLIST_KEY = 'samay_waitlist_email'

// Destacadas para el preview de la landing. Toma los primeros 3 con fotos.
const cafesDestacados = cafes.filter((c) => c.fotos?.length).slice(0, 3)

// Scroll suave al waitlist sin agregar #waitlist a la URL (IG no parsea bien el #).
function scrollAWaitlist(e) {
  e.preventDefault()
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Section({ children, className = '', id }) {
  return (
    <section id={id} className={`w-full px-6 py-16 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  )
}

function FeatureCard({ Icono, titulo, texto, accent }) {
  return (
    <div className="flex-1 bg-[#faf4ec] rounded-2xl p-6 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl ${accent} flex items-center justify-center mb-4`}>
        <Icono size={22} className="text-beige" />
      </div>
      <h3 className="text-lg font-serif font-bold text-cafe-dark mb-1.5">{titulo}</h3>
      <p className="text-sm text-cafe-dark/70 leading-relaxed">{texto}</p>
    </div>
  )
}

// Marco de iPhone que muestra el screenshot real. Si la imagen no existe
// (404), cae a un placeholder simple para que la landing no se rompa.
function PhoneMockup({ screenshot }) {
  const [error, setError] = useState(false)

  return (
    <div className="relative flex justify-center md:justify-end">
      <div className="relative w-[280px] sm:w-[320px] rounded-[2.5rem] bg-cafe-dark p-3 shadow-2xl ring-8 ring-cafe-dark/10 rotate-2">
        <div className="w-full aspect-[1206/2622] rounded-[2rem] overflow-hidden bg-[#faf4ec] relative">
          {!error ? (
            <img
              src={screenshot}
              alt="Sumay app preview"
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setError(true)}
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center flex items-center justify-center text-center px-6"
              style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)' }}
            >
              <div>
                <img src="/logo.png" alt="" className="h-16 w-auto mx-auto mb-4 opacity-80" />
                <p className="text-beige/50 text-xs">
                  Agrega un screenshot en<br />
                  <code className="text-[#b8d04a]">public/screenshots/hero.png</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="absolute -top-4 -right-2 sm:-right-6 bg-[#b8d04a] text-cafe-dark text-xs font-black px-4 py-2 rounded-full shadow-lg rotate-12">
        Beta
      </div>
    </div>
  )
}

function CafeMiniCard({ cafe }) {
  return (
    <div className="bg-[#faf4ec] rounded-2xl overflow-hidden shadow-sm">
      <div className="aspect-[4/3] bg-cafe-accent/10">
        {cafe.fotos?.[0]
          ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center"><CoffeeCupIcon size={36} className="text-cafe-accent/30" /></div>}
      </div>
      <div className="p-4">
        <h4 className="text-base font-serif font-bold text-cafe-dark leading-tight mb-1">{cafe.nombre}</h4>
        <p className="text-xs text-cafe-accent/60 flex items-center gap-1">
          <PinIcon size={11} />{cafe.barrio}
        </p>
        <p className="text-xs text-cafe-dark/60 mt-2 line-clamp-2">{cafe.especialidad}</p>
      </div>
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
    const existentes = JSON.parse(localStorage.getItem(WAITLIST_KEY) || '[]')
    if (!existentes.some((e) => e.email === limpio)) {
      existentes.push({ email: limpio, mensaje: mensaje.trim(), lang, ciudad, at: Date.now() })
    }
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(existentes))
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="bg-[#b8d04a]/20 border border-[#b8d04a]/40 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">☕</div>
        <p className="text-cafe-dark font-serif font-bold text-lg">{t.successTitle}</p>
        <p className="text-sm text-cafe-dark/70 mt-1">{t.successBody}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto flex flex-col gap-3 text-left">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.emailPlaceholder}
        className="w-full bg-white border border-cafe-accent/25 rounded-2xl px-5 py-3.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60"
        required
      />
      <select
        value={ciudad}
        onChange={(e) => setCiudad(e.target.value)}
        aria-label={t.cityPlaceholder}
        className={`w-full bg-white border border-cafe-accent/25 rounded-2xl pl-4 pr-3 py-3.5 text-sm outline-none focus:border-cafe-accent/60 ${ciudad ? 'text-cafe-dark' : 'text-cafe-dark/50'}`}
      >
        <option value="">{t.cityPlaceholder}</option>
        {Object.entries(t.cities).map(([valor, etiqueta]) => (
          <option key={valor} value={valor}>{etiqueta}</option>
        ))}
      </select>
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder={t.messagePlaceholder}
        rows={3}
        maxLength={400}
        className="w-full bg-white border border-cafe-accent/25 rounded-2xl px-5 py-3 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60 resize-none"
      />
      <button
        type="submit"
        disabled={enviando}
        className="bg-cafe-dark text-[#b8d04a] text-sm font-bold px-6 py-3.5 rounded-2xl shadow-lg ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform self-stretch sm:self-center sm:px-12 disabled:opacity-50"
      >
        {enviando ? t.submitting : t.submit}
      </button>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </form>
  )
}

function LangToggle({ lang, setLang }) {
  return (
    <div role="group" aria-label="Language" className="flex items-center rounded-full bg-beige/10 p-0.5 text-[11px] font-bold">
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`px-2.5 py-1 rounded-full uppercase transition-colors ${
            lang === code ? 'bg-beige text-cafe-dark' : 'text-beige/60'
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  )
}

export default function Landing() {
  const [lang, setLang] = useLandingLang()
  const t = copy[lang]

  useEffect(() => {
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.metaDescription)
  }, [t])

  return (
    <div className="min-h-screen bg-beige text-cafe-dark overflow-x-hidden">
      <InAppBrowserBanner t={t.inApp} />
      {/* ─── Nav top — fondo café para que el logo beige se vea ─── */}
      <nav
        className="w-full"
        style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)' }}
      >
        <div className="w-full px-6 py-5 max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="Sumay" className="h-9 w-auto" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LangToggle lang={lang} setLang={setLang} />
            <a
              href="/landing" onClick={scrollAWaitlist}
              className="text-xs sm:text-sm font-bold bg-[#b8d04a] text-cafe-dark px-3 sm:px-4 py-2 rounded-full active:scale-95 transition-transform whitespace-nowrap"
            >
              {t.navCta}
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <Section className="!pt-6 md:!pt-12">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Texto */}
          <div className="text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-4">
              {t.heroEyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-[1.05] tracking-tight mb-5">
              {t.heroTitle[0]}<br />
              <span className="text-cafe-accent/80">{t.heroTitle[1]}</span><br />
              {t.heroTitle[2]}
            </h1>
            <p className="text-base sm:text-lg text-cafe-dark/70 leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
              {t.heroBody}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="/landing" onClick={scrollAWaitlist}
                className="bg-cafe-dark text-[#b8d04a] text-sm font-bold px-7 py-3.5 rounded-2xl shadow-lg ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform"
              >
                {t.heroCta}
              </a>
            </div>
          </div>

          {/* Visual: screenshot real de la app dentro del marco del phone */}
          <PhoneMockup screenshot="/screenshots/hero.png" />
        </div>
      </Section>

      {/* ─── ¿Qué es? ─── */}
      <Section className="bg-cafe-dark text-beige">
        <div className="max-w-3xl mx-auto text-center">
          <SparkleIcon size={36} className="text-[#b8d04a] mx-auto mb-5" />
          <p className="text-xs uppercase tracking-[0.3em] text-beige/50 mb-4">{t.whatEyebrow}</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-serif leading-snug">
            {t.whatParts.a}<span className="text-[#b8d04a]">{t.whatParts.hl1}</span>{t.whatParts.b}
            <span className="italic">{t.whatParts.it}</span>{t.whatParts.c}
            <span className="text-[#b8d04a]">{t.whatParts.hl2}</span>{t.whatParts.d}
          </p>
        </div>
      </Section>

      {/* ─── Cómo funciona ─── */}
      <Section>
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-3">{t.howEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cafe-dark">
            {t.howTitle}
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FeatureCard Icono={CoffeeCupIcon} {...t.features[0]} accent="bg-cafe-dark" />
          <FeatureCard Icono={DiceIcon} {...t.features[1]} accent="bg-[#7d4f2f]" />
          <FeatureCard Icono={InviteIcon} {...t.features[2]} accent="bg-[#b8d04a]" />
        </div>
      </Section>

      {/* ─── Coffee beans gamification ─── */}
      <Section
        className="bg-cover bg-center text-cafe-dark"
        id="beans"
      >
        <div
          className="rounded-3xl p-8 sm:p-12 bg-cover bg-center"
          style={{ backgroundImage: 'url(/panama-bg.webp)' }}
        >
          <div className="bg-[#faf4ec]/85 backdrop-blur-sm rounded-2xl p-8 sm:p-12 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-3">{t.beansEyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cafe-dark leading-tight mb-4">
                {t.beansTitle}
              </h2>
              <p className="text-base text-cafe-dark/70 leading-relaxed mb-6">
                {t.beansBody}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-3xl font-serif font-bold text-cafe-dark tabular-nums">23</span>
                <CoffeeMugIcon size={32} />
                <CoffeeMugIcon size={32} />
                <CoffeeBeanIcon size={24} />
                <CoffeeBeanIcon size={24} />
                <CoffeeBeanIcon size={24} />
              </div>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-3 max-w-xs">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl flex items-center justify-center ${
                      i < 5 ? 'bg-beige border border-cafe-dark/30' : 'bg-white/40 border border-dashed border-cafe-accent/30'
                    }`}
                  >
                    {i < 5 && <CoffeeBeanIcon size={28} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Cafeterías destacadas ─── */}
      <Section>
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-3">{t.featuredEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cafe-dark">
            {t.featuredTitle}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cafesDestacados.map((cafe) => (
            <CafeMiniCard key={cafe.id} cafe={cafe} />
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="/landing" onClick={scrollAWaitlist}
            className="inline-block border border-cafe-dark/25 text-cafe-dark text-sm font-semibold px-7 py-3 rounded-2xl active:scale-95 transition-transform"
          >
            {t.featuredCta}
          </a>
        </div>
      </Section>

      {/* ─── Invitaciones preview ─── */}
      <Section className="bg-cafe-dark text-beige">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-beige/50 mb-3">{t.invEyebrow}</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 leading-tight">
              {t.invTitleA}<em className="text-[#b8d04a] not-italic">{t.invTitleEm}</em>
            </h2>
            <p className="text-base text-beige/70 leading-relaxed mb-6">
              {t.invBody}
            </p>
            <div className="flex flex-wrap gap-2">
              {t.invChips.map((chip) => (
                <span key={chip} className="text-xs bg-beige/10 border border-beige/15 text-beige/90 rounded-full px-3 py-1">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-[260px] aspect-[9/16] rounded-[2rem] bg-black/40 p-3 shadow-2xl -rotate-3">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                {cafesDestacados[0]?.fotos?.[0] && (
                  <img src={cafesDestacados[0].fotos[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90 p-6 flex flex-col items-center justify-center text-center text-white">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">{t.invCardLabel}</p>
                  <h3 className="text-2xl font-serif font-bold mb-2">{t.invCardName}</h3>
                  <p className="text-xs text-white/70 italic mb-3"><span className="text-white font-semibold">Franco</span>{t.invCardInvites}</p>
                  <h4 className="text-2xl font-serif font-bold leading-tight">{cafesDestacados[0]?.nombre || 'Botánica'}</h4>
                  <div className="mt-4 border border-white/20 rounded-xl px-4 py-2">
                    <p className="text-xs font-semibold">{t.invCardDate}</p>
                    <p className="text-[10px] text-white/60">5:00 pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Waitlist ─── */}
      <Section id="waitlist" className="bg-[#faf4ec]">
        <div className="max-w-2xl mx-auto text-center">
          <HeartIcon size={32} filled className="text-[#b8d04a] mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-3">{t.waitEyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cafe-dark mb-3 leading-tight">
            {t.waitTitle}
          </h2>
          <p className="text-base text-cafe-dark/70 leading-relaxed mb-8">
            {t.waitBody}
          </p>
          <WaitlistForm t={t} lang={lang} />
          <p className="text-[11px] text-cafe-accent/50 mt-5">
            {t.waitTerms}
          </p>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="bg-cafe-dark text-beige/70 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Sumay" className="h-8 w-auto opacity-80" />
            <span className="text-xs">{t.footerMade} · {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <a href="/landing" onClick={scrollAWaitlist} className="hover:text-beige transition-colors">{t.footerWaitlist}</a>
            <a href="mailto:hola@sumayclub.app" className="hover:text-beige transition-colors">{t.footerContact}</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
