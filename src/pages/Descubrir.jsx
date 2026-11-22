import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { lessons } from '../data/journey'
import { buildShelves } from '../lib/shelves'
import { useCafesDeCafeteros } from '../lib/useCafesDeCafeteros'
import LessonCard from '../components/LessonCard'
import FilterBar from '../components/FilterBar'
import AvatarButton from '../components/AvatarButton'
import DiscoverSwitch from '../components/DiscoverSwitch'
import NextPlan from '../components/NextPlan'
import CafeCardSmall from '../components/CafeCardSmall'
import EspecialidadModal from '../components/EspecialidadModal'
import InstallSteps from '../components/InstallSteps'
import { SearchIcon, CoffeeCupIcon } from '../components/Icons'
import { useFavoritos } from '../context/FavoritosContext'

const especialidades = [...new Set(cafes.map((c) => c.especialidad))]

// Carrusel horizontal de cafés. No renderiza si la lista está vacía.
function CafesRow({ id, titulo, cafesList }) {
  if (!cafesList || cafesList.length === 0) return null
  return (
    <section className="mt-8 px-4">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="text-base font-display font-bold text-cafe-dark">{titulo}</h2>
        <Link to={`/shelf/${id}`} className="relative text-xs font-sans font-semibold text-cafe-accent before:absolute before:-inset-3 before:content-['']">See all ›</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scroll-pl-4 pb-2 snap-x snap-mandatory no-scrollbar">
        {cafesList.map((cafe) => (
          <CafeCardSmall key={cafe.id} cafe={cafe} />
        ))}
      </div>
    </section>
  )
}

export default function Descubrir() {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('todos')
  const [especialidad, setEspecialidad] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { favoritos } = useFavoritos()
  const cafeIdsDeCafeteros = useCafesDeCafeteros()

  // ¿Hay algún filtro/búsqueda activa? → modo flat list
  const filterActivo = busqueda.trim() !== '' || filtro !== 'todos' || especialidad !== null

  // Resultados con todos los filtros aplicados (solo se usa en modo filtro)
  const cafesFiltrados = useMemo(() => {
    return cafes.filter((c) => {
      const pasaBusqueda = c.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const pasaOcasion = filtro === 'todos' || c.ocasiones.includes(filtro)
      const pasaEspecialidad = especialidad === null || c.especialidad === especialidad
      return pasaBusqueda && pasaOcasion && pasaEspecialidad
    })
  }, [busqueda, filtro, especialidad])

  const shelves = buildShelves({ favoritos, friendCafeIds: cafeIdsDeCafeteros })

  return (
    <div className="pb-4">

      {/* Header con degradado café — se extiende 300px arriba del viewport. */}
      <div
        className="px-4 pb-4 rounded-b-3xl -mt-[300px]"
        style={{
          background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)',
          paddingTop: 'calc(316px + env(safe-area-inset-top))',
        }}
      >
        <div className="relative flex justify-center mb-3">
          <img src="/logo.png" alt="Sumay Coffee Club" className="h-20 w-auto object-contain" />
          <div className="absolute right-0 top-0"><AvatarButton dark /></div>
        </div>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-beige/60">
            <SearchIcon size={15} />
          </span>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Search coffee shops..."
            className="w-full bg-white/10 text-beige placeholder-beige/60 rounded-2xl pl-10 pr-4 min-h-11 text-base outline-none focus:bg-white/15 transition-colors"
          />
        </div>
      </div>

      <div className="px-4 mt-4"><DiscoverSwitch value="browse" /></div>
      <div className="px-4 mt-3 empty:hidden"><NextPlan /></div>

      {/* Filtros */}
      <div className="px-4 mt-4">
        <FilterBar
          activo={filtro}
          onChange={setFiltro}
          onEspecialidad={() => setModalOpen(true)}
        />
        {especialidad && (
          <button
            onClick={() => setEspecialidad(null)}
            className="mt-2 text-[11px] text-cafe-accent/70 underline"
          >
            Clear filter: {especialidad} ✕
          </button>
        )}
      </div>

      {filterActivo ? (
        /* ── MODO FILTRO ── grid plano con los resultados ──────── */
        <section className="mt-6 px-4">
          <h2 className="text-base font-display font-bold text-cafe-dark mb-3">
            Results {cafesFiltrados.length > 0 && `(${cafesFiltrados.length})`}
          </h2>
          {cafesFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {cafesFiltrados.map((cafe) => (
                <CafeCardSmall key={cafe.id} cafe={cafe} fullWidth />
              ))}
            </div>
          ) : (
            <div className="bg-[#faf4ec] rounded-2xl px-4 py-8 text-center">
              <CoffeeCupIcon size={32} className="text-cafe-accent/30 mx-auto mb-3" />
              <p className="text-sm font-sans font-bold text-cafe-dark mb-1">
                No matches
              </p>
              <p className="text-xs text-cafe-accent/60">
                Try another occasion, specialty, or a different name.
              </p>
            </div>
          )}
        </section>
      ) : (
        /* ── MODO DISCOVERY ── rows curados ──────────────────── */
        <>
          {shelves.map((s) => <CafesRow key={s.id} id={s.id} titulo={s.title} cafesList={s.cafes} />)}

          {/* Teaser for the Journey mode */}
          <section className="mt-8 px-4">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-base font-display font-bold text-cafe-dark">Coffee journey</h2>
              <Link to="/journey" className="relative text-xs font-sans font-semibold text-cafe-accent before:absolute before:-inset-3 before:content-['']">Open ›</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scroll-pl-4 pb-2 snap-x snap-mandatory no-scrollbar">
              {lessons.slice(0, 6).map((l) => <LessonCard key={l.id} lesson={l} variant="mini" />)}
            </div>
          </section>

          <InstallSteps />
        </>
      )}

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
