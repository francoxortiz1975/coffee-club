import { createContext, useContext, useState } from 'react'

const FavoritosContext = createContext()

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([])

  function toggleFavorito(id) {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  )
}

export function useFavoritos() {
  return useContext(FavoritosContext)
}
