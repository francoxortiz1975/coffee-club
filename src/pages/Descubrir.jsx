import { useState, useMemo, useEffect } from 'react'
import cafes from '../data/cafes.json'
import historias from '../data/historias.js'
import FilterBar from '../components/FilterBar'
import AvatarButton from '../components/AvatarButton'
import DiscoverSwitch from '../components/DiscoverSwitch'
import NextPlan from '../components/NextPlan'
import CafeCardSmall from '../components/CafeCardSmall'
import CafeHistoriaCard from '../components/CafeHistoriaCard'
import EspecialidadModal from '../components/EspecialidadModal'
import InstallSteps from '../components/InstallSteps'
import { SearchIcon, CoffeeCupIcon } from '../components/Icons'
import { useFavoritos } from '../context/FavoritosContext'
import { useAuth } from '../context/AuthContext'
import { useCafeteros } from '../context/CafeterosContext'
import { supabase } from '../lib/supabase'

const especialidades = [...new Set(cafes.map((c) => c.especialidad))]

// Carrusel horizontal de cafés. No renderiza si la lista está vacía.
function CafesRow({ titulo, cafesList }) {
  if (!cafesList || cafesList.length === 0) return null
  return (
    <section className="mt-8 px-4">
      <h2 className="text-base font-display font-bold text-cafe-dark mb-3">{titulo}</h2>
      <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scroll-pl-4 pb-2 snap-x snap-mandatory no-scrollbar">
        {cafesList.map((cafe) => (
          <CafeCardSmall key={cafe.id} cafe={cafe} />
        ))}
      </div>
    </section>
  )
}

// Hook: trae los cafés que algún cafetero confirmado haya visitado.
function useCafesDeCafeteros() {
  const { user } = useAuth()
  const { confirmados } = useCafeteros()
  const [cafeIds, setCafeIds] = useState([])

  useEffect(() => {
    if (!user || confirmados.length === 0) {
      setCafeIds([])
      return
    }

    let activo = true
    const ids = confirmados.map((c) => c.id)

    async function load() {
      const { data, error } = await supabase
        .from('visitas')
        .select('cafe_id')
        .in('user_id', ids)
      if (error) { console.error('cafeteros visitas error:', error); return }
      if (activo) setCafeIds([...new Set(data.map((v) => v.cafe_id))])
    }
    load()
    return () => { activo = false }
  }, [user, confirmados])

  return cafeIds
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

  // Listas para cada row del modo discovery (sin filtros)
  const cafesFavoritos     = cafes.filter((c) => favoritos.includes(c.id))
  const cafesDeCafeteros   = cafes.filter((c) => cafeIdsDeCafeteros.includes(c.id))
  const cafesParaTrabajar  = cafes.filter((c) => c.ocasiones.includes('work'))
  const cafesRomantico     = cafes.filter((c) => c.ocasiones.includes('couple'))
  const cafesTuristico     = cafes.filter((c) => c.ocasiones.includes('tourist'))

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
          <CafesRow titulo="Near you" cafesList={cafes} />
          <CafesRow titulo="Visited by your coffee friends" cafesList={cafesDeCafeteros} />
          <CafesRow titulo="Favorites" cafesList={cafesFavoritos} />
          <CafesRow titulo="Something romantic" cafesList={cafesRomantico} />
          <CafesRow titulo="Good for working" cafesList={cafesParaTrabajar} />
          <CafesRow titulo="For sightseeing" cafesList={cafesTuristico} />

          {/* About Ecuadorian coffee */}
          <section className="mt-8 px-4">
            <h2 className="text-base font-display font-bold text-cafe-dark mb-3">About Ecuadorian coffee</h2>
            <div className="flex gap-3 overflow-x-auto -mx-4 px-4 scroll-pl-4 pb-2 snap-x snap-mandatory no-scrollbar">
              {historias.map((h) => (
                <CafeHistoriaCard key={h.id} historia={h} />
              ))}
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
