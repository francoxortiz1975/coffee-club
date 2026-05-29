import { useState, useMemo, useEffect } from 'react'
import cafes from '../data/cafes.json'
import historias from '../data/historias.js'
import FilterBar from '../components/FilterBar'
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
      <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">{titulo}</h2>
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
  const cafesRomantico     = cafes.filter((c) => c.ocasiones.includes('pareja'))
  const cafesTuristico     = cafes.filter((c) => c.ocasiones.includes('turístico'))

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
        {especialidad && (
          <button
            onClick={() => setEspecialidad(null)}
            className="mt-2 text-[11px] text-cafe-accent/70 underline"
          >
            Quitar filtro: {especialidad} ✕
          </button>
        )}
      </div>

      {filterActivo ? (
        /* ── MODO FILTRO ── grid plano con los resultados ──────── */
        <section className="mt-6 px-4">
          <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">
            Resultados {cafesFiltrados.length > 0 && `(${cafesFiltrados.length})`}
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
              <p className="text-sm font-serif font-bold text-cafe-dark mb-1">
                Sin coincidencias
              </p>
              <p className="text-xs text-cafe-accent/60">
                Probá con otra ocasión, especialidad, o un nombre distinto.
              </p>
            </div>
          )}
        </section>
      ) : (
        /* ── MODO DISCOVERY ── rows curados ──────────────────── */
        <>
          <CafesRow titulo="Cerca de ti" cafesList={cafes} />
          <CafesRow titulo="Tus cafeteros visitaron" cafesList={cafesDeCafeteros} />
          <CafesRow titulo="Favoritos" cafesList={cafesFavoritos} />
          <CafesRow titulo="Algo romántico" cafesList={cafesRomantico} />
          <CafesRow titulo="Pa trabajar" cafesList={cafesParaTrabajar} />
          <CafesRow titulo="Para turistear" cafesList={cafesTuristico} />

          {/* Sobre el café ecuatoriano */}
          <section className="mt-8 px-4">
            <h2 className="text-base font-serif font-bold text-cafe-dark mb-3">Sobre el café ecuatoriano</h2>
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
