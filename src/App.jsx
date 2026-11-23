import { BrowserRouter, Routes, Route, useLocation, matchPath, Navigate } from 'react-router-dom'
import { Component } from 'react'
import { useAuth } from './context/AuthContext'
import { FavoritosProvider } from './context/FavoritosContext'
import { VisitasProvider } from './context/VisitasContext'
import { InvitacionesProvider } from './context/InvitacionesContext'
import { UsuarioProvider } from './context/UsuarioContext'
import { AuthProvider } from './context/AuthContext'
import { CafeterosProvider } from './context/CafeterosContext'
import { RecuerdosProvider } from './context/RecuerdosContext'
import TagLab from './pages/TagLab'
import CollectReveal from './components/CollectReveal'
import { CityProvider } from './context/CityContext'
import BottomNav from './components/BottomNav'
import InstallPrompt from './components/InstallPrompt'
import ScrollToTop from './components/ScrollToTop'
import MigrationRunner from './components/MigrationRunner'
import Seleccionados from './pages/Seleccionados'
import Descubrir from './pages/Descubrir'
import ShufflePage from './pages/ShufflePage'
import SwipePage from './pages/SwipePage'
import Perfil from './pages/Perfil'
import Collect from './pages/Collect'
import Invite from './pages/Invite'
import InviteNew from './pages/InviteNew'
import MapTab from './pages/MapTab'
import JourneySlurp from './pages/JourneySlurp'
import Shelf from './pages/Shelf'
import CafeDetalle from './pages/CafeDetalle'
import InvitacionSetup from './pages/InvitacionSetup'
import InvitacionPage from './pages/InvitacionPage'
import Landing from './pages/Landing'
import ComingSoon from './pages/ComingSoon'
import Privacy from './pages/Privacy'
import Quiz from './pages/Quiz'
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
        <p className="text-[#b8d04a] font-display text-lg font-bold">Something went wrong</p>
        <p className="text-white/60 text-sm">Tap to reload the app.</p>
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
  { path: '/decidir',           bg: '/wood-bg.webp', overlay: 50 },
  { path: '/perfil',            bg: '/panama-bg.webp', overlay: 0  },
  { path: '/journey/:id',       bg: '/white-bg.webp', overlay: 40 },
  { path: '/decidir/seleccionados', bg: '/wood-bg.webp', overlay: 50 },
  { path: '/journey',           bg: '/wood-bg.webp', overlay: 50 },
  { path: '/shelf/:id',         bg: '/wood-bg.webp', overlay: 50 },
  { path: '/map',               bg: '/wood-bg.webp', overlay: 50 },
  { path: '/collect',           bg: '/panama-bg.webp', overlay: 0  },
  { path: '/invite/new',        bg: '/wood-bg.webp', overlay: 50 },
  { path: '/invite',            bg: '/wood-bg.webp', overlay: 50 },
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

// sumayclub.app opens the landing page in a browser. The installed app (home screen, standalone) still opens straight
// into Discover, and ?app=1 opens the app in a browser for testing.
function isInstalledApp() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
}
function HomeGate() {
  const { search } = useLocation()
  const open = isInstalledApp() || new URLSearchParams(search).get('app') === '1'
  return open ? <Descubrir /> : <Navigate to="/landing" replace />
}

function AppShell() {
  const { pathname } = useLocation()
  const hideNav = NO_NAV_PATHS.some((p) => pathname.startsWith(p))
  const { bg, overlay } = resolveBg(pathname)

  return (
    <div className="min-h-screen max-w-md mx-auto relative">
      <CollectReveal />
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
          <Route path="/" element={<HomeGate />} />
          <Route path="/cafe/:id" element={<CafeDetalle />} />
          <Route path="/decidir" element={<Navigate to="/" replace />} />
          <Route path="/decidir/seleccionados" element={<Seleccionados />} />
          <Route path="/decidir/aleatorio" element={<ShufflePage />} />
          <Route path="/decidir/swipe" element={<SwipePage />} />
          <Route path="/journey" element={<Navigate to="/" replace />} />
          <Route path="/lab/tag" element={<TagLab />} />
          <Route path="/journey/:id" element={<JourneySlurp />} />
          <Route path="/shelf/:id" element={<Shelf />} />
          <Route path="/map" element={<MapTab />} />
          <Route path="/collect" element={<Collect />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/invite/new" element={<InviteNew />} />
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
        <Route path="/landing" element={<ComingSoon />} />
        <Route path="/landing-full" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/privacidad" element={<Privacy />} />
        {/* Resto: app dentro del Layout mobile-only */}
        <Route path="*" element={<AppShell />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <CityProvider>
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
      </CityProvider>
    </ErrorBoundary>
  )
}
