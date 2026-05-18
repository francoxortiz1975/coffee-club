import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeftIcon } from '../components/Icons'

export default function Login() {
  const { enviarMagicLink, verificarCodigo, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [estado, setEstado] = useState('pidiendoEmail') // pidiendoEmail | verificandoCodigo | enviando | exito
  const [error, setError] = useState('')

  if (user) {
    navigate('/perfil', { replace: true })
    return null
  }

  async function pedirCodigo(e) {
    e.preventDefault()
    setError('')
    const limpio = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
      setError('Email inválido')
      return
    }
    setEstado('enviando')
    const { error: err } = await enviarMagicLink(limpio)
    if (err) {
      console.error('magic link error:', err)
      setError('No se pudo enviar el código. Prueba de nuevo.')
      setEstado('pidiendoEmail')
      return
    }
    setEstado('verificandoCodigo')
  }

  async function verificar(e) {
    e.preventDefault()
    setError('')
    const limpio = codigo.replace(/\s/g, '')
    if (!/^\d{6,8}$/.test(limpio)) {
      setError('Código inválido (6 dígitos)')
      return
    }
    setEstado('enviando')
    const { error: err } = await verificarCodigo(email.trim().toLowerCase(), limpio)
    if (err) {
      console.error('verifyOtp error:', err)
      setError('Código incorrecto o expirado. Pide uno nuevo.')
      setEstado('verificandoCodigo')
      return
    }
    setEstado('exito')
    // El AuthContext detecta la nueva sesión y el redirect arriba se dispara.
  }

  return (
    <div
      className="min-h-screen flex flex-col px-5 pb-8"
      style={{ paddingTop: 'calc(48px + env(safe-area-inset-top))' }}
    >
      <button onClick={() => navigate(-1)} className="text-cafe-accent/50 mb-8 self-start">
        <ArrowLeftIcon size={20} />
      </button>

      <h1 className="text-3xl font-serif font-bold text-cafe-dark mb-2">Entrar a Sumay</h1>

      {/* PASO 1 — Email */}
      {estado === 'pidiendoEmail' || (estado === 'enviando' && !codigo) ? (
        <>
          <p className="text-sm text-cafe-accent/70 mb-8 leading-relaxed">
            Ingresa tu email. Te mandamos un código y un enlace para entrar sin contraseña.
          </p>
          <form onSubmit={pedirCodigo} className="flex flex-col gap-3">
            <label className="text-lg font-serif font-bold text-cafe-dark">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              autoFocus
              className="w-full bg-transparent border border-cafe-accent/25 rounded-xl px-4 py-3 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60"
              required
            />
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="mt-4 bg-cafe-dark text-[#b8d04a] text-sm font-bold py-4 rounded-2xl shadow-lg ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform disabled:opacity-50"
            >
              {estado === 'enviando' ? 'Enviando…' : 'Enviar código'}
            </button>
            {error && <p className="text-xs text-red-600 text-center mt-1">{error}</p>}
          </form>
        </>
      ) : null}

      {/* PASO 2 — Código */}
      {(estado === 'verificandoCodigo' || estado === 'enviando' && codigo) || estado === 'exito' ? (
        <>
          <p className="text-sm text-cafe-accent/70 mb-2 leading-relaxed">
            Te enviamos un email a <span className="font-semibold text-cafe-dark">{email}</span>.
            Copia el código de 6 dígitos del mensaje y pégalo abajo.
          </p>
          <p className="text-xs text-cafe-accent/50 mb-8">
            ¿Abres este email desde tu computadora? También puedes dar click al enlace.
          </p>

          <form onSubmit={verificar} className="flex flex-col gap-3">
            <label className="text-lg font-serif font-bold text-cafe-dark">Código</label>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="123456"
              maxLength={8}
              autoFocus
              className="w-full bg-transparent border border-cafe-accent/25 rounded-xl px-4 py-3 text-2xl text-cafe-dark text-center tracking-[0.4em] font-mono outline-none focus:border-cafe-accent/60"
            />
            <button
              type="submit"
              disabled={estado === 'enviando' || estado === 'exito'}
              className="mt-4 bg-cafe-dark text-[#b8d04a] text-sm font-bold py-4 rounded-2xl shadow-lg ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform disabled:opacity-50"
            >
              {estado === 'enviando' ? 'Verificando…' : estado === 'exito' ? '¡Entrando!' : 'Verificar código'}
            </button>
            <button
              type="button"
              onClick={() => { setEstado('pidiendoEmail'); setCodigo(''); setError('') }}
              className="text-xs font-semibold text-cafe-accent/60 underline mt-2"
            >
              Usar otro email
            </button>
            {error && <p className="text-xs text-red-600 text-center mt-1">{error}</p>}
          </form>
        </>
      ) : null}

      <p className="text-xs text-cafe-accent/50 mt-auto pt-8 text-center">
        ¿Todavía no estás en el club?{' '}
        <Link to="/landing" className="font-semibold text-cafe-dark underline">
          Únete al waitlist
        </Link>
      </p>
    </div>
  )
}
