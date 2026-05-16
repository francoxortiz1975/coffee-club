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

  const [incluirNombre, setIncluirNombre] = useState(null)
  const [nombre, setNombre] = useState('')
  const [incluirFecha, setIncluirFecha] = useState(null)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  if (!cafe) return null

  const paso = incluirNombre === null ? 1 : incluirFecha === null ? 2 : 3

  function generar() {
    const nombreFinal = incluirNombre && nombre.trim() ? nombre.trim() : ''
    const fechaFinal = incluirFecha && fecha ? fecha : ''
    const horaFinal = incluirFecha && hora ? hora : ''

    agregarEnviada({ cafeId: id, nombre: nombreFinal, fecha: fechaFinal, hora: horaFinal })

    const params = new URLSearchParams()
    if (nombreFinal) params.set('nombre', nombreFinal)
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

      {/* Paso 1 — nombre */}
      <div className={`transition-all duration-300 ${paso >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <p className="text-sm font-medium text-cafe-dark mb-3">¿Quieres incluir tu nombre?</p>
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setIncluirNombre(true)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${incluirNombre === true ? 'bg-cafe-dark text-beige border-cafe-dark' : 'border-cafe-accent/25 text-cafe-accent'}`}
          >
            Sí
          </button>
          <button
            onClick={() => { setIncluirNombre(false); setNombre('') }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${incluirNombre === false ? 'bg-cafe-dark text-beige border-cafe-dark' : 'border-cafe-accent/25 text-cafe-accent'}`}
          >
            No
          </button>
        </div>
        {incluirNombre && (
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className="w-full bg-white border border-cafe-accent/20 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/50 mb-6"
            autoFocus
          />
        )}
      </div>

      {/* Paso 2 — fecha */}
      {incluirNombre !== null && (
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
      {incluirNombre !== null && incluirFecha !== null && (
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
