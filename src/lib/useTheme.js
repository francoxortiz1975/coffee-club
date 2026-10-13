import { useState } from 'react'

const THEME_KEY = 'sumay_theme'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY)
      return saved === 'dark' || saved === 'light' ? saved : null
    } catch {
      return null
    }
  })
  const choose = (next) => {
    setTheme(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      // sin persistencia, el cambio igual aplica en esta sesión.
    }
  }
  return [theme, choose]
}
