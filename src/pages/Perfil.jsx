import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useUsuario, generarUsername, TIPOS_CAFE } from '../context/UsuarioContext'
import { useAuth } from '../context/AuthContext'
import { useCafeteros } from '../context/CafeterosContext'
import { UserIcon, ArrowLeftIcon, CoffeeCupIcon } from '../components/Icons'

export default function Perfil() {
  const navigate = useNavigate()
  const { usuario, actualizar } = useUsuario()
  const { user, cerrarSesion } = useAuth()
  const { confirmados: cafeteros, pendientesRecibidas } = useCafeteros()
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [eligiendoFavorita, setEligiendoFavorita] = useState(false)
  const [eligiendoCafe, setEligiendoCafe] = useState(false)

  const cafeFavorito = cafes.find((c) => c.id === usuario.cafeteriaFavoritaId)

  return (
    <div
      className="min-h-screen px-4 pb-4"
      style={{ paddingTop: 'calc(16px + env(safe-area-inset-top))' }}
    >
      {/* Botón Entrar / Sign out — temporal arriba a la derecha */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => navigate(-1)} aria-label="Back" className="-ml-2 w-11 h-11 flex items-center justify-center text-cafe-dark/70 active:scale-95 transition-transform">
          <ArrowLeftIcon size={20} />
        </button>
        {user ? (
          <button
            onClick={cerrarSesion}
            className="text-[11px] font-semibold text-cafe-accent/70 border border-cafe-accent/25 px-3 py-1 rounded-full"
            title={user.email}
          >
            Sign out
          </button>
        ) : (
          <Link
            to="/login"
            className="text-[11px] font-bold bg-cafe-dark text-[#b8d04a] px-3 py-1 rounded-full"
          >
            Sign in
          </Link>
        )}
      </div>

      {/* Header centrado */}
      <div className="flex flex-col items-center text-center mb-6">
        <button
          onClick={() => setEditandoPerfil(true)}
          className="relative mb-3 active:scale-95 transition-transform"
          aria-label="Edit profile"
        >
          <div className="w-24 h-24 rounded-full bg-[#faf4ec] border-4 border-[#faf4ec] shadow-md overflow-hidden flex items-center justify-center">
            {usuario.foto
              ? <img src={usuario.foto} alt={usuario.nombre} className="w-full h-full object-cover" />
              : <UserIcon size={40} className="text-cafe-accent/40" />}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-cafe-dark text-beige text-xs flex items-center justify-center border-2 border-[#faf4ec] shadow">
            ✎
          </div>
        </button>
        <h1 className="text-xl font-display font-bold text-cafe-dark leading-tight">{usuario.nombre}</h1>
        <p className="text-sm text-cafe-accent/60 mt-0.5">@{usuario.username}</p>
      </div>

      {/* Stats bar */}
      <div className="bg-[#faf4ec] rounded-2xl shadow-sm flex items-stretch divide-x divide-cafe-accent/15 mb-6">
        <Link
          to="/cafeteros"
          className="flex-1 flex flex-col items-center justify-center py-3 active:bg-black/5 transition-colors relative"
        >
          <p className="text-base font-display font-bold text-cafe-dark tabular-nums">{cafeteros.length}</p>
          <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mt-1">Coffee friends</p>
          {pendientesRecibidas.length > 0 && (
            <span className="absolute top-2 right-2 bg-[#b8d04a] text-cafe-dark text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {pendientesRecibidas.length}
            </span>
          )}
        </Link>
        <button
          onClick={() => setEligiendoCafe(true)}
          className="flex-1 flex flex-col items-center justify-center py-3 active:bg-black/5 transition-colors"
        >
          <p className="text-sm font-sans font-bold text-cafe-dark line-clamp-1 px-2">
            {usuario.cafeFavorito || 'Choose'}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mt-1">Favorite coffee</p>
        </button>
        <button
          onClick={() => setEligiendoFavorita(true)}
          className="flex-1 flex flex-col items-center justify-center py-3 active:bg-black/5 transition-colors"
        >
          <p className="text-sm font-sans font-bold text-cafe-dark line-clamp-1 px-2">
            {cafeFavorito ? cafeFavorito.nombre : 'Choose'}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-cafe-accent/70 mt-1 px-2 text-center leading-tight">Favorite coffee shop</p>
        </button>
      </div>

      {editandoPerfil && (
        <EditarPerfilModal
          usuario={usuario}
          onSave={(parcial) => { actualizar(parcial); setEditandoPerfil(false) }}
          onClose={() => setEditandoPerfil(false)}
        />
      )}

      {eligiendoFavorita && (
        <ElegirCafeteriaModal
          actualId={usuario.cafeteriaFavoritaId}
          onSelect={(cafeteriaFavoritaId) => { actualizar({ cafeteriaFavoritaId }); setEligiendoFavorita(false) }}
          onClose={() => setEligiendoFavorita(false)}
        />
      )}

      {eligiendoCafe && (
        <ElegirCafeModal
          actual={usuario.cafeFavorito}
          onSelect={(cafeFavorito) => { actualizar({ cafeFavorito }); setEligiendoCafe(false) }}
          onClose={() => setEligiendoCafe(false)}
        />
      )}
    </div>
  )
}

function ElegirCafeModal({ actual, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div
        className="bg-[#faf4ec] rounded-t-3xl sm:rounded-2xl p-5 max-w-sm w-full shadow-xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-display font-bold text-cafe-dark mb-4">What is your coffee?</h3>
        <div className="flex-1 overflow-y-auto -mx-5 px-5">
          {actual && (
            <button
              onClick={() => onSelect('')}
              className="w-full text-left text-xs text-cafe-accent/60 italic py-2 mb-1"
            >
              Clear selection
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            {TIPOS_CAFE.map((tipo) => {
              const seleccionado = tipo === actual
              return (
                <button
                  key={tipo}
                  onClick={() => onSelect(tipo)}
                  className={`py-3 rounded-xl text-sm font-sans font-bold transition-colors ${
                    seleccionado
                      ? 'bg-cafe-dark text-beige'
                      : 'bg-white border border-cafe-accent/20 text-cafe-dark active:bg-cafe-dark/5'
                  }`}
                >
                  {tipo}
                </button>
              )
            })}
          </div>
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold border border-cafe-accent/25 text-cafe-accent active:scale-95 transition-transform">
          Close
        </button>
      </div>
    </div>
  )
}

function EditarPerfilModal({ usuario, onSave, onClose }) {
  const [nombre, setNombre] = useState(usuario.nombre)
  const [username, setUsername] = useState(usuario.username)
  const [foto, setFoto] = useState(usuario.foto)
  const fileRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setFoto(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-[#faf4ec] rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-display font-bold text-cafe-dark mb-4">Edit profile</h3>

        <div className="flex justify-center mb-5">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative active:scale-95 transition-transform"
          >
            <div className="w-20 h-20 rounded-full bg-white border-2 border-cafe-accent/20 overflow-hidden flex items-center justify-center">
              {foto
                ? <img src={foto} alt="" className="w-full h-full object-cover" />
                : <UserIcon size={32} className="text-cafe-accent/40" />}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-cafe-dark text-beige text-[10px] flex items-center justify-center border-2 border-[#faf4ec] shadow">
              ✎
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </div>

        <label className="text-[11px] uppercase tracking-widest text-cafe-accent/50 block mb-1.5">Name</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full bg-transparent border border-cafe-accent/25 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60 mb-4"
        />

        <label className="text-[11px] uppercase tracking-widest text-cafe-accent/50 block mb-1.5">Username</label>
        <div className="flex gap-2 mb-5">
          <div className="flex-1 flex items-center bg-transparent border border-cafe-accent/25 rounded-xl px-3 focus-within:border-cafe-accent/60">
            <span className="text-cafe-accent/50 text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
              className="flex-1 bg-transparent py-2.5 text-sm text-cafe-dark outline-none"
            />
          </div>
          <button
            onClick={() => setUsername(generarUsername())}
            className="px-3 py-2.5 rounded-xl border border-cafe-accent/25 text-xs font-semibold text-cafe-accent active:scale-95 transition-transform"
            title="Generate a random one"
          >
            🎲
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-cafe-accent/25 text-cafe-accent active:scale-95 transition-transform">
            Cancel
          </button>
          <button
            onClick={() => onSave({ nombre: nombre.trim() || usuario.nombre, username: username.trim() || usuario.username, foto })}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-cafe-dark text-beige active:scale-95 transition-transform"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function ElegirCafeteriaModal({ actualId, onSelect, onClose }) {
  const [busqueda, setBusqueda] = useState('')
  const filtrados = cafes.filter((c) => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div
        className="bg-[#faf4ec] rounded-t-3xl sm:rounded-2xl p-5 max-w-sm w-full shadow-xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-display font-bold text-cafe-dark mb-3">Favorite coffee shop</h3>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Search..."
          className="w-full bg-transparent border border-cafe-accent/25 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60 mb-3"
        />
        <div className="flex-1 overflow-y-auto -mx-5 px-5">
          {actualId && (
            <button
              onClick={() => onSelect('')}
              className="w-full text-left text-xs text-cafe-accent/60 italic py-2 mb-1"
            >
              Clear selection
            </button>
          )}
          <div className="flex flex-col gap-1">
            {filtrados.map((cafe) => {
              const seleccionado = cafe.id === actualId
              return (
                <button
                  key={cafe.id}
                  onClick={() => onSelect(cafe.id)}
                  className={`flex items-center gap-3 p-2 rounded-xl text-left active:scale-[0.99] transition-transform ${
                    seleccionado ? 'bg-cafe-dark/10' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-cafe-accent/10 overflow-hidden flex items-center justify-center shrink-0">
                    {cafe.fotos?.[0]
                      ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
                      : <CoffeeCupIcon size={18} className="text-cafe-accent/30" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-bold text-cafe-dark truncate">{cafe.nombre}</p>
                    <p className="text-[11px] text-cafe-accent/60 truncate">{cafe.barrio}</p>
                  </div>
                  {seleccionado && <span className="text-cafe-dark text-sm">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold border border-cafe-accent/25 text-cafe-accent active:scale-95 transition-transform">
          Close
        </button>
      </div>
    </div>
  )
}
