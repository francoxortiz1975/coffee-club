import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { migrateLocalToSupabase, hasLocalDataToMigrate } from '../lib/migrate'

// Cuando el user se loguea por primera vez en este device, importa lo que
// tenga en localStorage (favoritos, visitas, invitaciones, perfil) a Supabase.
// Idempotente: corre una sola vez por device + cuenta.
// UX:
//  - Si hay data para migrar → overlay 'Guardando tus datos…' mientras corre
//  - Al terminar → mensaje de éxito por 4s
//  - Si no había nada → no muestra nada
export default function MigrationRunner() {
  const { user, cargando } = useAuth()
  const [estado, setEstado] = useState({ tipo: 'oculto', mensaje: '' })

  useEffect(() => {
    if (cargando || !user) return
    if (!hasLocalDataToMigrate()) return

    let cancelado = false
    setEstado({ tipo: 'cargando', mensaje: 'Guardando tus datos…' })

    migrateLocalToSupabase(user.id).then((reporte) => {
      if (cancelado) return
      const total = reporte.profile + reporte.favoritos + reporte.visitas + reporte.invitaciones
      if (total === 0) {
        setEstado({ tipo: 'oculto', mensaje: '' })
        return
      }
      const partes = []
      if (reporte.favoritos) partes.push(`${reporte.favoritos} favoritos`)
      if (reporte.visitas) partes.push(`${reporte.visitas} visitas`)
      if (reporte.invitaciones) partes.push(`${reporte.invitaciones} invitaciones`)
      if (reporte.profile) partes.push('tus preferencias')
      setEstado({ tipo: 'exito', mensaje: `Importamos ${partes.join(', ')} a tu cuenta` })
      setTimeout(() => {
        if (!cancelado) setEstado({ tipo: 'oculto', mensaje: '' })
      }, 4500)
    })

    return () => { cancelado = true }
  }, [user, cargando])

  if (estado.tipo === 'oculto') return null

  if (estado.tipo === 'cargando') {
    return (
      <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center px-6">
        <div className="bg-[#faf4ec] rounded-3xl px-8 py-7 max-w-xs w-full shadow-2xl flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-cafe-dark font-serif font-bold text-lg text-center">
            {estado.mensaje}
          </p>
          <p className="text-xs text-cafe-accent/60 text-center leading-relaxed">
            Sincronizando con tu cuenta. Toma solo un momento.
          </p>
        </div>
      </div>
    )
  }

  // éxito (toast top-banner)
  return (
    <div className="fixed top-4 left-4 right-4 z-[70] max-w-md mx-auto bg-cafe-dark text-beige rounded-2xl px-4 py-3 shadow-2xl animate-[fadeUp_0.4s_ease] flex items-center gap-3">
      <div className="text-2xl shrink-0">☕</div>
      <p className="text-xs leading-snug flex-1">{estado.mensaje}</p>
    </div>
  )
}

function Spinner() {
  return (
    <div className="w-10 h-10 rounded-full border-[3px] border-cafe-accent/20 border-t-cafe-dark animate-spin" />
  )
}
