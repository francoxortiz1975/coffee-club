import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Descubrir from './pages/Descubrir'
import Shuffle from './pages/Shuffle'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-beige max-w-md mx-auto relative">
        <main className="pb-16">
          <Routes>
            <Route path="/" element={<Descubrir />} />
            <Route path="/shuffle" element={<Shuffle />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
