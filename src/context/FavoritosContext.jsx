import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const KEY = 'samay_favoritos'
const FavoritosContext = createContext()

// ─── Anonymous mode ───────────────────────────────────────
function loadAnonymous() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? [] } catch { return [] }
}

function persistAnonymous(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr))
}

// ─── Auth mode ─── lee de Supabase favoritos ──────────────
async function loadFromSupabase(userId) {
  const { data, error } = await supabase
    .from('favoritos')
    .select('cafe_id')
    .eq('user_id', userId)
  if (error) {
    console.error('favoritos load error:', error)
    return []
  }
  return data.map((f) => f.cafe_id)
}

export function FavoritosProvider({ children }) {
  const { user, cargando: authCargando } = useAuth()
  const [favoritos, setFavoritos] = useState([])

  useEffect(() => {
    if (authCargando) return

    if (!user) {
      setFavoritos(loadAnonymous())
      return
    }

    // Carga inicial desde Supabase
    loadFromSupabase(user.id).then(setFavoritos)

    // Realtime: insert/delete en favoritos del user → refresca state
    const channel = supabase
      .channel(`favoritos-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favoritos',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFavoritos((prev) => prev.includes(payload.new.cafe_id) ? prev : [...prev, payload.new.cafe_id])
          } else if (payload.eventType === 'DELETE') {
            setFavoritos((prev) => prev.filter((id) => id !== payload.old.cafe_id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, authCargando])

  async function toggleFavorito(cafeId) {
    const yaEsFav = favoritos.includes(cafeId)

    if (!user) {
      // Anonymous → localStorage
      const next = yaEsFav ? favoritos.filter((f) => f !== cafeId) : [...favoritos, cafeId]
      setFavoritos(next)
      persistAnonymous(next)
      return
    }

    // Auth → optimistic update + Supabase
    const next = yaEsFav ? favoritos.filter((f) => f !== cafeId) : [...favoritos, cafeId]
    setFavoritos(next)

    if (yaEsFav) {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', user.id)
        .eq('cafe_id', cafeId)
      if (error) {
        console.error('favoritos delete error:', error)
        setFavoritos((prev) => [...prev, cafeId]) // rollback
      }
    } else {
      const { error } = await supabase
        .from('favoritos')
        .insert({ user_id: user.id, cafe_id: cafeId })
      if (error) {
        console.error('favoritos insert error:', error)
        setFavoritos((prev) => prev.filter((id) => id !== cafeId)) // rollback
      }
    }
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  )
}

export function useFavoritos() {
  return useContext(FavoritosContext)
}
