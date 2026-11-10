import { useEffect } from 'react'

// The site is English only. Pages still read their copy as copy[lang], so this stays as the one place that says which.
export function useLandingLang() {
  useEffect(() => {
    document.documentElement.lang = 'en'
  }, [])
  return ['en']
}
