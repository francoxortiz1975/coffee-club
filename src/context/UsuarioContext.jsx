import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const KEY = 'samay_usuario'
const FOTO_KEY = 'samay_usuario_foto' // foto local-only (hasta que tengamos Storage)
const UsuarioContext = createContext()

const PREFIJOS = [
  'amanteDel', 'reyDel', 'reinaDel', 'maestroDel', 'fanDel', 'adictoAl',
  'cazadorDel', 'gurúDel', 'bohemioDel', 'magoDel', 'profeDel', 'baristaDel',
]
const CAFES = [
  'Espresso', 'Cappuccino', 'Cortado', 'Latte', 'Mocha', 'Americano',
  'Macchiato', 'Flatwhite', 'Frappe', 'Ristretto', 'Affogato', 'Turco',
  'Doppio', 'Cubano', 'Bombón',
]
const NOMBRES_DISPLAY = [
  'Cafetero anónimo', 'Catador curioso', 'Bohemio del café',
  'Buscador de cafés', 'Amante del aroma',
]

export const TIPOS_CAFE = [
  'Espresso', 'Doppio', 'Ristretto', 'Americano',
  'Cappuccino', 'Latte', 'Flat white', 'Macchiato', 'Cortado',
  'Mocha', 'Affogato', 'Frappe',
  'Turco', 'Cubano', 'Bombón',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generarUsername() {
  const n = Math.floor(Math.random() * 90 + 10)
  return `${pick(PREFIJOS)}${pick(CAFES)}${n}`
}

const USUARIO_VACIO = {
  nombre: '',
  username: '',
  foto: '',
  cafeteriaFavoritaId: '',
  cafeFavorito: '',
}

// ─── Anonymous mode (sin auth) ─── usa localStorage como antes ─────
function generarUsuarioInicial() {
  return {
    nombre: pick(NOMBRES_DISPLAY),
    username: generarUsername(),
    foto: '',
    cafeteriaFavoritaId: '',
    cafeFavorito: '',
  }
}

function loadAnonymous() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (raw && typeof raw === 'object') {
      return { ...USUARIO_VACIO, ...raw }
    }
  } catch {}
  const inicial = generarUsuarioInicial()
  localStorage.setItem(KEY, JSON.stringify(inicial))
  return inicial
}

// ─── Auth mode ─── lee de Supabase profiles ───────────────────────
async function loadFromSupabase(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, nombre, cafe_favorito, cafeteria_favorita_id, foto_url')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('profile load error:', error)
    return null
  }
  // Mapear snake_case → camelCase del UI
  // Foto: si el profile no tiene url (todavía no hay Storage), leer dataURL local.
  const fotoLocal = localStorage.getItem(FOTO_KEY) || ''
  return {
    nombre: data.nombre || '',
    username: data.username || '',
    foto: data.foto_url || fotoLocal,
    cafeFavorito: data.cafe_favorito || '',
    cafeteriaFavoritaId: data.cafeteria_favorita_id || '',
  }
}

export function UsuarioProvider({ children }) {
  const { user, cargando: authCargando } = useAuth()
  const [usuario, setUsuario] = useState(USUARIO_VACIO)
  const [cargando, setCargando] = useState(true)

  // Sync con auth state
  useEffect(() => {
    if (authCargando) return

    if (user) {
      // Auth mode → leer de Supabase
      setCargando(true)
      loadFromSupabase(user.id).then((perfil) => {
        if (perfil) setUsuario(perfil)
        setCargando(false)
      })
    } else {
      // Anonymous mode → localStorage
      setUsuario(loadAnonymous())
      setCargando(false)
    }
  }, [user, authCargando])

  async function actualizar(parcial) {
    const next = { ...usuario, ...parcial }
    setUsuario(next)

    if (user) {
      // Foto se guarda local hasta que tengamos Storage; el resto va a Supabase.
      if ('foto' in parcial) {
        localStorage.setItem(FOTO_KEY, parcial.foto || '')
      }

      const updates = {}
      if ('nombre' in parcial) updates.nombre = parcial.nombre
      if ('username' in parcial) updates.username = parcial.username
      if ('cafeFavorito' in parcial) updates.cafe_favorito = parcial.cafeFavorito
      if ('cafeteriaFavoritaId' in parcial) updates.cafeteria_favorita_id = parcial.cafeteriaFavoritaId
      // foto_url lo dejamos para cuando tengamos Storage

      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString()
        const { error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
        if (error) console.error('profile update error:', error)
      }
    } else {
      // Anonymous → localStorage
      localStorage.setItem(KEY, JSON.stringify(next))
    }
  }

  return (
    <UsuarioContext.Provider value={{ usuario, actualizar, cargando }}>
      {children}
    </UsuarioContext.Provider>
  )
}

export function useUsuario() {
  return useContext(UsuarioContext)
}
