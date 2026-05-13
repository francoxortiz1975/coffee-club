const FILTROS = [
  { id: 'todos', label: 'Para ti' },
  { id: 'pareja', label: '💑 Pareja' },
  { id: 'work', label: '💻 Trabajar' },
  { id: 'amigos', label: '👯 Amigos' },
  { id: 'reunión', label: '💼 Reunión' },
  { id: 'turístico', label: '🗺️ Turístico' },
]

export default function FilterBar({ activo, onChange, onEspecialidad }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
      {FILTROS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors ${
            activo === id
              ? 'bg-cafe-dark text-beige border-cafe-dark'
              : 'bg-white text-cafe-accent border-cafe-accent/25'
          }`}
        >
          {label}
        </button>
      ))}

      {/* Filtro por especialidad */}
      <button
        onClick={onEspecialidad}
        className="shrink-0 text-sm px-4 py-1.5 rounded-full border bg-white text-cafe-accent border-cafe-accent/25"
      >
        •••
      </button>
    </div>
  )
}
