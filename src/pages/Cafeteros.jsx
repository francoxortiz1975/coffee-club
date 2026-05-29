import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCafeteros } from '../context/CafeterosContext'
import { ArrowLeftIcon, SearchIcon, UserIcon } from '../components/Icons'

function Avatar({ user, size = 48 }) {
  return (
    <div
      className="rounded-full bg-cafe-accent/10 overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {user.foto_url
        ? <img src={user.foto_url} alt={user.nombre} className="w-full h-full object-cover" />
        : <UserIcon size={size * 0.55} className="text-cafe-accent/40" />}
    </div>
  )
}

function UserRow({ user, accion, badge }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <Avatar user={user} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-serif font-bold text-cafe-dark truncate">{user.nombre}</p>
        <p className="text-[11px] text-cafe-accent/60 truncate">@{user.username}</p>
      </div>
      {badge}
      {accion}
    </div>
  )
}

function Buscar() {
  const { buscarUsuarios, enviarSolicitud, cancelarSolicitud, relacionCon } = useCafeteros()
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResultados([])
      return
    }
    setBuscando(true)
    const t = setTimeout(async () => {
      const data = await buscarUsuarios(query)
      setResultados(data)
      setBuscando(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query, buscarUsuarios])

  async function manejarBoton(u) {
    const rel = relacionCon(u.id)
    if (rel === 'enviada') {
      await cancelarSolicitud(u.id)
    } else if (!rel) {
      await enviarSolicitud(u.id)
    }
  }

  function botonPara(u) {
    const rel = relacionCon(u.id)
    if (rel === 'confirmado') {
      return <span className="text-[10px] uppercase tracking-widest text-[#b8d04a] font-bold">cafetero</span>
    }
    if (rel === 'enviada') {
      return (
        <button
          onClick={() => manejarBoton(u)}
          className="text-[11px] font-semibold border border-cafe-accent/30 text-cafe-accent px-3 py-1 rounded-full"
        >
          Cancelar
        </button>
      )
    }
    if (rel === 'recibida') {
      return <span className="text-[10px] uppercase tracking-widest text-cafe-accent/60">te invitó</span>
    }
    return (
      <button
        onClick={() => manejarBoton(u)}
        className="text-[11px] font-bold bg-cafe-dark text-[#b8d04a] px-3 py-1 rounded-full"
      >
        Agregar
      </button>
    )
  }

  return (
    <div>
      <div className="relative mb-3">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cafe-accent/40">
          <SearchIcon size={15} />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por @usuario"
          className="w-full bg-[#faf4ec] border border-cafe-accent/20 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-cafe-dark outline-none focus:border-cafe-accent/50"
        />
      </div>
      {query.trim().length < 2 ? (
        <p className="text-xs text-cafe-accent/50 italic text-center py-4">
          Escribe al menos 2 letras del @usuario que buscas
        </p>
      ) : buscando ? (
        <p className="text-xs text-cafe-accent/50 italic text-center py-4">Buscando…</p>
      ) : resultados.length === 0 ? (
        <p className="text-xs text-cafe-accent/50 italic text-center py-4">
          Nadie encontrado con ese nombre
        </p>
      ) : (
        <div className="bg-[#faf4ec] rounded-2xl px-4 shadow-sm">
          {resultados.map((u) => (
            <UserRow key={u.id} user={u} accion={botonPara(u)} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Cafeteros() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { confirmados, pendientesRecibidas, pendientesEnviadas, responderSolicitud, eliminarCafetero, cancelarSolicitud } = useCafeteros()
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(null)

  if (!user) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ paddingTop: 'calc(16px + env(safe-area-inset-top))' }}
      >
        <p className="text-cafe-dark font-serif text-lg mb-4">
          Inicia sesión para conectar con cafeteros
        </p>
        <Link
          to="/login"
          className="bg-cafe-dark text-[#b8d04a] text-sm font-bold px-6 py-3 rounded-2xl ring-2 ring-[#b8d04a]/40"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen px-4 pb-4"
      style={{ paddingTop: 'calc(16px + env(safe-area-inset-top))' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="text-cafe-accent/60">
          <ArrowLeftIcon size={20} />
        </button>
        <h1 className="text-2xl font-serif font-bold text-cafe-dark">Cafeteros</h1>
      </div>

      {/* Solicitudes recibidas */}
      {pendientesRecibidas.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-2">
            Solicitudes ({pendientesRecibidas.length})
          </p>
          <div className="bg-[#faf4ec] rounded-2xl px-4 shadow-sm">
            {pendientesRecibidas.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                accion={
                  <div className="flex gap-2">
                    <button
                      onClick={() => responderSolicitud(u.id, 'rechazada')}
                      className="text-[11px] font-semibold border border-cafe-accent/30 text-cafe-accent px-3 py-1 rounded-full"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => responderSolicitud(u.id, 'aceptada')}
                      className="text-[11px] font-bold bg-cafe-dark text-[#b8d04a] px-3 py-1 rounded-full"
                    >
                      Aceptar
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Mis cafeteros */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-2">
          Tus cafeteros ({confirmados.length})
        </p>
        {confirmados.length === 0 ? (
          <div className="bg-[#faf4ec] rounded-2xl px-4 py-6 shadow-sm text-center">
            <p className="text-sm text-cafe-accent/70 italic">
              Todavía no tienes cafeteros. Busca a alguien abajo.
            </p>
          </div>
        ) : (
          <div className="bg-[#faf4ec] rounded-2xl px-4 shadow-sm">
            {confirmados.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                accion={
                  <button
                    onClick={() => setConfirmandoEliminar(u)}
                    aria-label="Quitar cafetero"
                    className="text-cafe-accent/40 px-2"
                  >
                    ×
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Solicitudes enviadas pendientes */}
      {pendientesEnviadas.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-2">
            Esperando respuesta ({pendientesEnviadas.length})
          </p>
          <div className="bg-[#faf4ec] rounded-2xl px-4 shadow-sm">
            {pendientesEnviadas.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                accion={
                  <button
                    onClick={() => cancelarSolicitud(u.id)}
                    className="text-[11px] font-semibold border border-cafe-accent/30 text-cafe-accent px-3 py-1 rounded-full"
                  >
                    Cancelar
                  </button>
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Buscar */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-2">
          Encontrar cafeteros
        </p>
        <Buscar />
      </div>

      {/* Modal confirmar eliminar */}
      {confirmandoEliminar && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setConfirmandoEliminar(null)}
        >
          <div className="bg-[#faf4ec] rounded-2xl p-6 max-w-xs w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-serif font-bold text-cafe-dark mb-2">¿Quitar cafetero?</h3>
            <p className="text-sm text-cafe-accent/70 mb-5">
              Vas a quitar a <span className="font-semibold text-cafe-dark">{confirmandoEliminar.nombre}</span> de tus cafeteros.
              Si después se reconectan, hay que mandar la solicitud de nuevo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmandoEliminar(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-cafe-accent/25 text-cafe-accent active:scale-95 transition-transform"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await eliminarCafetero(confirmandoEliminar.id)
                  setConfirmandoEliminar(null)
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-cafe-dark text-beige active:scale-95 transition-transform"
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
