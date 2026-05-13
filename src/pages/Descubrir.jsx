import { useState, useMemo } from 'react'
import cafes from '../data/cafes.json'
import historias from '../data/historias.js'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import CafeCardSmall from '../components/CafeCardSmall'
import CafeHistoriaCard from '../components/CafeHistoriaCard'
import EspecialidadModal from '../components/EspecialidadModal'
import { useFavoritos } from '../context/FavoritosContext'

const especialidades = [...new Set(cafes.map((c) => c.especialidad))]

export default function Descubrir() {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [especialidad, setEspecialidad] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { favoritos } = useFavoritos()
  const cafesFavoritos = cafes.filter((c) => favoritos.includes(c.id))

  const cafesFiltrados = useMemo(() => {
    return cafes.filter((c) => {
      const pasaBusqueda = c.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const pasaOcasion = filtro === 'todos' || c.ocasiones.includes(filtro)
      const pasaEspecialidad = especialidad === null || c.especialidad === especialidad
      return pasaBusqueda && pasaOcasion && pasaEspecialidad
    })
  }, [busqueda, filtro, especialidad])

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-1">Descubrir</h1>
      <p className="text-sm text-cafe-accent/70 mb-4">Centro Histórico de Quito</p>

      <SearchBar value={busqueda} onChange={setBusqueda} />

      <FilterBar
        activo={filtro}
        onChange={setFiltro}
        onEspecialidad={() => setModalOpen(true)}
      />

      {/* Cerca de ti */}
      <section className="mt-6">
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Cerca de ti 📍</h2>
        {cafesFiltrados.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory no-scrollbar">
            {cafesFiltrados.map((cafe) => (
              <CafeCardSmall key={cafe.id} cafe={cafe} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-cafe-accent/40 py-2">No hay cafeterías con este filtro aún.</p>
        )}
      </section>

      {/* Favoritos */}
      <section className="mt-8">
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Favoritos ❤️</h2>
        {cafesFavoritos.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory no-scrollbar">
            {cafesFavoritos.map((cafe) => (
              <CafeCardSmall key={cafe.id} cafe={cafe} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-cafe-accent/40 py-2">Toca el 🤍 en una cafetería para guardarla aquí.</p>
        )}
      </section>

      {/* Sobre el café ecuatoriano */}
      <section className="mt-8">
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Sobre el café ecuatoriano ☕</h2>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory no-scrollbar">
          {historias.map((h) => (
            <CafeHistoriaCard key={h.id} historia={h} />
          ))}
        </div>
      </section>

      {modalOpen && (
        <EspecialidadModal
          especialidades={especialidades}
          activa={especialidad}
          onChange={(v) => { setEspecialidad(v); setModalOpen(false) }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
