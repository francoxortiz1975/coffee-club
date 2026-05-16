import { useState } from 'react'
import cafes from '../data/cafes.json'
import {
  CoffeeCupIcon, CoffeeBeanIcon, CoffeeMugIcon, HeartIcon,
  DiceIcon, InviteIcon, PinIcon, SparkleIcon,
} from '../components/Icons'

const WAITLIST_KEY = 'samay_waitlist_email'

// Destacadas para el preview de la landing. Toma los primeros 3 con fotos.
const cafesDestacados = cafes.filter((c) => c.fotos?.length).slice(0, 3)

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

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    setError('')
    const limpio = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
      setError('Email inválido')
      return
    }
    // Mock por ahora — se reemplaza por insert en Supabase mañana.
    const existentes = JSON.parse(localStorage.getItem(WAITLIST_KEY) || '[]')
    const entrada = { email: limpio, mensaje: mensaje.trim(), at: Date.now() }
    if (!existentes.some((e) => e.email === limpio)) existentes.push(entrada)
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(existentes))
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="bg-[#b8d04a]/20 border border-[#b8d04a]/40 rounded-2xl p-6 text-center">
        <div className="text-3xl mb-2">☕</div>
        <p className="text-cafe-dark font-serif font-bold text-lg">¡Estás dentro!</p>
        <p className="text-sm text-cafe-dark/70 mt-1">Te avisaremos cuando abramos nuevos cupos.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto flex flex-col gap-3 text-left">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        className="w-full bg-white border border-cafe-accent/25 rounded-2xl px-5 py-3.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60"
        required
      />
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Recomiéndanos una cafetería, mándanos un mensaje o cuéntanos qué buscas (opcional)"
        rows={3}
        maxLength={400}
        className="w-full bg-white border border-cafe-accent/25 rounded-2xl px-5 py-3 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60 resize-none"
      />
      <button
        type="submit"
        className="bg-cafe-dark text-[#b8d04a] text-sm font-bold px-6 py-3.5 rounded-2xl shadow-lg ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform self-stretch sm:self-center sm:px-12"
      >
        Reservar mi lugar
      </button>
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
    </form>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-beige text-cafe-dark overflow-x-hidden">
      {/* ─── Nav top — fondo café para que el logo beige se vea ─── */}
      <nav
        className="w-full"
        style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)' }}
      >
        <div className="w-full px-6 py-5 max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Sumay" className="h-9 w-auto" />
          </div>
          <a
            href="#waitlist"
            className="text-xs sm:text-sm font-bold bg-[#b8d04a] text-cafe-dark px-4 py-2 rounded-full active:scale-95 transition-transform"
          >
            Únete al waitlist
          </a>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <Section className="!pt-6 md:!pt-12">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Texto */}
          <div className="text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-4">
              Coffee club · Quito
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-[1.05] tracking-tight mb-5">
              El club del<br />
              <span className="text-cafe-accent/80">buen café</span><br />
              en Quito.
            </h1>
            <p className="text-base sm:text-lg text-cafe-dark/70 leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
              Descubre las cafeterías más chéveres de la ciudad, decide a dónde
              ir sin estresarte y manda invitaciones bacanas a tus panas.
              Coleccionas coffee beans con cada visita.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <a
                href="#waitlist"
                className="bg-cafe-dark text-[#b8d04a] text-sm font-bold px-7 py-3.5 rounded-2xl shadow-lg ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform"
              >
                Quiero entrar al club
              </a>
            </div>
          </div>

          {/* Visual mockup (phone) */}
          <div className="relative flex justify-center md:justify-end">
            <div className="relative w-[280px] sm:w-[320px] aspect-[9/19.5] rounded-[2.5rem] bg-cafe-dark p-3 shadow-2xl ring-8 ring-cafe-dark/10 rotate-2">
              <div
                className="w-full h-full rounded-[2rem] overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url(/wood-bg.webp)' }}
              >
                <div className="w-full h-full bg-[#f5ece0]/50 flex flex-col">
                  {/* Header con degradado café — para que el logo beige se lea */}
                  <div
                    className="px-6 pt-8 pb-5 rounded-b-3xl"
                    style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)' }}
                  >
                    <img src="/logo.png" alt="" className="h-12 w-auto mx-auto" />
                    <div className="mt-4 bg-white/10 rounded-xl px-3 py-2 text-[10px] text-beige/50">
                      Buscar cafetería…
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="bg-[#faf4ec] rounded-2xl overflow-hidden shadow-md flex-1">
                      {cafesDestacados[0]?.fotos?.[0] && (
                        <img src={cafesDestacados[0].fotos[0]} alt="" className="w-full h-1/2 object-cover" />
                      )}
                      <div className="p-3">
                        <div className="h-3 w-32 bg-cafe-dark rounded-full mb-2" />
                        <div className="h-2 w-20 bg-cafe-accent/40 rounded-full mb-3" />
                        <div className="flex gap-1.5">
                          <CoffeeBeanIcon size={14} />
                          <CoffeeBeanIcon size={14} />
                          <CoffeeBeanIcon size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Sticker decorativo */}
            <div className="absolute -top-4 -right-2 sm:-right-6 bg-[#b8d04a] text-cafe-dark text-xs font-black px-4 py-2 rounded-full shadow-lg rotate-12">
              Beta
            </div>
          </div>
        </div>
      </Section>

      {/* ─── ¿Qué es? ─── */}
      <Section className="bg-cafe-dark text-beige">
        <div className="max-w-3xl mx-auto text-center">
          <SparkleIcon size={36} className="text-[#b8d04a] mx-auto mb-5" />
          <p className="text-xs uppercase tracking-[0.3em] text-beige/50 mb-4">¿Qué es Sumay?</p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-serif leading-snug">
            Tu pana de confianza para <span className="text-[#b8d04a]">ubicar buenos cafés</span>,
            <span className="italic"> coleccionarlos</span> y armar el próximo
            <span className="text-[#b8d04a]"> cafecito</span> sin pensarlo mucho.
          </p>
        </div>
      </Section>

      {/* ─── Cómo funciona ─── */}
      <Section>
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-3">Cómo funciona</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cafe-dark">
            Tres movimientos. Cero estrés.
          </h2>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FeatureCard
            Icono={CoffeeCupIcon}
            titulo="Descubre"
            texto="Cafeterías curadas por barrio, especialidad y ocasión. Filtros, favoritas y reseñas reales."
            accent="bg-cafe-dark"
          />
          <FeatureCard
            Icono={DiceIcon}
            titulo="Decide"
            texto="Aleatorio para los que no se deciden, o swipe estilo Tinder para armar tu lista de cafés por visitar."
            accent="bg-[#7d4f2f]"
          />
          <FeatureCard
            Icono={InviteIcon}
            titulo="Invita"
            texto="Genera una invitación bien elegante, con fecha y nombre. La mandas por WhatsApp ¡de una!"
            accent="bg-[#b8d04a]"
          />
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
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-3">Colecciona</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cafe-dark leading-tight mb-4">
                Cada café = un coffee bean.
              </h2>
              <p className="text-base text-cafe-dark/70 leading-relaxed mb-6">
                Cuando llegas a 10 beans, se convierten en una taza. Tu progreso
                por barrio se ve con estampas tipo loyalty card. Mientras más te
                das una vuelta, más chévere se pone tu colección.
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
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-3">Destacadas</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cafe-dark">
            Algunas de las joyas que vas a encontrar
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cafesDestacados.map((cafe) => (
            <CafeMiniCard key={cafe.id} cafe={cafe} />
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href="#waitlist"
            className="inline-block border border-cafe-dark/25 text-cafe-dark text-sm font-semibold px-7 py-3 rounded-2xl active:scale-95 transition-transform"
          >
            Entrar al club →
          </a>
        </div>
      </Section>

      {/* ─── Invitaciones preview ─── */}
      <Section className="bg-cafe-dark text-beige">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-beige/50 mb-3">Invitaciones</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 leading-tight">
              No más <em className="text-[#b8d04a] not-italic">"¿dónde nos vemos?"</em>
            </h2>
            <p className="text-base text-beige/70 leading-relaxed mb-6">
              Elige el café, la fecha y la persona. Sumay te arma una invitación
              visual elegante con un link único para mandar por WhatsApp o donde
              quieras. El otro abre el link y ya sabe a dónde ir.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Café favorito', 'Fecha y hora', 'Quién invita', 'Link único'].map((t) => (
                <span key={t} className="text-xs bg-beige/10 border border-beige/15 text-beige/90 rounded-full px-3 py-1">
                  {t}
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
                  <p className="text-[10px] text-white/50 uppercase tracking-widest mb-4">Invitación</p>
                  <h3 className="text-2xl font-serif font-bold mb-2">¡MARÍA!</h3>
                  <p className="text-xs text-white/70 italic mb-3"><span className="text-white font-semibold">Franco</span> te invita a</p>
                  <h4 className="text-2xl font-serif font-bold leading-tight">{cafesDestacados[0]?.nombre || 'Botánica'}</h4>
                  <div className="mt-4 border border-white/20 rounded-xl px-4 py-2">
                    <p className="text-xs font-semibold">sábado, 18 mayo</p>
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
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/60 mb-3">Únete</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cafe-dark mb-3 leading-tight">
            Reserva tu lugar en el club.
          </h2>
          <p className="text-base text-cafe-dark/70 leading-relaxed mb-8">
            Sumay está en beta cerrada. Deja tu email y te avisamos cuando
            abramos nuevos cupos. Sin spam, sin gente rara.
          </p>
          <WaitlistForm />
          <p className="text-[11px] text-cafe-accent/50 mt-5">
            Al sumarte aceptás recibir un único mail con el acceso.
          </p>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="bg-cafe-dark text-beige/70 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Sumay" className="h-8 w-auto opacity-80" />
            <span className="text-xs">Hecho con ☕ en Quito · {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <a href="#waitlist" className="hover:text-beige transition-colors">Waitlist</a>
            <a href="mailto:hola@sumayclub.app" className="hover:text-beige transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
