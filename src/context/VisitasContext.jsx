import { createContext, useContext, useState } from 'react'

const KEY = 'samay_visitas'
const VisitasContext = createContext()

export function VisitasProvider({ children }) {
  const [visitas, setVisitas] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? [] } catch { return [] }
  })

  function toggleVisita(id) {
    setVisitas((prev) => {
      const next = prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <VisitasContext.Provider value={{ visitas, toggleVisita }}>
      {children}
    </VisitasContext.Provider>
  )
}

export function useVisitas() {
  return useContext(VisitasContext)
}
