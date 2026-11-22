import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Página intermedia: el magic link nos manda acá. El cliente de Supabase ya
// procesa la sesión solo (detectSessionInUrl). Acá esperamos a que el AuthContext
// la reciba y redirigimos al home (o /perfil).
export default function AuthCallback() {
  const navigate = useNavigate()
  const { user, cargando } = useAuth()
  const [error, setError] = useState('')

  useEffect(() => {
    if (cargando) return

    if (user) {
      navigate('/perfil', { replace: true })
      return
    }

    // Si después de 4s todavía no hay user, algo falló
    const t = setTimeout(() => {
      if (!user) setError("We couldn't complete the sign-in. Please try again.")
    }, 4000)
    return () => clearTimeout(t)
  }, [user, cargando, navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {!error ? (
        <>
          <div className="text-5xl mb-4 animate-pulse">☕</div>
          <p className="text-lg font-display font-bold text-cafe-dark">Signing you in…</p>
          <p className="text-sm text-cafe-accent/60 mt-2">Checking your link</p>
        </>
      ) : (
        <>
          <div className="text-5xl mb-4">😶</div>
          <p className="text-lg font-display font-bold text-cafe-dark">{error}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="mt-6 bg-cafe-dark text-[#b8d04a] text-sm font-bold px-6 py-3 rounded-2xl ring-2 ring-[#b8d04a]/40"
          >
            Back to sign in
          </button>
        </>
      )}
    </div>
  )
}
