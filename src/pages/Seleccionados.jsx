import { useLocation, useNavigate, Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useFavoritos } from '../context/FavoritosContext'
import { ArrowLeftIcon, HeartIcon, PinIcon, CoffeeCupIcon } from '../components/Icons'

export default function Seleccionados() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { favoritos, toggleFavorito } = useFavoritos()

  const ids = state?.seleccionados ?? []
  const cafesSeleccionados = cafes.filter((c) => ids.includes(c.id))

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-6">
        <button onClick={() => navigate('/decidir/swipe')} className="text-cafe-accent/60">
          <ArrowLeftIcon size={20} />
        </button>
        <div>
          <h1 className="text-xl font-serif font-bold text-cafe-dark">Tus seleccionados</h1>
          <p className="text-xs text-cafe-accent/50">{cafesSeleccionados.length} cafeterías</p>
        </div>
      </div>

      <div className="px-4 pb-8">
        {cafesSeleccionados.length > 0 ? (
          <div className="flex flex-col gap-4">
            {cafesSeleccionados.map((cafe) => {
              const esFavorito = favoritos.includes(cafe.id)
              return (
                <div key={cafe.id} className="bg-[#faf4ec] rounded-2xl overflow-hidden shadow-sm">
                  <Link to={`/cafe/${cafe.id}`} className="block">
                    <div className="w-full h-44 bg-cafe-accent/10 flex items-center justify-center">
                      {cafe.fotos?.[0]
                        ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
                        : <CoffeeCupIcon size={44} className="text-cafe-accent/20" />}
                    </div>
                    <div className="px-4 pt-4 pb-3">
                      <div className="flex items-start justify-between mb-0.5">
                        <h2 className="text-base font-serif font-bold text-cafe-dark">{cafe.nombre}</h2>
                        <span className="text-sm text-cafe-accent font-semibold ml-2">{cafe.precio}</span>
                      </div>
                      <p className="text-xs text-cafe-accent/60 mb-2 flex items-center gap-1">
                        <PinIcon size={11} />{cafe.barrio}
                      </p>
                      <p className="text-sm text-cafe-dark/70">{cafe.especialidad}</p>
                    </div>
                  </Link>
                  {/* Corazón — fuera del Link para no navegar */}
                  <div className="px-4 pb-4 flex justify-end">
                    <button
                      onClick={() => toggleFavorito(cafe.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                        esFavorito
                          ? 'border-red-300 text-red-400 bg-red-50'
                          : 'border-cafe-accent/25 text-cafe-accent/60'
                      }`}
                    >
                      <HeartIcon size={13} filled={esFavorito} />
                      {esFavorito ? 'Guardado' : 'Guardar'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-3 pt-16">
            <CoffeeCupIcon size={44} className="text-cafe-accent/25" />
            <p className="text-cafe-dark font-serif font-bold">No seleccionaste ninguna</p>
            <p className="text-cafe-accent/50 text-sm">Vuelve al swipe y marca las que te interesen</p>
            <button
              onClick={() => navigate('/decidir/swipe')}
              className="mt-3 bg-cafe-dark text-beige text-sm font-semibold px-6 py-2.5 rounded-full"
            >
              Volver al swipe
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
