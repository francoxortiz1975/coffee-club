import { useState, useMemo } from 'react'
import cafes from '../data/cafes.json'
import historias from '../data/historias.js'
import FilterBar from '../components/FilterBar'
import CafeCardSmall from '../components/CafeCardSmall'
import CafeHistoriaCard from '../components/CafeHistoriaCard'
import EspecialidadModal from '../components/EspecialidadModal'
import InstallSteps from '../components/InstallSteps'
import { SearchIcon } from '../components/Icons'
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
    <div className="pb-4">

      {/* Header con degradado café — se extiende 300px arriba del viewport.
          pt = 300 (mt negativo) + 48 (espacio visual estándar) + notch */}
      <div
        className="px-4 pb-4 rounded-b-3xl -mt-[300px]"
        style={{
          background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)',
          paddingTop: 'calc(348px + env(safe-area-inset-top))',
        }}
      >
        <div className="flex justify-center mb-3">
          <img src="/logo.png" alt="Sumay Coffee Club" className="h-20 w-auto object-contain" />
        </div>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-beige/30">
            <SearchIcon size={15} />
          </span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar cafetería..."
            className="w-full bg-white/10 text-beige placeholder-beige/30 rounded-2xl pl-9 pr-4 py-2.5 text-sm outline-none focus:bg-white/15 transition-colors"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 mt-4">
        <FilterBar
          activo={filtro}
          onChange={setFiltro}
          onEspecialidad={() => setModalOpen(true)}
        />
      </div>

      {/* Cerca de ti */}
      <section className="mt-6 px-4">
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Cerca de ti</h2>
        {cafesFiltrados.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scroll-pl-4 pb-2 snap-x snap-mandatory no-scrollbar">
            {cafesFiltrados.map((cafe) => (
              <CafeCardSmall key={cafe.id} cafe={cafe} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-cafe-accent/40 py-2">No hay cafeterias con este filtro.</p>
        )}
      </section>

      {/* Favoritos */}
      <section className="mt-8 px-4">
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Favoritos</h2>
        {cafesFavoritos.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scroll-pl-4 pb-2 snap-x snap-mandatory no-scrollbar">
            {cafesFavoritos.map((cafe) => (
              <CafeCardSmall key={cafe.id} cafe={cafe} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-cafe-accent/40 py-2">Guarda tus cafeterias favoritas con el corazon.</p>
        )}
      </section>

      {/* Sobre el café ecuatoriano */}
      <section className="mt-8 px-4">
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Sobre el café ecuatoriano</h2>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scroll-pl-4 pb-2 snap-x snap-mandatory no-scrollbar">
          {historias.map((h) => (
            <CafeHistoriaCard key={h.id} historia={h} />
          ))}
        </div>
      </section>

      {/* Instalar app */}
      <InstallSteps />

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
