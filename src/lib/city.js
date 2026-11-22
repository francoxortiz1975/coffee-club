import { createContext, useContext, useMemo } from 'react'
import allCafes from '../data/cafes.json'

// Which city's cafés the app shows. Paris first, Quito where it began.
export const CITIES = ['Paris', 'Quito']
export const CityContext = createContext({ city: 'Paris', setCity: () => {} })
export const useCity = () => useContext(CityContext)

// The cafés of the chosen city (for browsing, swiping, random and picking a café to invite to).
export function useCityCafes() {
  const { city } = useCity()
  return useMemo(() => allCafes.filter((c) => c.ciudad === city), [city])
}
