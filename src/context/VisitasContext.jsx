import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const KEY = 'samay_visitas'
const VisitasContext = createContext()

// ─── Anonymous mode ───────────────────────────────────────
function loadAnonymous() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? [] } catch { return [] }
}

function persistAnonymous(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr))
}

// ─── Auth mode ─── lee de Supabase visitas ────────────────
async function loadFromSupabase(userId) {
  const { data, error } = await supabase
    .from('visitas')
    .select('cafe_id')
    .eq('user_id', userId)
  if (error) {
    console.error('visitas load error:', error)
    return []
  }
  return data.map((v) => v.cafe_id)
}

export function VisitasProvider({ children }) {
  const { user, cargando: authCargando } = useAuth()
  const [visitas, setVisitas] = useState([])

  useEffect(() => {
    if (authCargando) return

    if (!user) {
      setVisitas(loadAnonymous())
      return
    }

    let activo = true

    function refresh() {
      if (!activo) return
      loadFromSupabase(user.id).then((data) => {
        if (activo) setVisitas(data)
      })
    }
    refresh()

    // Realtime: insert/delete en visitas del user → refresca state
    const channel = supabase
      .channel(`visitas-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visitas',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setVisitas((prev) => prev.includes(payload.new.cafe_id) ? prev : [...prev, payload.new.cafe_id])
          } else if (payload.eventType === 'DELETE') {
            setVisitas((prev) => prev.filter((id) => id !== payload.old.cafe_id))
          }
        }
      )
      .subscribe()

    window.addEventListener('focus', refresh)
    window.addEventListener('online', refresh)

    return () => {
      activo = false
      supabase.removeChannel(channel)
      window.removeEventListener('focus', refresh)
      window.removeEventListener('online', refresh)
    }
  }, [user, authCargando])

  async function toggleVisita(cafeId) {
    const yaVisitado = visitas.includes(cafeId)

    if (!user) {
      // Anonymous → localStorage
      const next = yaVisitado ? visitas.filter((v) => v !== cafeId) : [...visitas, cafeId]
      setVisitas(next)
      persistAnonymous(next)
      return
    }

    // Auth → optimistic update + Supabase
    const next = yaVisitado ? visitas.filter((v) => v !== cafeId) : [...visitas, cafeId]
    setVisitas(next)

    if (yaVisitado) {
      const { error } = await supabase
        .from('visitas')
        .delete()
        .eq('user_id', user.id)
        .eq('cafe_id', cafeId)
      if (error) {
        console.error('visitas delete error:', error)
        setVisitas((prev) => [...prev, cafeId]) // rollback
      }
    } else {
      const { error } = await supabase
        .from('visitas')
        .insert({ user_id: user.id, cafe_id: cafeId })
      if (error) {
        console.error('visitas insert error:', error)
        setVisitas((prev) => prev.filter((id) => id !== cafeId)) // rollback
      }
    }
  }

  return (
    <VisitasContext.Provider value={{ visitas, toggleVisita }}>
      {children}
    </VisitasContext.Provider>
  )
}

export function useVisitas() {
  return useContext(VisitasContext)
}
