import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useCityCafes } from '../lib/city'
import CitySwitch from '../components/CitySwitch'
import { buildShelves } from '../lib/shelves'
import { useCafesDeCafeteros } from '../lib/useCafesDeCafeteros'
import JourneyFeed from '../components/JourneyFeed'
import '../components/slurpTag.css'
import FilterBar from '../components/FilterBar'
import AvatarButton from '../components/AvatarButton'
import NextPlan from '../components/NextPlan'
import CafeCardSmall from '../components/CafeCardSmall'
import EspecialidadModal from '../components/EspecialidadModal'
import InstallSteps from '../components/InstallSteps'
import { SearchIcon, CoffeeCupIcon, DiceIcon } from '../components/Icons'
import { useFavoritos } from '../context/FavoritosContext'

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
  const cafes = useCityCafes()
  const especialidades = useMemo(() => [...new Set(cafes.map((c) => c.especialidad).filter(Boolean))], [cafes])
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
  }, [cafes, busqueda, filtro, especialidad])

  const shelves = buildShelves({ cafes, favoritos, friendCafeIds: cafeIdsDeCafeteros })

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
          <div className="absolute left-0 top-0"><CitySwitch dark /></div>
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

          {/* Can't decide? Two separate cards: swipe through the book, or let the app pick at random */}
          <section className="mt-8 px-4">
            <h2 className="text-base font-display font-bold text-cafe-dark mb-3">Can’t decide?</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/decidir/swipe" className="aspect-[4/5] rounded-3xl overflow-hidden shadow-md active:scale-[0.98] transition-transform flex items-center justify-center p-3" style={{ background: "url('/texture-bg.webp') center/cover" }}>
                <div className="flex flex-col items-center gap-3 bg-[#2a1510]/85 backdrop-blur-md rounded-2xl px-4 py-5 text-beige text-center">
                  <svg width="52" height="30" viewBox="0 0 64 36" fill="none" aria-hidden="true">
                    <path d="M22 6 L10 18 L22 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M42 6 L54 18 L42 30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <p className="text-xl font-display font-bold tracking-tight">Swipe</p>
                    <p className="text-xs text-beige/80 mt-0.5 font-sans">Interested or not</p>
                  </div>
                </div>
              </Link>
              <Link to="/decidir/aleatorio" className="aspect-[4/5] rounded-3xl shadow-md active:scale-[0.98] transition-transform flex flex-col items-center justify-center gap-3 text-beige text-center p-3" style={{ background: 'linear-gradient(160deg, #4a2c1a 0%, #2a1510 60%, #1e0f0b 100%)' }}>
                <DiceIcon size={44} className="opacity-85" />
                <div>
                  <p className="text-xl font-display font-bold tracking-tight">Random</p>
                  <p className="text-xs text-beige/80 mt-0.5 font-sans">One coffee shop, at random</p>
                </div>
              </Link>
            </div>
          </section>

          <InstallSteps />

          {/* The journey starts where the shelves end, and never stops */}
          <div className="mt-10 pb-28 text-cafe-dark">
            <JourneyFeed />
          </div>
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
