import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CafeterosContext = createContext()

// Cafeteros = sistema de amistad bidireccional. Una solicitud va de
// solicitante → destinatario. Cuando destinatario la acepta, los dos
// quedan como "confirmados".

async function loadConfirmados(userId) {
  const { data, error } = await supabase
    .from('cafeteros')
    .select(`
      solicitante_id, destinatario_id, created_at,
      solicitante:profiles!solicitante_id(id, username, nombre, foto_url),
      destinatario:profiles!destinatario_id(id, username, nombre, foto_url)
    `)
    .eq('estado', 'aceptada')
    .or(`solicitante_id.eq.${userId},destinatario_id.eq.${userId}`)
  if (error) {
    console.error('cafeteros confirmados error:', error)
    return []
  }
  // Devolvemos el OTRO user (no yo)
  return data.map((row) => {
    const otro = row.solicitante_id === userId ? row.destinatario : row.solicitante
    return { ...otro, since: row.created_at }
  })
}

async function loadPendientesRecibidas(userId) {
  const { data, error } = await supabase
    .from('cafeteros')
    .select('created_at, solicitante:profiles!solicitante_id(id, username, nombre, foto_url)')
    .eq('destinatario_id', userId)
    .eq('estado', 'pendiente')
  if (error) {
    console.error('cafeteros pendientes recibidas error:', error)
    return []
  }
  return data.map((row) => ({ ...row.solicitante, created_at: row.created_at }))
}

async function loadPendientesEnviadas(userId) {
  const { data, error } = await supabase
    .from('cafeteros')
    .select('created_at, destinatario:profiles!destinatario_id(id, username, nombre, foto_url)')
    .eq('solicitante_id', userId)
    .eq('estado', 'pendiente')
  if (error) {
    console.error('cafeteros pendientes enviadas error:', error)
    return []
  }
  return data.map((row) => ({ ...row.destinatario, created_at: row.created_at }))
}

export function CafeterosProvider({ children }) {
  const { user, cargando: authCargando } = useAuth()
  const [state, setState] = useState({
    confirmados: [],
    pendientesRecibidas: [],
    pendientesEnviadas: [],
  })

  useEffect(() => {
    if (authCargando) return

    if (!user) {
      setState({ confirmados: [], pendientesRecibidas: [], pendientesEnviadas: [] })
      return
    }

    let activo = true

    async function refresh() {
      if (!activo) return
      const [confirmados, pendientesRecibidas, pendientesEnviadas] = await Promise.all([
        loadConfirmados(user.id),
        loadPendientesRecibidas(user.id),
        loadPendientesEnviadas(user.id),
      ])
      if (activo) setState({ confirmados, pendientesRecibidas, pendientesEnviadas })
    }
    refresh()

    // Realtime — cambios donde estoy como solicitante o destinatario
    const channel = supabase
      .channel(`cafeteros-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cafeteros', filter: `solicitante_id=eq.${user.id}` },
        () => refresh()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cafeteros', filter: `destinatario_id=eq.${user.id}` },
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

  // ─── Acciones ─────────────────────────────────────────────

  async function buscarUsuarios(query) {
    if (!user || !query || query.trim().length < 2) return []
    const limpio = query.trim().replace(/^@/, '')
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, nombre, foto_url')
      .ilike('username', `%${limpio}%`)
      .neq('id', user.id)
      .limit(10)
    if (error) {
      console.error('buscar usuarios error:', error)
      return []
    }
    return data
  }

  async function enviarSolicitud(destinatarioId) {
    if (!user) return { error: 'No estás logueado' }
    const { error } = await supabase.from('cafeteros').insert({
      solicitante_id: user.id,
      destinatario_id: destinatarioId,
      estado: 'pendiente',
    })
    if (error) {
      console.error('enviar solicitud error:', error)
      return { error }
    }
    return { ok: true }
  }

  async function responderSolicitud(solicitanteId, estado) {
    if (!user) return { error: 'No estás logueado' }
    if (estado === 'rechazada') {
      // Rechazar = borrar la fila (limpia, sin estados rotos)
      const { error } = await supabase
        .from('cafeteros')
        .delete()
        .eq('solicitante_id', solicitanteId)
        .eq('destinatario_id', user.id)
      if (error) console.error('rechazar solicitud error:', error)
      return { ok: !error, error }
    }
    // Aceptar
    const { error } = await supabase
      .from('cafeteros')
      .update({ estado: 'aceptada' })
      .eq('solicitante_id', solicitanteId)
      .eq('destinatario_id', user.id)
    if (error) console.error('aceptar solicitud error:', error)
    return { ok: !error, error }
  }

  async function cancelarSolicitud(destinatarioId) {
    if (!user) return { error: 'No estás logueado' }
    const { error } = await supabase
      .from('cafeteros')
      .delete()
      .eq('solicitante_id', user.id)
      .eq('destinatario_id', destinatarioId)
    if (error) console.error('cancelar solicitud error:', error)
    return { ok: !error, error }
  }

  async function eliminarCafetero(otroId) {
    if (!user) return { error: 'No estás logueado' }
    // El registro puede estar en cualquiera de las dos direcciones
    const { error } = await supabase
      .from('cafeteros')
      .delete()
      .or(
        `and(solicitante_id.eq.${user.id},destinatario_id.eq.${otroId}),` +
        `and(solicitante_id.eq.${otroId},destinatario_id.eq.${user.id})`
      )
    if (error) console.error('eliminar cafetero error:', error)
    return { ok: !error, error }
  }

  // Helpers para saber si ya hay relación con alguien
  function relacionCon(otroId) {
    if (state.confirmados.find((c) => c.id === otroId)) return 'confirmado'
    if (state.pendientesEnviadas.find((p) => p.id === otroId)) return 'enviada'
    if (state.pendientesRecibidas.find((p) => p.id === otroId)) return 'recibida'
    return null
  }

  return (
    <CafeterosContext.Provider
      value={{
        ...state,
        buscarUsuarios,
        enviarSolicitud,
        responderSolicitud,
        cancelarSolicitud,
        eliminarCafetero,
        relacionCon,
      }}
    >
      {children}
    </CafeterosContext.Provider>
  )
}

export function useCafeteros() {
  return useContext(CafeterosContext)
}
