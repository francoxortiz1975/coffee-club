import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Resetea scroll al top cada vez que cambia la ruta.
// Sin esto, navegar entre páginas preserva el scroll position del browser
// y las páginas aparecen "empezando más abajo".
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
