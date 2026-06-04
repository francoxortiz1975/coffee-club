import { BrowserRouter, Routes, Route, useLocation, matchPath } from 'react-router-dom'
import { Component } from 'react'
import { useAuth } from './context/AuthContext'
import { FavoritosProvider } from './context/FavoritosContext'
import { VisitasProvider } from './context/VisitasContext'
import { InvitacionesProvider } from './context/InvitacionesContext'
import { UsuarioProvider } from './context/UsuarioContext'
import { AuthProvider } from './context/AuthContext'
import { CafeterosProvider } from './context/CafeterosContext'
import { RecuerdosProvider } from './context/RecuerdosContext'
import BottomNav from './components/BottomNav'
import InstallPrompt from './components/InstallPrompt'
import ScrollToTop from './components/ScrollToTop'
import MigrationRunner from './components/MigrationRunner'
import Descubrir from './pages/Descubrir'
import Decidir from './pages/Decidir'
import ShufflePage from './pages/ShufflePage'
import SwipePage from './pages/SwipePage'
import Seleccionados from './pages/Seleccionados'
import Perfil from './pages/Perfil'
import CafeDetalle from './pages/CafeDetalle'
import InvitacionSetup from './pages/InvitacionSetup'
import InvitacionPage from './pages/InvitacionPage'
import Landing from './pages/Landing'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Cafeteros from './pages/Cafeteros'

// ─── Error boundary: captura crashes de React y muestra pantalla de recarga ──
class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#2a1510] gap-6 p-8 text-center">
        <img src="/logo.png" alt="Sumay" className="w-20 h-20 opacity-80" />
        <p className="text-[#b8d04a] font-serif text-lg font-bold">Algo salió mal</p>
        <p className="text-white/60 text-sm">Toca para recargar la app.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-3 rounded-2xl bg-[#b8d04a] text-[#2a1510] font-bold text-sm"
        >
          Recargar
        </button>
      </div>
    )
  }
}

// ─── Splash: muestra logo mientras auth resuelve la sesión ────────────────────
function Splash() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#2a1510]">
      <img src="/logo.png" alt="Sumay" className="w-24 h-24" />
    </div>
  )
}

const NO_NAV_PATHS = ['/invitacion']

// pathname pattern → { bg, overlay opacity (0-100). null bg = sin imagen (la página pinta su fondo) }
const BG_RULES = [
  { path: '/decidir/aleatorio', bg: null,             overlay: 0  },
  { path: '/decidir/swipe',     bg: '/white-bg.webp', overlay: 40 },
  { path: '/decidir/seleccionados', bg: '/wood-bg.webp', overlay: 50 },
  { path: '/decidir',           bg: '/texture-bg.webp', overlay: 0  },
  { path: '/perfil',            bg: '/panama-bg.webp', overlay: 0  },
  { path: '/cafe/:id',          bg: '/white-bg.webp', overlay: 40 },
  { path: '/invitacion/:id/setup', bg: '/wood-bg.webp', overlay: 50 },
  { path: '/invitacion/:id',    bg: '/wood-bg.webp', overlay: 50 },
  { path: '/',                  bg: '/wood-bg.webp', overlay: 50 },
]

function resolveBg(pathname) {
  for (const rule of BG_RULES) {
    if (matchPath({ path: rule.path, end: true }, pathname)) return rule
  }
  return { bg: '/wood-bg.webp', overlay: 50 }
}

function AppShell() {
  const { pathname } = useLocation()
  const hideNav = NO_NAV_PATHS.some((p) => pathname.startsWith(p))
  const { bg, overlay } = resolveBg(pathname)

  return (
    <div className="min-h-screen max-w-md mx-auto relative">
      {bg && (
        <>
          {/* Fondo fijo al viewport: nunca se acaba con el scroll */}
          <div
            className="fixed inset-0 max-w-md mx-auto bg-cover bg-center bg-no-repeat pointer-events-none -z-10"
            style={{ backgroundImage: `url('${bg}')` }}
          />
          {overlay > 0 && (
            <div
              className="fixed inset-0 max-w-md mx-auto pointer-events-none -z-10"
              style={{ backgroundColor: `rgba(245, 236, 224, ${overlay / 100})` }}
            />
          )}
        </>
      )}
      <main className={`relative ${hideNav ? '' : 'pb-24'}`}>
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
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/cafeteros" element={<Cafeteros />} />
        </Routes>
      </main>
      {!hideNav && <BottomNav />}
      <InstallPrompt />
    </div>
  )
}

function Root() {
  const { cargando } = useAuth()
  if (cargando) return <Splash />
  return (
    <>
      <ScrollToTop />
      <MigrationRunner />
      <Routes>
        {/* Landing: full-width, sin Layout, sin BottomNav, sin bg images */}
        <Route path="/landing" element={<Landing />} />
        {/* Resto: app dentro del Layout mobile-only */}
        <Route path="*" element={<AppShell />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FavoritosProvider>
          <VisitasProvider>
            <InvitacionesProvider>
              <UsuarioProvider>
                <CafeterosProvider>
                  <RecuerdosProvider>
                    <BrowserRouter>
                      <Root />
                    </BrowserRouter>
                  </RecuerdosProvider>
                </CafeterosProvider>
              </UsuarioProvider>
            </InvitacionesProvider>
          </VisitasProvider>
        </FavoritosProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
