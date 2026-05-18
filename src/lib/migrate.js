import { supabase } from './supabase'

// Marca de "ya migré este device a Supabase". Una sola vez por device + cuenta.
const FLAG_KEY = 'samay_migrated_v1'

// Importa lo que haya en localStorage al schema de Supabase para el user actual.
// Idempotente: si ya corrió antes, no hace nada.
// Silencioso: si algo falla, loguea y sigue. Nunca rompe el UX.
export async function migrateLocalToSupabase(userId) {
  if (localStorage.getItem(FLAG_KEY)) {
    return { skipped: true }
  }

  const reporte = { profile: 0, favoritos: 0, visitas: 0, invitaciones: 0, errores: [] }

  // ─── Profile (preferencias del usuario anonymous) ─────────
  try {
    const local = JSON.parse(localStorage.getItem('samay_usuario') || 'null')
    if (local) {
      const updates = {}
      // No tocar el nombre default — solo si el user customizó
      if (local.nombre && !/^(Cafetero|Catador|Bohemio|Buscador|Amante) /i.test(local.nombre)) {
        updates.nombre = local.nombre
      }
      if (local.username) updates.username = local.username
      if (local.cafeFavorito) updates.cafe_favorito = local.cafeFavorito
      if (local.cafeteriaFavoritaId) updates.cafeteria_favorita_id = local.cafeteriaFavoritaId

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.from('profiles').update(updates).eq('id', userId)
        if (error) {
          // Username puede chocar con otro user. Reintentamos sin username.
          if (error.code === '23505' && updates.username) {
            delete updates.username
            const { error: e2 } = await supabase.from('profiles').update(updates).eq('id', userId)
            if (e2) reporte.errores.push(`profile: ${e2.message}`)
            else reporte.profile = 1
          } else {
            reporte.errores.push(`profile: ${error.message}`)
          }
        } else {
          reporte.profile = 1
        }
      }
    }
  } catch (e) {
    reporte.errores.push(`profile parse: ${e.message}`)
  }

  // ─── Favoritos ────────────────────────────────────────────
  try {
    const local = JSON.parse(localStorage.getItem('samay_favoritos') || '[]')
    if (Array.isArray(local) && local.length > 0) {
      const rows = local.map((cafe_id) => ({ user_id: userId, cafe_id }))
      const { error } = await supabase
        .from('favoritos')
        .upsert(rows, { onConflict: 'user_id,cafe_id', ignoreDuplicates: true })
      if (error) reporte.errores.push(`favoritos: ${error.message}`)
      else reporte.favoritos = rows.length
    }
  } catch (e) {
    reporte.errores.push(`favoritos parse: ${e.message}`)
  }

  // ─── Visitas ──────────────────────────────────────────────
  try {
    const local = JSON.parse(localStorage.getItem('samay_visitas') || '[]')
    if (Array.isArray(local) && local.length > 0) {
      const rows = local.map((cafe_id) => ({ user_id: userId, cafe_id }))
      const { error } = await supabase
        .from('visitas')
        .upsert(rows, { onConflict: 'user_id,cafe_id', ignoreDuplicates: true })
      if (error) reporte.errores.push(`visitas: ${error.message}`)
      else reporte.visitas = rows.length
    }
  } catch (e) {
    reporte.errores.push(`visitas parse: ${e.message}`)
  }

  // ─── Invitaciones (solo enviadas) ─────────────────────────
  // Las recibidas locales no tienen emisor real → no se pueden migrar.
  try {
    const local = JSON.parse(localStorage.getItem('samay_invitaciones') || '{}')
    if (Array.isArray(local?.enviadas) && local.enviadas.length > 0) {
      const rows = local.enviadas.map((inv) => ({
        emisor_id: userId,
        cafe_id: inv.cafeId,
        receptor_nombre: inv.receptor || null,
        fecha_cita: inv.fecha || null,
        hora_cita: inv.hora || null,
      }))
      const { error } = await supabase.from('invitaciones').insert(rows)
      if (error) reporte.errores.push(`invitaciones: ${error.message}`)
      else reporte.invitaciones = rows.length
    }
  } catch (e) {
    reporte.errores.push(`invitaciones parse: ${e.message}`)
  }

  // Marcar el device como migrado (con timestamp por debug)
  localStorage.setItem(FLAG_KEY, new Date().toISOString())

  if (reporte.errores.length > 0) {
    console.warn('migrate: con errores', reporte)
  } else {
    const total = reporte.profile + reporte.favoritos + reporte.visitas + reporte.invitaciones
    if (total > 0) console.log('migrate: ok', reporte)
  }

  return reporte
}
