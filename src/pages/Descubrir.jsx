import { useState, useMemo } from 'react'
import cafes from '../data/cafes.json'
import historias from '../data/historias.js'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'
import CafeCard from '../components/CafeCard'
import CafeCardSmall from '../components/CafeCardSmall'
import CafeHistoriaCard from '../components/CafeHistoriaCard'
import EspecialidadModal from '../components/EspecialidadModal'

const especialidades = [...new Set(cafes.map((c) => c.especialidad))]

export default function Descubrir() {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [especialidad, setEspecialidad] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [favoritos, setFavoritos] = useState([])

  function toggleFavorito(id) {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const cafesFiltrados = useMemo(() => {
    return cafes.filter((c) => {
      const pasaBusqueda = c.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const pasaOcasion = filtro === 'todos' || c.ocasiones.includes(filtro)
      const pasaEspecialidad = especialidad === null || c.especialidad === especialidad
      return pasaBusqueda && pasaOcasion && pasaEspecialidad
    })
  }, [busqueda, filtro, especialidad])

  const cafesFavoritos = cafes.filter((c) => favoritos.includes(c.id))

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-1">Descubrir</h1>
      <p className="text-sm text-cafe-accent/70 mb-4">Centro Histórico de Quito</p>

      {/* Búsqueda */}
      <SearchBar value={busqueda} onChange={setBusqueda} />

      {/* Filtros */}
      <FilterBar
        activo={filtro}
        onChange={setFiltro}
        onEspecialidad={() => setModalOpen(true)}
      />

      {/* Cerca de ti */}
      <section className="mt-6">
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Cerca de ti</h2>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory no-scrollbar">
          {cafes.map((cafe) => (
            <CafeCardSmall
              key={cafe.id}
              cafe={cafe}
              favorito={favoritos.includes(cafe.id)}
              onToggleFavorito={toggleFavorito}
            />
          ))}
        </div>
      </section>

      {/* Favoritos */}
      <section className="mt-6">
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Favoritos ❤️</h2>
        {cafesFavoritos.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 snap-x snap-mandatory no-scrollbar">
            {cafesFavoritos.map((cafe) => (
              <CafeCardSmall
                key={cafe.id}
                cafe={cafe}
                favorito={true}
                onToggleFavorito={toggleFavorito}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-cafe-accent/40 py-2">
            Toca el 🤍 en una cafetería para guardarla aquí.
          </p>
        )}
      </section>

      {/* Lista principal */}
      <section className="mt-6">
        <div className="flex flex-col gap-4">
          {cafesFiltrados.length > 0 ? (
            cafesFiltrados.map((cafe) => (
              <CafeCard
                key={cafe.id}
                cafe={cafe}
                favorito={favoritos.includes(cafe.id)}
                onToggleFavorito={toggleFavorito}
              />
            ))
          ) : (
            <p className="text-center text-cafe-accent/50 text-sm mt-6">
              No hay cafeterías con este filtro aún.
            </p>
          )}
        </div>
      </section>

      {/* Sobre el café */}
      <section className="mt-8">
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Sobre el café ☕</h2>
        <div className="flex flex-col gap-3">
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
