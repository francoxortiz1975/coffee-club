import { useState, useMemo } from 'react'
import cafes from '../data/cafes.json'
import CafeCard from '../components/CafeCard'
import FilterBar from '../components/FilterBar'
import EspecialidadModal from '../components/EspecialidadModal'

const especialidades = [...new Set(cafes.map((c) => c.especialidad))]

export default function Descubrir() {
  const [filtro, setFiltro] = useState('todos')
  const [especialidad, setEspecialidad] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const cafesFiltrados = useMemo(() => {
    return cafes.filter((c) => {
      const pasaOcasion = filtro === 'todos' || c.ocasiones.includes(filtro)
      const pasaEspecialidad = especialidad === null || c.especialidad === especialidad
      return pasaOcasion && pasaEspecialidad
    })
  }, [filtro, especialidad])

  function handleEspecialidad(valor) {
    setEspecialidad(valor)
    setModalOpen(false)
  }

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-1">Descubrir</h1>
      <p className="text-sm text-cafe-accent/70 mb-4">Centro Histórico de Quito</p>

      <FilterBar
        activo={filtro}
        onChange={setFiltro}
        onEspecialidad={() => setModalOpen(true)}
      />

      <div className="flex flex-col gap-4 mt-5">
        {cafesFiltrados.length > 0 ? (
          cafesFiltrados.map((cafe) => <CafeCard key={cafe.id} cafe={cafe} />)
        ) : (
          <p className="text-center text-cafe-accent/50 text-sm mt-10">
            No hay cafeterías con este filtro aún.
          </p>
        )}
      </div>

      {modalOpen && (
        <EspecialidadModal
          especialidades={especialidades}
          activa={especialidad}
          onChange={handleEspecialidad}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
