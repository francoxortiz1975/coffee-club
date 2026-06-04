import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let resuelto = false

    // Timeout de seguridad: si getSession cuelga (red cortada, token inválido),
    // liberamos el cargando para que el app arranque en modo anónimo.
    const timeout = setTimeout(() => {
      if (!resuelto) {
        resuelto = true
        setCargando(false)
      }
    }, 6000)

    supabase.auth.getSession().then(({ data }) => {
      if (!resuelto) {
        resuelto = true
        clearTimeout(timeout)
        setSession(data.session)
        setCargando(false)
      }
    }).catch(() => {
      if (!resuelto) {
        resuelto = true
        clearTimeout(timeout)
        setCargando(false)
      }
    })

    // Suscripción a cambios de sesión (login, logout, refresh token, etc.)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
    })

    return () => {
      clearTimeout(timeout)
      sub.subscription.unsubscribe()
    }
  }, [])

  // Manda email con magic link + código OTP de 6 dígitos.
  // El user puede clickear el link (browser) o tipear el código (PWA / cross-device).
  async function enviarMagicLink(email, redirectTo) {
    return supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo || window.location.origin + '/auth/callback',
      },
    })
  }

  // Verificar el código OTP de 6 dígitos que el user copia del email.
  // Crea la sesión directamente acá, sin redirect — perfecto para PWA.
  async function verificarCodigo(email, codigo) {
    return supabase.auth.verifyOtp({
      email,
      token: codigo,
      type: 'email',
    })
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        cargando,
        enviarMagicLink,
        verificarCodigo,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
