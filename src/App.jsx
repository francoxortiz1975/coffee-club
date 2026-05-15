import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { FavoritosProvider } from './context/FavoritosContext'
import { VisitasProvider } from './context/VisitasContext'
import BottomNav from './components/BottomNav'
import Descubrir from './pages/Descubrir'
import Decidir from './pages/Decidir'
import ShufflePage from './pages/ShufflePage'
import SwipePage from './pages/SwipePage'
import Seleccionados from './pages/Seleccionados'
import Perfil from './pages/Perfil'
import CafeDetalle from './pages/CafeDetalle'

export default function App() {
  return (
    <FavoritosProvider>
    <VisitasProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-beige max-w-md mx-auto relative">
          <main className="pb-24">
            <Routes>
              <Route path="/" element={<Descubrir />} />
              <Route path="/cafe/:id" element={<CafeDetalle />} />
              <Route path="/decidir" element={<Decidir />} />
              <Route path="/decidir/aleatorio" element={<ShufflePage />} />
              <Route path="/decidir/swipe" element={<SwipePage />} />
              <Route path="/decidir/seleccionados" element={<Seleccionados />} />
              <Route path="/perfil" element={<Perfil />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </VisitasProvider>
    </FavoritosProvider>
  )
}
