import { Link } from 'react-router-dom'
import { useUsuario } from '../context/UsuarioContext'

// Profile lives here, top right on every screen (it is not a tab).
export default function AvatarButton({ dark = false }) {
  const { usuario } = useUsuario()
  const initials = (usuario.nombre || 'Me').split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <Link
      to="/perfil"
      aria-label="Profile"
      className="relative w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-[13px] font-sans font-bold active:scale-95 transition-transform before:absolute before:-inset-1 before:content-['']"
      style={{ background: dark ? '#f5f0e8' : '#2a1a10', color: dark ? '#2a1a10' : '#b8d04a' }}
    >
      {usuario.foto ? <img src={usuario.foto} alt="" className="w-full h-full object-cover" /> : initials}
    </Link>
  )
}
