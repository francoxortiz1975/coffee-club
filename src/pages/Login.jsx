import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeftIcon } from '../components/Icons'

export default function Login() {
  const { enviarMagicLink, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState('idle') // idle | enviando | enviado | error
  const [error, setError] = useState('')

  if (user) {
    // Si ya está logueado, no tiene sentido mostrar login
    navigate('/perfil', { replace: true })
    return null
  }

  async function submit(e) {
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
      setError('No se pudo enviar el link. Prueba de nuevo.')
      setEstado('error')
      return
    }
    setEstado('enviado')
  }

  return (
    <div className="min-h-screen flex flex-col px-5 pt-12 pb-8">
      <button onClick={() => navigate(-1)} className="text-cafe-accent/50 mb-8 self-start">
        <ArrowLeftIcon size={20} />
      </button>

      <h1 className="text-3xl font-serif font-bold text-cafe-dark mb-2">Entrar a Sumay</h1>
      <p className="text-sm text-cafe-accent/70 mb-8 leading-relaxed">
        Ingresa tu email. Te mandamos un enlace para entrar sin contraseña.
      </p>

      {estado === 'enviado' ? (
        <div className="bg-[#faf4ec] rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">📬</div>
          <p className="text-lg font-serif font-bold text-cafe-dark mb-2">
            Revisa tu email
          </p>
          <p className="text-sm text-cafe-accent/70 leading-relaxed">
            Te enviamos un enlace a <span className="font-semibold text-cafe-dark">{email}</span>.
            <br />
            Da click ahí y entras automáticamente.
          </p>
          <button
            onClick={() => { setEstado('idle'); setEmail('') }}
            className="mt-6 text-xs font-semibold text-cafe-accent/60 underline"
          >
            Usar otro email
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-3">
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
            {estado === 'enviando' ? 'Enviando…' : 'Enviar enlace'}
          </button>

          {error && <p className="text-xs text-red-600 text-center mt-1">{error}</p>}
        </form>
      )}

      <p className="text-xs text-cafe-accent/50 mt-auto pt-8 text-center">
        ¿Todavía no estás en el club?{' '}
        <Link to="/landing" className="font-semibold text-cafe-dark underline">
          Únete al waitlist
        </Link>
      </p>
    </div>
  )
}
