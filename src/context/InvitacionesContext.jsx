import { createContext, useContext, useState } from 'react'

const KEY = 'samay_invitaciones'
const InvitacionesContext = createContext()

// Identidad de una invitación: cafe + nombre + fecha + hora.
// Permite deduplicar si se abre dos veces el mismo link.
function invKey({ cafeId, nombre, fecha, hora }) {
  return [cafeId, nombre || '', fecha || '', hora || ''].join('|')
}

function loadInicial() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    return {
      enviadas: Array.isArray(raw?.enviadas) ? raw.enviadas : [],
      recibidas: Array.isArray(raw?.recibidas) ? raw.recibidas : [],
    }
  } catch {
    return { enviadas: [], recibidas: [] }
  }
}

export function InvitacionesProvider({ children }) {
  const [state, setState] = useState(loadInicial)

  function persist(next) {
    localStorage.setItem(KEY, JSON.stringify(next))
    return next
  }

  function agregarEnviada(inv) {
    setState((prev) => {
      const key = invKey(inv)
      if (prev.enviadas.some((i) => invKey(i) === key)) return prev
      return persist({
        ...prev,
        enviadas: [{ ...inv, createdAt: Date.now() }, ...prev.enviadas],
      })
    })
  }

  function agregarRecibida(inv) {
    setState((prev) => {
      const key = invKey(inv)
      // Si yo la envié, no la agrego a recibidas.
      if (prev.enviadas.some((i) => invKey(i) === key)) return prev
      if (prev.recibidas.some((i) => invKey(i) === key)) return prev
      return persist({
        ...prev,
        recibidas: [{ ...inv, savedAt: Date.now() }, ...prev.recibidas],
      })
    })
  }

  function eliminar(tipo, key) {
    setState((prev) => persist({
      ...prev,
      [tipo]: prev[tipo].filter((i) => invKey(i) !== key),
    }))
  }

  return (
    <InvitacionesContext.Provider value={{ ...state, agregarEnviada, agregarRecibida, eliminar, invKey }}>
      {children}
    </InvitacionesContext.Provider>
  )
}

export function useInvitaciones() {
  return useContext(InvitacionesContext)
}
