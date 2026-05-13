import { SearchIcon } from './Icons'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-4">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cafe-accent/40">
        <SearchIcon size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar cafetería..."
        className="w-full bg-white rounded-2xl pl-9 pr-4 py-2.5 text-sm text-cafe-dark placeholder-cafe-accent/40 border border-cafe-accent/15 outline-none focus:border-cafe-accent/40"
      />
    </div>
  )
}
