import { useCallback, useEffect, useState } from 'react'
import { LANGS } from './landingCopy'

const LANG_KEY = 'sumay_lang'

// Prioridad: ?lang= en la URL → elección guardada → idioma del navegador → inglés.
function detectLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (LANGS.includes(fromUrl)) return fromUrl
    const saved = localStorage.getItem(LANG_KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
    // localStorage puede estar bloqueado en algunos webviews.
  }
  return (navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function useLandingLang() {
  const [lang, setLangState] = useState(detectLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem(LANG_KEY, next)
    } catch {
      // sin persistencia, el cambio igual aplica en esta sesión.
    }
    // Si la URL trae ?lang=, la mantenemos al día para que un refresh no la revierta.
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', next)
      window.history.replaceState(window.history.state, '', url)
    }
  }, [])

  return [lang, setLang]
}
