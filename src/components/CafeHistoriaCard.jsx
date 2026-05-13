export default function CafeHistoriaCard({ historia }) {
  const { año, titulo, texto, emoji } = historia
  return (
    <div className="shrink-0 w-56 bg-white rounded-2xl p-4 shadow-sm snap-start">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{emoji}</span>
        <span className="text-[10px] font-semibold text-cafe-accent/60 tracking-wide">{año}</span>
      </div>
      <h3 className="text-sm font-serif font-bold text-cafe-dark mb-1 leading-tight">{titulo}</h3>
      <p className="text-[11px] text-cafe-dark/60 leading-relaxed">{texto}</p>
    </div>
  )
}
