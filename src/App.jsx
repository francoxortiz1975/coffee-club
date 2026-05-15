import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
import InvitacionSetup from './pages/InvitacionSetup'
import InvitacionPage from './pages/InvitacionPage'

const NO_NAV_PATHS = ['/invitacion']

function Layout() {
  const { pathname } = useLocation()
  const hideNav = NO_NAV_PATHS.some((p) => pathname.startsWith(p))

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-[url('/wood-bg.jpg')] bg-cover bg-top">
      <main className={hideNav ? '' : 'pb-24'}>
        <Routes>
          <Route path="/" element={<Descubrir />} />
          <Route path="/cafe/:id" element={<CafeDetalle />} />
          <Route path="/decidir" element={<Decidir />} />
          <Route path="/decidir/aleatorio" element={<ShufflePage />} />
          <Route path="/decidir/swipe" element={<SwipePage />} />
          <Route path="/decidir/seleccionados" element={<Seleccionados />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/invitacion/:id/setup" element={<InvitacionSetup />} />
          <Route path="/invitacion/:id" element={<InvitacionPage />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <FavoritosProvider>
      <VisitasProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </VisitasProvider>
    </FavoritosProvider>
  )
}
