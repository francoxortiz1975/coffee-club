import { useNavigate, useParams } from 'react-router-dom'
import { buildShelves } from '../lib/shelves'
import { useCafesDeCafeteros } from '../lib/useCafesDeCafeteros'
import { useFavoritos } from '../context/FavoritosContext'
import CafeCardSmall from '../components/CafeCardSmall'
import { ArrowLeftIcon } from '../components/Icons'

// "See all" for one shelf on Discover > Browse.
export default function Shelf() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favoritos } = useFavoritos()
  const friendCafeIds = useCafesDeCafeteros()
  const shelf = buildShelves({ favoritos, friendCafeIds }).find((s) => s.id === id)

  return (
    <div className="px-4 pb-4" style={{ paddingTop: 'calc(10px + env(safe-area-inset-top))' }}>
      <div className="flex items-center gap-1 min-h-11">
        <button onClick={() => navigate(-1)} aria-label="Back" className="-ml-2 w-11 h-11 flex items-center justify-center text-cafe-dark/70 active:scale-95 transition-transform">
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-2xl font-display font-bold text-cafe-dark leading-tight">{shelf?.title ?? 'Not found'}</h1>
      </div>
      <div className="grid grid-cols-1 gap-3 mt-4">
        {shelf?.cafes.map((c) => <CafeCardSmall key={c.id} cafe={c} fullWidth />)}
        {shelf && shelf.cafes.length === 0 && <p className="text-sm text-cafe-accent/70 text-center py-10">Nothing here yet.</p>}
      </div>
    </div>
  )
}
