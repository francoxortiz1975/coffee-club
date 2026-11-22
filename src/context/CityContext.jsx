import { useState } from 'react'
import { CITIES, CityContext } from '../lib/city'

const KEY = 'sumay_city'

export function CityProvider({ children }) {
  const [city, setCityState] = useState(() => {
    try { const v = localStorage.getItem(KEY); return CITIES.includes(v) ? v : 'Paris' } catch { return 'Paris' }
  })
  const setCity = (c) => {
    setCityState(c)
    try { localStorage.setItem(KEY, c) } catch { /* private mode */ }
  }
  return <CityContext.Provider value={{ city, setCity }}>{children}</CityContext.Provider>
}
