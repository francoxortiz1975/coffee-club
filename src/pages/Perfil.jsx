import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import cafes from '../data/cafes.json'
import { useVisitas } from '../context/VisitasContext'
import { useInvitaciones } from '../context/InvitacionesContext'
import { useUsuario, generarUsername, TIPOS_CAFE } from '../context/UsuarioContext'
import { useAuth } from '../context/AuthContext'
import {
  CoffeeCupIcon, CoffeeBeanIcon, CoffeeMugIcon, InviteIcon, PinIcon, UserIcon,
} from '../components/Icons'

const barrios = [...new Set(cafes.map((c) => c.barrio))]

function ColeccionBarrio({ barrio }) {
  const [abierto, setAbierto] = useState(false)
  const { visitas, toggleVisita } = useVisitas()
  const cafesBarrio = cafes.filter((c) => c.barrio === barrio)
  const visitados = cafesBarrio.filter((c) => visitas.includes(c.id)).length

  return (
    <div className="bg-[#faf4ec] rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5"
      >
        <div className="text-left">
          <p className="text-sm font-serif font-bold text-cafe-dark">{barrio}</p>
          <p className="text-xs text-cafe-accent/50 mt-0.5">{visitados} / {cafesBarrio.length} visitadas</p>
        </div>
        <span className={`text-cafe-accent/40 transition-transform text-xs ${abierto ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Loyalty card — un stamp por cafetería del barrio */}
      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
        {cafesBarrio.map((c) => {
          const v = visitas.includes(c.id)
          return (
            <div
              key={c.id}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                v ? 'bg-beige border border-cafe-dark/30' : 'bg-white/40 border border-dashed border-cafe-accent/30'
              }`}
              title={c.nombre}
            >
              {v && <CoffeeBeanIcon size={16} />}
            </div>
          )
        })}
      </div>

      {abierto && (
        <div className="grid grid-cols-3 gap-3 p-4">
          {cafesBarrio.map((cafe) => {
            const visitado = visitas.includes(cafe.id)
            return (
              <Link key={cafe.id} to={`/cafe/${cafe.id}`} className="flex flex-col items-center gap-1.5">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-cafe-accent/10 flex items-center justify-center">
                  {cafe.fotos?.[0]
                    ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
                    : <CoffeeCupIcon size={24} className="text-cafe-accent/20" />}
                  {!visitado && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] pointer-events-none" />
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleVisita(cafe.id) }}
                    aria-label={visitado ? 'Marcar como no visitada' : 'Marcar como visitada'}
                    className={`absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all ${
                      visitado ? 'bg-beige' : 'bg-white/90 border border-cafe-dark/20'
                    }`}
                  >
                    {visitado
                      ? <CoffeeBeanIcon size={18} />
                      : <CoffeeBeanIcon size={18} className="opacity-25" />}
                  </button>
                </div>
                <p className="text-[10px] text-cafe-dark/70 text-center leading-tight line-clamp-2">{cafe.nombre}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function InvitacionRow({ inv, tipo, onEliminar }) {
  const cafe = cafes.find((c) => c.id === inv.cafeId)
  if (!cafe) return null

  const params = new URLSearchParams()
  if (inv.nombre) params.set('nombre', inv.nombre)
  if (inv.receptor) params.set('para', inv.receptor)
  if (inv.fecha) params.set('fecha', inv.fecha)
  if (inv.hora) params.set('hora', inv.hora)
  const link = `/invitacion/${inv.cafeId}${params.toString() ? `?${params}` : ''}`

  const detalle = inv.fecha
    ? new Date(inv.fecha + 'T12:00:00').toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })
    : null

  return (
    <div className="flex items-center gap-3">
      <Link to={link} className="flex-1 flex items-center gap-3 active:scale-[0.99] transition-transform">
        <div className="w-12 h-12 rounded-xl bg-cafe-accent/10 overflow-hidden flex items-center justify-center shrink-0">
          {cafe.fotos?.[0]
            ? <img src={cafe.fotos[0]} alt={cafe.nombre} className="w-full h-full object-cover" />
            : <CoffeeCupIcon size={20} className="text-cafe-accent/30" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-serif font-bold text-cafe-dark truncate">{cafe.nombre}</p>
          <p className="text-[11px] text-cafe-accent/60 flex items-center gap-1 truncate">
            <PinIcon size={10} className="shrink-0" />
            <span className="truncate">{cafe.barrio}</span>
            {detalle && <span className="text-cafe-accent/40">· {detalle}{inv.hora ? ` ${inv.hora}` : ''}</span>}
            {tipo === 'recibidas' && inv.nombre && <span className="text-cafe-accent/40">· de {inv.nombre}</span>}
            {tipo === 'enviadas' && inv.receptor && <span className="text-cafe-accent/40">· para {inv.receptor}</span>}
          </p>
        </div>
      </Link>
      <button onClick={onEliminar} aria-label="Eliminar invitación" className="w-7 h-7 rounded-full text-cafe-accent/40 active:text-cafe-accent/80 shrink-0">
        ×
      </button>
    </div>
  )
}

// Visualización: número a la izquierda + tazas (cada una = 10) + beans sueltos.
// Si supera 100 visitas, muestra 10 tazas + "+" como indicador.
function ColeccionBeans({ total }) {
  if (total === 0) {
    return <p className="text-xs text-cafe-accent/50">Aún no has visitado ninguna cafetería</p>
  }

  const tazasCompletas = Math.min(10, Math.floor(total / 10))
  const beansSueltos = total >= 100 ? 0 : total % 10
  const rebasaMaximo = total > 100

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-2xl font-serif font-bold text-cafe-dark tabular-nums">{total}</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {Array.from({ length: tazasCompletas }).map((_, i) => (
          <CoffeeMugIcon key={`m-${i}`} size={28} />
        ))}
        {Array.from({ length: beansSueltos }).map((_, i) => (
          <CoffeeBeanIcon key={`b-${i}`} size={22} />
        ))}
        {rebasaMaximo && (
          <span className="text-2xl font-serif font-bold text-cafe-dark/60 ml-1">+</span>
        )}
      </div>
    </div>
  )
}

export default function Perfil() {
  const { visitas } = useVisitas()
  const { enviadas, recibidas, eliminar, invKey } = useInvitaciones()
  const { usuario, actualizar } = useUsuario()
  const { user, cerrarSesion } = useAuth()
  const [confirmando, setConfirmando] = useState(null)
  const [editandoPerfil, setEditandoPerfil] = useState(false)
  const [eligiendoFavorita, setEligiendoFavorita] = useState(false)
  const [eligiendoCafe, setEligiendoCafe] = useState(false)

  const cafeFavorito = cafes.find((c) => c.id === usuario.cafeteriaFavoritaId)

  function pedirConfirmacion(tipo, inv) {
    const cafe = cafes.find((c) => c.id === inv.cafeId)
    setConfirmando({ tipo, key: invKey(inv), nombreCafe: cafe?.nombre ?? 'esta invitación' })
  }
  function confirmarEliminar() {
    if (!confirmando) return
    eliminar(confirmando.tipo, confirmando.key)
    setConfirmando(null)
  }

  return (
    <div className="min-h-screen px-4 pt-10 pb-4">
      {/* Botón Entrar / Salir — temporal arriba a la derecha */}
      <div className="flex justify-end mb-2">
        {user ? (
          <button
            onClick={cerrarSesion}
            className="text-[11px] font-semibold text-cafe-accent/70 border border-cafe-accent/25 px-3 py-1 rounded-full"
            title={user.email}
          >
            Salir
          </button>
        ) : (
          <Link
            to="/login"
            className="text-[11px] font-bold bg-cafe-dark text-[#b8d04a] px-3 py-1 rounded-full"
          >
            Iniciar sesión
          </Link>
        )}
      </div>

      {/* Header centrado */}
      <div className="flex flex-col items-center text-center mb-6">
        <button
          onClick={() => setEditandoPerfil(true)}
          className="relative mb-3 active:scale-95 transition-transform"
          aria-label="Editar perfil"
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
        <h1 className="text-xl font-serif font-bold text-cafe-dark leading-tight">{usuario.nombre}</h1>
        <p className="text-sm text-cafe-accent/60 mt-0.5">@{usuario.username}</p>
      </div>

      {/* Stats bar */}
      <div className="bg-[#faf4ec] rounded-2xl shadow-sm flex items-stretch divide-x divide-cafe-accent/15 mb-6">
        <div className="flex-1 flex flex-col items-center justify-center py-3">
          <p className="text-base font-serif font-bold text-cafe-accent/40">—</p>
          <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mt-1">Cafeteros</p>
          <p className="text-[9px] text-cafe-accent/40 italic">próximamente</p>
        </div>
        <button
          onClick={() => setEligiendoCafe(true)}
          className="flex-1 flex flex-col items-center justify-center py-3 active:bg-black/5 transition-colors"
        >
          <p className="text-sm font-serif font-bold text-cafe-dark line-clamp-1 px-2">
            {usuario.cafeFavorito || 'Elegir'}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mt-1">Café favorito</p>
        </button>
        <button
          onClick={() => setEligiendoFavorita(true)}
          className="flex-1 flex flex-col items-center justify-center py-3 active:bg-black/5 transition-colors"
        >
          <p className="text-sm font-serif font-bold text-cafe-dark line-clamp-1 px-2">
            {cafeFavorito ? cafeFavorito.nombre : 'Elegir'}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mt-1">Cafetería favorita</p>
        </button>
      </div>

      {/* Coffee Beans / Tazas */}
      <div className="bg-[#faf4ec] rounded-2xl px-4 py-4 shadow-sm mb-6">
        <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-3">Coffee beans</p>
        <ColeccionBeans total={visitas.length} />
      </div>

      {/* Invitaciones */}
      {(recibidas.length > 0 || enviadas.length > 0) && (
        <div className="bg-[#faf4ec] rounded-2xl px-4 py-3 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-3">
            <InviteIcon size={16} className="text-cafe-dark" />
            <p className="text-sm font-serif font-bold text-cafe-dark">Invitaciones</p>
          </div>

          {recibidas.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-2">Recibidas</p>
              <div className="flex flex-col gap-2.5 mb-3">
                {recibidas.map((inv) => (
                  <InvitacionRow
                    key={`r-${invKey(inv)}`}
                    inv={inv}
                    tipo="recibidas"
                    onEliminar={() => pedirConfirmacion('recibidas', inv)}
                  />
                ))}
              </div>
            </>
          )}

          {enviadas.length > 0 && (
            <>
              <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-2">Enviadas</p>
              <div className="flex flex-col gap-2.5">
                {enviadas.map((inv) => (
                  <InvitacionRow
                    key={`e-${invKey(inv)}`}
                    inv={inv}
                    tipo="enviadas"
                    onEliminar={() => pedirConfirmacion('enviadas', inv)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Mi colección por barrio */}
      <h2 className="text-lg font-serif font-bold text-cafe-dark mb-3">Mi colección</h2>
      <div className="flex flex-col gap-3">
        {barrios.map((barrio) => (
          <ColeccionBarrio key={barrio} barrio={barrio} />
        ))}
      </div>

      {/* Modal confirmar eliminar invitación */}
      {confirmando && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setConfirmando(null)}>
          <div className="bg-[#faf4ec] rounded-2xl p-6 max-w-xs w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-serif font-bold text-cafe-dark mb-2">¿Eliminar invitación?</h3>
            <p className="text-sm text-cafe-accent/70 mb-5">
              Vas a eliminar la invitación a <span className="font-semibold text-cafe-dark">{confirmando.nombreCafe}</span> de tus {confirmando.tipo}. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmando(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-cafe-accent/25 text-cafe-accent active:scale-95 transition-transform">
                Cancelar
              </button>
              <button onClick={confirmarEliminar} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-cafe-dark text-beige active:scale-95 transition-transform">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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
        <h3 className="text-lg font-serif font-bold text-cafe-dark mb-4">¿Cuál es tu café?</h3>
        <div className="flex-1 overflow-y-auto -mx-5 px-5">
          {actual && (
            <button
              onClick={() => onSelect('')}
              className="w-full text-left text-xs text-cafe-accent/60 italic py-2 mb-1"
            >
              Quitar selección
            </button>
          )}
          <div className="grid grid-cols-2 gap-2">
            {TIPOS_CAFE.map((tipo) => {
              const seleccionado = tipo === actual
              return (
                <button
                  key={tipo}
                  onClick={() => onSelect(tipo)}
                  className={`py-3 rounded-xl text-sm font-serif font-bold transition-colors ${
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
          Cerrar
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
        <h3 className="text-lg font-serif font-bold text-cafe-dark mb-4">Editar perfil</h3>

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

        <label className="text-[11px] uppercase tracking-widest text-cafe-accent/50 block mb-1.5">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full bg-transparent border border-cafe-accent/25 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60 mb-4"
        />

        <label className="text-[11px] uppercase tracking-widest text-cafe-accent/50 block mb-1.5">Usuario</label>
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
            title="Generar uno aleatorio"
          >
            🎲
          </button>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-cafe-accent/25 text-cafe-accent active:scale-95 transition-transform">
            Cancelar
          </button>
          <button
            onClick={() => onSave({ nombre: nombre.trim() || usuario.nombre, username: username.trim() || usuario.username, foto })}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-cafe-dark text-beige active:scale-95 transition-transform"
          >
            Guardar
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
        <h3 className="text-lg font-serif font-bold text-cafe-dark mb-3">Cafetería favorita</h3>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar..."
          className="w-full bg-transparent border border-cafe-accent/25 rounded-xl px-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/60 mb-3"
        />
        <div className="flex-1 overflow-y-auto -mx-5 px-5">
          {actualId && (
            <button
              onClick={() => onSelect('')}
              className="w-full text-left text-xs text-cafe-accent/60 italic py-2 mb-1"
            >
              Quitar selección
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
                    <p className="text-sm font-serif font-bold text-cafe-dark truncate">{cafe.nombre}</p>
                    <p className="text-[11px] text-cafe-accent/60 truncate">{cafe.barrio}</p>
                  </div>
                  {seleccionado && <span className="text-cafe-dark text-sm">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold border border-cafe-accent/25 text-cafe-accent active:scale-95 transition-transform">
          Cerrar
        </button>
      </div>
    </div>
  )
}
