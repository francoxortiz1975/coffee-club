import { SeedlingIcon, WaveIcon, BoxIcon, TrendDownIcon, MountainIcon, SparkleIcon } from './Icons'

const ICON_MAP = {
  '🌱': SeedlingIcon,
  '🏖️': WaveIcon,
  '📦': BoxIcon,
  '📉': TrendDownIcon,
  '🏔️': MountainIcon,
  '✨': SparkleIcon,
}

export default function CafeHistoriaCard({ historia }) {
  const { año, titulo, texto, emoji } = historia
  const IconComp = ICON_MAP[emoji]

  return (
    <div className="shrink-0 w-56 bg-white rounded-2xl p-4 shadow-sm snap-start">
      <div className="flex items-center gap-2 mb-3">
        {IconComp && <IconComp size={22} className="text-cafe-accent/70" />}
        <span className="text-[10px] font-semibold text-cafe-accent/50 tracking-wide uppercase">{año}</span>
      </div>
      <h3 className="text-sm font-serif font-bold text-cafe-dark mb-1 leading-tight">{titulo}</h3>
      <p className="text-[11px] text-cafe-dark/60 leading-relaxed">{texto}</p>
    </div>
  )
}
