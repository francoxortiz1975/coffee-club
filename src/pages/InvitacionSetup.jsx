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
  const [incluirFecha, setIncluirFecha] = useState(null)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  if (!cafe) return null

  function generar() {
    const nombreFinal = nombre.trim()
    const receptorFinal = receptor.trim()
    const fechaFinal = incluirFecha && fecha ? fecha : ''
    const horaFinal = incluirFecha && hora ? hora : ''

    agregarEnviada({ cafeId: id, nombre: nombreFinal, receptor: receptorFinal, fecha: fechaFinal, hora: horaFinal })

    const params = new URLSearchParams()
    if (nombreFinal) params.set('nombre', nombreFinal)
    if (receptorFinal) params.set('para', receptorFinal)
    if (fechaFinal) params.set('fecha', fechaFinal)
    if (horaFinal) params.set('hora', horaFinal)
    navigate(`/invitacion/${id}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col px-5 pt-12 pb-8">
      <button onClick={() => navigate(-1)} className="text-cafe-accent/50 mb-8 self-start">
        <ArrowLeftIcon size={20} />
      </button>

      <p className="text-xs text-cafe-accent/50 uppercase tracking-widest mb-2">Invitación para</p>
      <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-8">{cafe.nombre}</h1>

      {/* De / Para */}
      <div className="mb-2">
        <label className="text-[11px] uppercase tracking-widest text-cafe-accent/50 block mb-1.5">De</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre (opcional)"
          className="w-full bg-white border border-cafe-accent/20 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/50 mb-4"
        />

        <label className="text-[11px] uppercase tracking-widest text-cafe-accent/50 block mb-1.5">Para</label>
        <input
          type="text"
          value={receptor}
          onChange={(e) => setReceptor(e.target.value)}
          placeholder="Nombre del invitado (opcional)"
          className="w-full bg-white border border-cafe-accent/20 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/50 mb-6"
        />
      </div>

      {/* Fecha */}
      {true && (
        <div className="transition-all duration-300">
          <p className="text-sm font-medium text-cafe-dark mb-3">¿Quieres incluir fecha y hora?</p>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setIncluirFecha(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${incluirFecha === true ? 'bg-cafe-dark text-beige border-cafe-dark' : 'border-cafe-accent/25 text-cafe-accent'}`}
            >
              Sí
            </button>
            <button
              onClick={() => { setIncluirFecha(false); setFecha(''); setHora('') }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${incluirFecha === false ? 'bg-cafe-dark text-beige border-cafe-dark' : 'border-cafe-accent/25 text-cafe-accent'}`}
            >
              No
            </button>
          </div>
          {incluirFecha && (
            <div className="flex gap-3 mb-6">
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="flex-1 bg-white border border-cafe-accent/20 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/50"
              />
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="flex-1 bg-white border border-cafe-accent/20 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/50"
              />
            </div>
          )}
        </div>
      )}

      {/* Botón generar */}
      {incluirFecha !== null && (
        <button
          onClick={generar}
          className="mt-auto w-full bg-cafe-dark text-beige text-sm font-bold py-4 rounded-2xl active:scale-95 transition-transform"
        >
          Generar invitación
        </button>
      )}
    </div>
  )
}
