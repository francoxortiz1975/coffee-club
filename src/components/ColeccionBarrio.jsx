import { useState } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useVisitas } from '../context/VisitasContext'
import { useRecuerdos } from '../context/RecuerdosContext'
import RecuerdoModal from './RecuerdoModal'
import { BeanRow } from './LoyaltyCard'
import { CoffeeCupIcon, CoffeeBeanIcon, CameraIcon } from './Icons'

// One neighborhood: how many of its cafés you visited, and tap a bean to mark a visit.
export default function ColeccionBarrio({ barrio }) {
  const [abierto, setAbierto] = useState(false)
  const [recuerdoCafe, setRecuerdoCafe] = useState(null)
  const [promptCafe, setPromptCafe] = useState(null) // café recién marcado → "¿agregar foto?"
  const { visitas, toggleVisita } = useVisitas()
  const { getRecuerdo } = useRecuerdos()
  const cafesBarrio = cafes.filter((c) => c.barrio === barrio)
  const visitados = cafesBarrio.filter((c) => visitas.includes(c.id)).length

  // Tap en el bean del slot:
  //  - si estaba visitado → desmarca directo, sin prompt
  //  - si no estaba visitado y NO hay recuerdo → marca + abre prompt 'agregar recuerdo'
  //  - si no estaba visitado y SÍ hay recuerdo guardado → solo marca, sin prompt
  async function handleBeanTap(cafe, visitado, e) {
    e.preventDefault()
    e.stopPropagation()
    if (visitado) {
      await toggleVisita(cafe.id)
      return
    }
    await toggleVisita(cafe.id)
    if (!getRecuerdo(cafe.id)) {
      setPromptCafe(cafe)
    }
  }

  return (
    <div className="bg-[#faf4ec] rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="text-left">
          <p className="text-sm font-sans font-bold text-cafe-dark">{barrio}</p>
          <p className="text-xs text-cafe-accent/50 mt-0.5">{visitados} / {cafesBarrio.length} visited</p>
        </div>
        <span className={`text-cafe-accent/40 transition-transform text-xs ${abierto ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* One small bean per café of the barrio: a 3D bean once visited, a stitched outline until then */}
      <div className="px-4 pb-3">
        <BeanRow items={cafesBarrio.map((c) => ({ id: c.id, visited: visitas.includes(c.id), title: c.nombre }))} />
      </div>

      {abierto && (
        <div className="grid grid-cols-3 gap-3 p-4">
          {cafesBarrio.map((cafe) => {
            const visitado = visitas.includes(cafe.id)
            const recuerdo = getRecuerdo(cafe.id)
            const cafeFoto = cafe.fotos?.[0]
            // Si está visitado y hay recuerdo + foto del café → crossfade
            const conCrossfade = visitado && recuerdo?.foto_url && cafeFoto
            return (
              <Link key={cafe.id} to={`/cafe/${cafe.id}`} className="flex flex-col items-center gap-1.5">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-cafe-accent/10 flex items-center justify-center">
                  {conCrossfade ? (
                    <>
                      {/* Capa de abajo: recuerdo (siempre visible) */}
                      <img src={recuerdo.foto_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      {/* Capa de arriba: foto del café — anima fade out/in */}
                      <img src={cafeFoto} alt={cafe.nombre} className="absolute inset-0 w-full h-full object-cover recuerdo-fade" />
                    </>
                  ) : visitado && recuerdo?.foto_url ? (
                    <img src={recuerdo.foto_url} alt={cafe.nombre} className="w-full h-full object-cover" />
                  ) : cafeFoto ? (
                    <img src={cafeFoto} alt={cafe.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <CoffeeCupIcon size={24} className="text-cafe-accent/20" />
                  )}
                  {!visitado && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] pointer-events-none z-10" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleBeanTap(cafe, visitado, e)}
                    aria-label={visitado ? 'Mark as not visited' : 'Mark as visited'}
                    className={`absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all ${
                      visitado ? 'bg-beige' : 'bg-white/90 border border-cafe-dark/20'
                    }`}
                  >
                    {visitado
                      ? <CoffeeBeanIcon size={18} />
                      : <CoffeeBeanIcon size={18} className="opacity-25" />}
                  </button>
                </div>
                <p className="text-[10px] text-cafe-dark/70 text-center leading-tight line-clamp-2">{cafe.nombre}</p>
              </Link>
            )
          })}
        </div>
      )}

      {/* Prompt al recién marcar un café como visitado: ofrecemos guardar foto */}
      {promptCafe && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPromptCafe(null)}
        >
          <div
            className="bg-[#faf4ec] rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <CameraIcon size={36} className="text-cafe-dark/60 mx-auto mb-3" />
            <h3 className="text-lg font-display font-bold text-cafe-dark mb-1">
              {promptCafe.nombre}!
            </h3>
            <p className="text-sm text-cafe-accent/70 mb-5">
              Want to save a photo and a note from your visit?
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => { setRecuerdoCafe(promptCafe); setPromptCafe(null) }}
                className="w-full bg-cafe-dark text-[#b8d04a] text-sm font-bold py-3 rounded-2xl ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform"
              >
                Add photo
              </button>
              <button
                onClick={() => setPromptCafe(null)}
                className="w-full text-sm font-semibold text-cafe-accent/70 py-2"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      )}

      {recuerdoCafe && (
        <RecuerdoModal cafe={recuerdoCafe} onClose={() => setRecuerdoCafe(null)} />
      )}
    </div>
  )
}
