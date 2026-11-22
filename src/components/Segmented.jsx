// A small iOS-style segmented control. options: [{ id, label, badge? }]
export default function Segmented({ options, value, onChange, label = 'View' }) {
  return (
    <div role="tablist" aria-label={label} className="flex bg-cafe-dark/10 rounded-xl p-1">
      {options.map((o) => {
        const on = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.id)}
            className={`relative flex-1 min-h-11 rounded-lg text-sm font-sans font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              on ? 'bg-[#fffaf0] text-cafe-dark shadow-sm' : 'text-cafe-accent'
            }`}
          >
            {o.label}
            {o.badge > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-[#7a2e1d] text-beige text-[11px] font-bold flex items-center justify-center">{o.badge}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
