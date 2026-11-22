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
      setError('Invalid email')
      return
    }
    setEstado('enviando')
    const { error: err } = await enviarMagicLink(limpio)
    if (err) {
      console.error('magic link error:', err)
      setError("Couldn't send the code. Please try again.")
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
      setError('Invalid code (6 digits)')
      return
    }
    setEstado('enviando')
    const { error: err } = await verificarCodigo(email.trim().toLowerCase(), limpio)
    if (err) {
      console.error('verifyOtp error:', err)
      setError('Wrong or expired code. Request a new one.')
      setEstado('verificandoCodigo')
      return
    }
    setEstado('exito')
    // El AuthContext detecta la nueva sesión y el redirect arriba se dispara.
  }

  return (
    <div
      className="min-h-screen flex flex-col px-5 pb-8"
      style={{ paddingTop: 'calc(16px + env(safe-area-inset-top))' }}
    >
      <button onClick={() => navigate(-1)} className="text-cafe-accent/50 mb-8 self-start">
        <ArrowLeftIcon size={20} />
      </button>

      <h1 className="text-3xl font-display font-bold text-cafe-dark mb-2">Sign in to Sumay</h1>

      {/* PASO 1 — Email */}
      {estado === 'pidiendoEmail' || (estado === 'enviando' && !codigo) ? (
        <>
          <p className="text-sm text-cafe-accent/70 mb-8 leading-relaxed">
            Enter your email. We'll send you a code and a link to sign in without a password.
          </p>
          <form onSubmit={pedirCodigo} className="flex flex-col gap-3">
            <label className="text-lg font-display font-bold text-cafe-dark">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
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
              {estado === 'enviando' ? 'Sending…' : 'Send code'}
            </button>
            {error && <p className="text-xs text-red-600 text-center mt-1">{error}</p>}
          </form>
        </>
      ) : null}

      {/* PASO 2 — Código */}
      {(estado === 'verificandoCodigo' || estado === 'enviando' && codigo) || estado === 'exito' ? (
        <>
          <p className="text-sm text-cafe-accent/70 mb-2 leading-relaxed">
            We sent an email to <span className="font-semibold text-cafe-dark">{email}</span>.
            Copy the 6-digit code from the message and paste it below.
          </p>
          <p className="text-xs text-cafe-accent/50 mb-8">
            Opening this email on your computer? You can also click the link.
          </p>

          <form onSubmit={verificar} className="flex flex-col gap-3">
            <label className="text-lg font-display font-bold text-cafe-dark">Code</label>
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
              {estado === 'enviando' ? 'Verifying…' : estado === 'exito' ? 'Signing in!' : 'Verify code'}
            </button>
            <button
              type="button"
              onClick={() => { setEstado('pidiendoEmail'); setCodigo(''); setError('') }}
              className="text-xs font-semibold text-cafe-accent/60 underline mt-2"
            >
              Use a different email
            </button>
            {error && <p className="text-xs text-red-600 text-center mt-1">{error}</p>}
          </form>
        </>
      ) : null}

      <p className="text-xs text-cafe-accent/50 mt-auto pt-8 text-center">
        Not in the club yet?{' '}
        <Link to="/landing" className="font-semibold text-cafe-dark underline">
          Join the waitlist
        </Link>
      </p>
    </div>
  )
}
