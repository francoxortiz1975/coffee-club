import cafes from '../data/cafes.json'
import CafeCard from '../components/CafeCard'

export default function Descubrir() {
  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-1">Descubrir</h1>
      <p className="text-sm text-cafe-accent/70 mb-6">Centro Histórico de Quito</p>

      <div className="flex flex-col gap-4">
        {cafes.map((cafe) => (
          <CafeCard key={cafe.id} cafe={cafe} />
        ))}
      </div>
    </div>
  )
}
