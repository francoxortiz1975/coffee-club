import { LANGS } from '../lib/landingCopy'

export function LangToggle({ lang, setLang }) {
  return (
    <div className="seg" role="group" aria-label="Language">
      {LANGS.map((code) => (
        <button key={code} type="button" onClick={() => setLang(code)} aria-pressed={lang === code}>
          {code}
        </button>
      ))}
    </div>
  )
}

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
