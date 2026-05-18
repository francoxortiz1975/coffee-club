import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { migrateLocalToSupabase } from '../lib/migrate'

// Cuando el user se loguea por primera vez en este device, importa lo que
// tenga en localStorage (favoritos, visitas, invitaciones, perfil) a Supabase.
// Idempotente: corre una sola vez por device + cuenta.
// Si migra algo, muestra un toast chiquito por 4 segundos.
export default function MigrationRunner() {
  const { user, cargando } = useAuth()
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (cargando || !user) return
    let cancelado = false

    migrateLocalToSupabase(user.id).then((reporte) => {
      if (cancelado || reporte.skipped) return
      const total = reporte.profile + reporte.favoritos + reporte.visitas + reporte.invitaciones
      if (total === 0) return
      const partes = []
      if (reporte.favoritos) partes.push(`${reporte.favoritos} favoritos`)
      if (reporte.visitas) partes.push(`${reporte.visitas} visitas`)
      if (reporte.invitaciones) partes.push(`${reporte.invitaciones} invitaciones`)
      if (reporte.profile) partes.push('preferencias')
      setToast(`Importamos ${partes.join(', ')} a tu cuenta`)
      setTimeout(() => setToast(null), 4500)
    })

    return () => { cancelado = true }
  }, [user, cargando])

  if (!toast) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-[70] max-w-md mx-auto bg-cafe-dark text-beige rounded-2xl px-4 py-3 shadow-2xl animate-[fadeUp_0.4s_ease] flex items-center gap-3">
      <div className="text-xl shrink-0">☕</div>
      <p className="text-xs leading-snug flex-1">{toast}</p>
    </div>
  )
}
