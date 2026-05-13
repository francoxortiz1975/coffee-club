export default function Perfil() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-2">Mi Perfil</h1>
      <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-cafe-accent text-sm font-medium mb-1">Coffee Beans</p>
        <p className="text-4xl font-serif font-bold text-cafe-dark">0 ☕</p>
        <p className="text-xs text-gray-400 mt-1">Cafeterías visitadas</p>
      </div>
    </div>
  )
}
