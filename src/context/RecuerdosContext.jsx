import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { compressImage } from '../lib/compressImage'

const RecuerdosContext = createContext()
const BUCKET = 'recuerdos'

async function loadRecuerdos(userId) {
  const { data, error } = await supabase
    .from('recuerdos')
    .select('cafe_id, foto_url, nota, fecha')
    .eq('user_id', userId)
  if (error) {
    console.error('recuerdos load error:', error)
    return {}
  }
  // Devolvemos un mapa por cafe_id para lookup rápido
  const mapa = {}
  for (const r of data) mapa[r.cafe_id] = r
  return mapa
}

export function RecuerdosProvider({ children }) {
  const { user, cargando: authCargando } = useAuth()
  const [recuerdos, setRecuerdos] = useState({}) // { [cafe_id]: { foto_url, nota, fecha } }

  useEffect(() => {
    if (authCargando) return

    if (!user) {
      setRecuerdos({})
      return
    }

    let activo = true

    async function refresh() {
      if (!activo) return
      const data = await loadRecuerdos(user.id)
      if (activo) setRecuerdos(data)
    }
    refresh()

    const channel = supabase
      .channel(`recuerdos-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recuerdos', filter: `user_id=eq.${user.id}` },
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

  function getRecuerdo(cafeId) {
    return recuerdos[cafeId] ?? null
  }

  // Sube/reemplaza la foto y guarda/actualiza la row.
  // file: File (opcional — si no hay, solo actualiza la nota)
  // nota: string (opcional)
  async function guardarRecuerdo(cafeId, { file, nota }) {
    if (!user) return { error: 'no-auth' }

    let foto_url = recuerdos[cafeId]?.foto_url ?? null

    if (file) {
      // 1) Comprimir
      const blob = await compressImage(file, { max: 1200, quality: 0.78 })

      // 2) Subir a Storage. Path: {user_id}/{cafe_id}.jpg
      // upsert: true sobrescribe si ya existe
      const path = `${user.id}/${cafeId}.jpg`
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        })
      if (upErr) {
        console.error('upload error:', upErr)
        return { error: upErr }
      }

      // 3) URL pública. Agregamos timestamp como cache-buster para que se vea
      // la nueva foto cuando reemplaza.
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
      foto_url = `${urlData.publicUrl}?v=${Date.now()}`
    }

    // 4) Upsert de la row
    const payload = {
      user_id: user.id,
      cafe_id: cafeId,
      foto_url,
      nota: nota?.trim() || null,
      fecha: new Date().toISOString(),
    }
    const { error: dbErr } = await supabase
      .from('recuerdos')
      .upsert(payload, { onConflict: 'user_id,cafe_id' })
    if (dbErr) {
      console.error('recuerdos upsert error:', dbErr)
      return { error: dbErr }
    }

    return { ok: true, foto_url }
  }

  async function eliminarRecuerdo(cafeId) {
    if (!user) return { error: 'no-auth' }
    // Borrar storage
    const path = `${user.id}/${cafeId}.jpg`
    await supabase.storage.from(BUCKET).remove([path])
    // Borrar row
    const { error } = await supabase
      .from('recuerdos')
      .delete()
      .eq('user_id', user.id)
      .eq('cafe_id', cafeId)
    if (error) {
      console.error('recuerdos delete error:', error)
      return { error }
    }
    return { ok: true }
  }

  return (
    <RecuerdosContext.Provider value={{ recuerdos, getRecuerdo, guardarRecuerdo, eliminarRecuerdo }}>
      {children}
    </RecuerdosContext.Provider>
  )
}

export function useRecuerdos() {
  return useContext(RecuerdosContext)
}
