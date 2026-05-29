import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const KEY = 'samay_invitaciones'
const InvitacionesContext = createContext()

// ─── Anonymous mode ───────────────────────────────────────
// Identidad de una invitación local: cafe + nombre + receptor + fecha + hora.
function localKey({ cafeId, nombre, receptor, fecha, hora }) {
  return [cafeId, nombre || '', receptor || '', fecha || '', hora || ''].join('|')
}

function loadAnonymous() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    return {
      enviadas: Array.isArray(raw?.enviadas) ? raw.enviadas : [],
      recibidas: Array.isArray(raw?.recibidas) ? raw.recibidas : [],
    }
  } catch {
    return { enviadas: [], recibidas: [] }
  }
}

function persistAnonymous(state) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

// ─── Auth mode ────────────────────────────────────────────
// Convierte una fila de Supabase al shape que usa el UI.
function rowToEnviada(row, miNombre) {
  return {
    id: row.id,                                  // uuid de la fila
    cafeId: row.cafe_id,
    nombre: miNombre,                            // emisor soy yo
    receptor: row.receptor_nombre || '',
    fecha: row.fecha_cita || '',
    hora: row.hora_cita ? row.hora_cita.slice(0, 5) : '',
    estado: row.estado,
    createdAt: row.created_at,
  }
}

function rowToRecibida(row) {
  return {
    id: row.id,
    cafeId: row.cafe_id,
    nombre: row.emisor?.nombre || '',            // viene del join
    receptor: row.receptor_nombre || '',
    fecha: row.fecha_cita || '',
    hora: row.hora_cita ? row.hora_cita.slice(0, 5) : '',
    estado: row.estado,
    createdAt: row.created_at,
  }
}

async function loadEnviadas(userId, miNombre) {
  const { data, error } = await supabase
    .from('invitaciones')
    .select('id, cafe_id, receptor_nombre, fecha_cita, hora_cita, estado, created_at')
    .eq('emisor_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('enviadas load error:', error)
    return []
  }
  return data.map((r) => rowToEnviada(r, miNombre))
}

async function loadRecibidas(userId) {
  const { data, error } = await supabase
    .from('invitaciones')
    .select('id, cafe_id, receptor_nombre, fecha_cita, hora_cita, estado, created_at, emisor:profiles!emisor_id(nombre, username)')
    .eq('receptor_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    console.error('recibidas load error:', error)
    return []
  }
  return data.map(rowToRecibida)
}

// invKey() es el identificador único para las invitaciones, tanto en
// localStorage (string concat) como en Supabase (uuid de la fila).
function invKey(inv) {
  return inv.id ?? localKey(inv)
}

export function InvitacionesProvider({ children }) {
  const { user, cargando: authCargando } = useAuth()
  const [state, setState] = useState({ enviadas: [], recibidas: [] })

  useEffect(() => {
    if (authCargando) return

    if (!user) {
      setState(loadAnonymous())
      return
    }

    let activo = true

    async function refresh() {
      if (!activo) return
      // Para construir las enviadas necesito mi propio nombre (del profile).
      const { data: perfil } = await supabase
        .from('profiles')
        .select('nombre')
        .eq('id', user.id)
        .single()
      const miNombre = perfil?.nombre || ''

      const [enviadas, recibidas] = await Promise.all([
        loadEnviadas(user.id, miNombre),
        loadRecibidas(user.id),
      ])
      if (activo) setState({ enviadas, recibidas })
    }
    refresh()

    // Realtime
    const channel = supabase
      .channel(`invitaciones-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invitaciones', filter: `emisor_id=eq.${user.id}` },
        () => refresh()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invitaciones', filter: `receptor_id=eq.${user.id}` },
        () => refresh()
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

  async function agregarEnviada(inv) {
    if (!user) {
      // Anonymous → localStorage
      setState((prev) => {
        const k = localKey(inv)
        if (prev.enviadas.some((i) => localKey(i) === k)) return prev
        const next = {
          ...prev,
          enviadas: [{ ...inv, createdAt: Date.now() }, ...prev.enviadas],
        }
        persistAnonymous(next)
        return next
      })
      return
    }

    // Auth → Supabase
    const insert = {
      emisor_id: user.id,
      cafe_id: inv.cafeId,
      receptor_nombre: inv.receptor || null,
      fecha_cita: inv.fecha || null,
      hora_cita: inv.hora || null,
    }
    const { error } = await supabase.from('invitaciones').insert(insert)
    if (error) console.error('invitaciones insert error:', error)
    // Realtime + refetch lo agregan al state.
  }

  async function agregarRecibida(inv) {
    if (!user) {
      // Anonymous → localStorage (dedup contra enviadas)
      setState((prev) => {
        const k = localKey(inv)
        if (prev.enviadas.some((i) => localKey(i) === k)) return prev
        if (prev.recibidas.some((i) => localKey(i) === k)) return prev
        const next = {
          ...prev,
          recibidas: [{ ...inv, savedAt: Date.now() }, ...prev.recibidas],
        }
        persistAnonymous(next)
        return next
      })
      return
    }
    // Auth → por ahora no-op. Cuando armemos cafeteros, el emisor va a
    // setear receptor_id en el insert y aparece automático en recibidas.
    // Si querés "guardarme esta invitación" sin que el emisor te haya
    // elegido, vendría una función "reclamar" (futuro).
  }

  async function eliminar(tipo, key) {
    if (!user) {
      // Anonymous → localStorage
      setState((prev) => {
        const next = {
          ...prev,
          [tipo]: prev[tipo].filter((i) => localKey(i) !== key),
        }
        persistAnonymous(next)
        return next
      })
      return
    }

    // Auth → Supabase. key acá es el uuid de la fila.
    const { error } = await supabase.from('invitaciones').delete().eq('id', key)
    if (error) console.error('invitaciones delete error:', error)
  }

  return (
    <InvitacionesContext.Provider
      value={{
        enviadas: state.enviadas,
        recibidas: state.recibidas,
        agregarEnviada,
        agregarRecibida,
        eliminar,
        invKey,
      }}
    >
      {children}
    </InvitacionesContext.Provider>
  )
}

export function useInvitaciones() {
  return useContext(InvitacionesContext)
}
