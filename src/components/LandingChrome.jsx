export function ThemeToggle({ t, effective, onChoose }) {
  return (
    <div className="seg" role="group" aria-label={t.theme}>
      {['dark', 'light'].map((mode) => (
        <button key={mode} type="button" onClick={() => onChoose(mode)} aria-pressed={effective === mode}>
          {t[mode]}
        </button>
      ))}
    </div>
  )
}
