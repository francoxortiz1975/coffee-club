import { createContext, useContext, useState } from 'react'

const KEY = 'samay_usuario'
const UsuarioContext = createContext()

const PREFIJOS = [
  'amanteDel', 'reyDel', 'reinaDel', 'maestroDel', 'fanDel', 'adictoAl',
  'cazadorDel', 'gurúDel', 'bohemioDel', 'magoDel', 'profeDel', 'baristaDel',
]
const CAFES = [
  'Espresso', 'Cappuccino', 'Cortado', 'Latte', 'Mocha', 'Americano',
  'Macchiato', 'Flatwhite', 'Frappe', 'Ristretto', 'Affogato', 'Turco',
  'Doppio', 'Cubano', 'Bombón',
]

export const TIPOS_CAFE = [
  'Espresso', 'Doppio', 'Ristretto', 'Americano',
  'Cappuccino', 'Latte', 'Flat white', 'Macchiato', 'Cortado',
  'Mocha', 'Affogato', 'Frappe',
  'Turco', 'Cubano', 'Bombón',
]
const NOMBRES_DISPLAY = [
  'Cafetero anónimo', 'Catador curioso', 'Bohemio del café',
  'Buscador de cafés', 'Amante del aroma',
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generarUsername() {
  const n = Math.floor(Math.random() * 90 + 10)
  return `${pick(PREFIJOS)}${pick(CAFES)}${n}`
}

function generarUsuarioInicial() {
  return {
    nombre: pick(NOMBRES_DISPLAY),
    username: generarUsername(),
    foto: '', // dataURL opcional
    cafeteriaFavoritaId: '',
    cafeFavorito: '',
  }
}

function loadInicial() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (raw && typeof raw === 'object') {
      return {
        nombre: raw.nombre ?? generarUsuarioInicial().nombre,
        username: raw.username ?? generarUsername(),
        foto: raw.foto ?? '',
        cafeteriaFavoritaId: raw.cafeteriaFavoritaId ?? '',
        cafeFavorito: raw.cafeFavorito ?? '',
      }
    }
  } catch {}
  const inicial = generarUsuarioInicial()
  localStorage.setItem(KEY, JSON.stringify(inicial))
  return inicial
}

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(loadInicial)

  function actualizar(parcial) {
    setUsuario((prev) => {
      const next = { ...prev, ...parcial }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  return (
    <UsuarioContext.Provider value={{ usuario, actualizar }}>
      {children}
    </UsuarioContext.Provider>
  )
}

export function useUsuario() {
  return useContext(UsuarioContext)
}
