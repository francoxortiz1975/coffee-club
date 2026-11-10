import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { ArrowLeftIcon } from '../components/Icons'
import { useInvitaciones } from '../context/InvitacionesContext'

export default function InvitacionSetup() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cafe = cafes.find((c) => c.id === id)
  const { agregarEnviada } = useInvitaciones()

  const [nombre, setNombre] = useState('')
  const [receptor, setReceptor] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  if (!cafe) return null

  function generar() {
    const nombreFinal = nombre.trim()
    const receptorFinal = receptor.trim()
    const fechaFinal = fecha
    const horaFinal = hora

    agregarEnviada({ cafeId: id, nombre: nombreFinal, receptor: receptorFinal, fecha: fechaFinal, hora: horaFinal })

    const params = new URLSearchParams()
    if (nombreFinal) params.set('nombre', nombreFinal)
    if (receptorFinal) params.set('para', receptorFinal)
    if (fechaFinal) params.set('fecha', fechaFinal)
    if (horaFinal) params.set('hora', horaFinal)
    navigate(`/invitacion/${id}?${params.toString()}`)
  }

  const inputClass = 'w-full bg-transparent border border-cafe-accent/25 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60 mb-5'
  const labelClass = 'text-lg font-display font-bold text-cafe-dark block mb-1.5'

  return (
    <div
      className="min-h-screen flex flex-col px-5 pb-8"
      style={{ paddingTop: 'calc(16px + env(safe-area-inset-top))' }}
    >
      <button onClick={() => navigate(-1)} className="text-cafe-accent/50 mb-8 self-start">
        <ArrowLeftIcon size={20} />
      </button>

      <p className="text-xs text-cafe-accent/50 uppercase tracking-widest mb-2">Invitation to</p>
      <h1 className="text-2xl font-display font-bold text-cafe-dark mb-8">{cafe.nombre}</h1>

      <label className={labelClass}>From</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Your name (optional)"
        className={inputClass}
      />

      <label className={labelClass}>To</label>
      <input
        type="text"
        value={receptor}
        onChange={(e) => setReceptor(e.target.value)}
        placeholder="Guest's name (optional)"
        className={inputClass}
      />

      <label className={labelClass}>Date</label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className={inputClass}
      />

      <label className={labelClass}>Time</label>
      <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        className={inputClass}
      />

      <button
        onClick={generar}
        className="mt-auto w-full bg-cafe-dark text-beige text-sm font-bold py-4 rounded-2xl active:scale-95 transition-transform"
      >
        Create invitation
      </button>
    </div>
  )
}
