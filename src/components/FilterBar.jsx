import { SparkleIcon, HeartIcon, LaptopIcon, UsersIcon, BriefcaseIcon, MapIcon } from './Icons'

const FILTROS = [
  { id: 'todos',     label: 'Para ti',   Icon: SparkleIcon },
  { id: 'pareja',   label: 'Pareja',    Icon: HeartIcon },
  { id: 'work',     label: 'Trabajar',  Icon: LaptopIcon },
  { id: 'amigos',   label: 'Amigos',    Icon: UsersIcon },
  { id: 'reunión',  label: 'Reunión',   Icon: BriefcaseIcon },
  { id: 'turístico',label: 'Turístico', Icon: MapIcon },
]

export default function FilterBar({ activo, onChange, onEspecialidad }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
      {FILTROS.map(({ id, label, Icon }) => {
        const isActive = activo === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`relative shrink-0 flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-full border transition-colors before:absolute before:-inset-x-1 before:-inset-y-[5px] before:content-[''] ${
              isActive
                ? 'bg-cafe-dark text-beige border-cafe-dark'
                : 'bg-white/80 text-cafe-accent border-cafe-accent/20'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        )
      })}

      <button
        onClick={onEspecialidad}
        aria-label="More filters"
        className="relative shrink-0 text-sm px-4 py-1.5 rounded-full border bg-white/80 text-cafe-accent border-cafe-accent/20 before:absolute before:-inset-x-1 before:-inset-y-[5px] before:content-['']"
      >
        •••
      </button>
    </div>
  )
}
