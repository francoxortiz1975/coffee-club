import { Link } from 'react-router-dom'
import { CoffeeCupIcon, HeartIcon } from './Icons'
import { useFavoritos } from '../context/FavoritosContext'
import './slurpTag.css'

const OCASION_LABELS = {
  couple: 'Couple',
  friends: 'Friends',
  meeting: 'Meeting',
  tourist: 'Tourist',
  work: 'Work',
}

export default function CafeCardSmall({ cafe, fullWidth = false }) {
  const { id, nombre, barrio, ocasiones, especialidad, precio, fotos } = cafe
  const { favoritos, toggleFavorito } = useFavoritos()
  const esFavorito = favoritos.includes(id)

  function handleHeart(e) {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorito(id)
  }

  const sizing = fullWidth ? 'w-full' : 'shrink-0 w-64 snap-start'

  const tags = ocasiones.slice(0, 2).map((o) => OCASION_LABELS[o] ?? o)
  const sub = especialidad || cafe.tipo

  return (
    <Link
      to={`/cafe/${id}`}
      className={`${sizing} tag tag-paper rounded-md overflow-hidden shadow-sm block active:scale-[0.98] transition-transform`}
    >
      <div className="w-full h-36 bg-cafe-accent/10 flex items-center justify-center relative">
        {fotos?.[0] ? (
          <img src={fotos[0]} alt={nombre} className="w-full h-full object-cover" />
        ) : (
          <CoffeeCupIcon size={36} className="text-cafe-accent/30" />
        )}
        <button
          onClick={handleHeart}
          aria-label={esFavorito ? 'Remove from favorites' : 'Save to favorites'}
          aria-pressed={esFavorito}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm transition-colors before:absolute before:-inset-2 before:content-[''] ${esFavorito ? 'text-[#b8d04a]' : 'text-cafe-accent/70'}`}
        >
          <HeartIcon size={14} filled={esFavorito} />
        </button>
      </div>

      <div className="px-3.5 pt-3 pb-3.5">
        <span className="tag-rule" style={{ height: 6 }} />
        <div className="flex items-start justify-between gap-2 mt-2.5">
          <h3 className="font-sans font-bold text-[19px] leading-[1.1] tracking-tight">{nombre}</h3>
          {precio && <span className="tag-stamp shrink-0 !text-[11px] !px-2">{precio}</span>}
        </div>
        <span className="tag-rule thin mt-2.5" />
        <div className="flex items-end justify-between gap-2 mt-2.5 font-sans">
          <p className="text-[10px] font-semibold tracking-[0.12em] uppercase line-clamp-2 flex-1">{[sub, ...tags].filter(Boolean).join(' · ')}</p>
          <p className="font-bold text-[15px] leading-tight text-right shrink-0">{barrio}</p>
        </div>
      </div>
    </Link>
  )
}
