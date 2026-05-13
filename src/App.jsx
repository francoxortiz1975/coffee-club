import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FavoritosProvider } from './context/FavoritosContext'
import BottomNav from './components/BottomNav'
import Descubrir from './pages/Descubrir'
import Shuffle from './pages/Shuffle'
import Perfil from './pages/Perfil'
import CafeDetalle from './pages/CafeDetalle'

export default function App() {
  return (
    <FavoritosProvider>
    <BrowserRouter>
      <div className="min-h-screen bg-beige max-w-md mx-auto relative">
        <main className="pb-24">
          <Routes>
            <Route path="/" element={<Descubrir />} />
            <Route path="/cafe/:id" element={<CafeDetalle />} />
            <Route path="/shuffle" element={<Shuffle />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
    </FavoritosProvider>
  )
}
