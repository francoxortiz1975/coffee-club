import { useEffect, useRef, useState } from 'react'
import { useRecuerdos } from '../context/RecuerdosContext'
import { CameraIcon, PencilIcon } from './Icons'

export default function RecuerdoModal({ cafe, onClose }) {
  const { getRecuerdo, guardarRecuerdo, eliminarRecuerdo } = useRecuerdos()
  const existente = getRecuerdo(cafe.id)
  const fileRef = useRef(null)

  const [preview, setPreview] = useState(existente?.foto_url ?? '')
  const [file, setFile] = useState(null)
  const [nota, setNota] = useState(existente?.nota ?? '')
  const [estado, setEstado] = useState('idle') // idle | guardando | error
  const [error, setError] = useState('')
  const [confirmarBorrar, setConfirmarBorrar] = useState(false)

  // Cleanup del objectURL del preview
  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function elegirFoto(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function guardar() {
    if (!file && !existente?.foto_url) {
      setError('Agrega una foto antes de guardar')
      return
    }
    setEstado('guardando')
    setError('')
    const { error: err } = await guardarRecuerdo(cafe.id, { file, nota })
    if (err) {
      setError('No se pudo guardar. Intenta de nuevo.')
      setEstado('error')
      return
    }
    onClose()
  }

  async function borrar() {
    setEstado('guardando')
    await eliminarRecuerdo(cafe.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 pb-28 sm:pb-6"
      onClick={onClose}
    >
      <div
        className="bg-[#faf4ec] rounded-3xl w-full max-w-sm shadow-2xl flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] uppercase tracking-widest text-cafe-accent/50 mb-1">Recuerdo</p>
          <h3 className="text-xl font-serif font-bold text-cafe-dark leading-tight">{cafe.nombre}</h3>
        </div>

        <div className="px-5 pb-5 overflow-y-auto">
          {/* Polaroid: foto + plaquita de madera con nota editable */}
          <div className="rounded-2xl overflow-hidden bg-[#faf4ec] shadow-sm mb-4">
            {/* Foto */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative w-full aspect-square overflow-hidden bg-cafe-accent/10 flex items-center justify-center active:scale-[0.99] transition-transform"
            >
              {preview ? (
                <img src={preview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center flex flex-col items-center">
                  <CameraIcon size={40} className="text-cafe-accent/60 mb-2" />
                  <p className="text-sm text-cafe-accent/70 font-semibold">Agregar foto</p>
                  <p className="text-[11px] text-cafe-accent/50 mt-1">Toca para elegir de tu galería</p>
                </div>
              )}
              {preview && (
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-cafe-dark/80 text-beige flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <PencilIcon size={15} />
                </div>
              )}
            </button>

            {/* Plaquita de madera con textarea integrado */}
            <div
              className="relative border-t border-black/30"
              style={{
                background: 'linear-gradient(160deg, #6e4a2e 0%, #4a2c1a 60%, #3a2010 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                placeholder='"Fui con María, pedí latte…"'
                rows={2}
                maxLength={280}
                className="w-full bg-transparent text-beige font-serif italic text-center text-sm leading-snug px-4 py-3 outline-none resize-none placeholder:text-beige/45"
              />
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={elegirFoto}
            className="hidden"
          />

          {error && <p className="text-xs text-red-600 mt-2 text-center">{error}</p>}
        </div>

        {/* Acciones */}
        <div className="px-5 pb-5 flex flex-col gap-2.5">
          <button
            onClick={guardar}
            disabled={estado === 'guardando'}
            className="w-full bg-cafe-dark text-[#b8d04a] text-sm font-bold py-3.5 rounded-2xl ring-2 ring-[#b8d04a]/40 active:scale-95 transition-transform disabled:opacity-50"
          >
            {estado === 'guardando' ? 'Guardando…' : existente ? 'Actualizar recuerdo' : 'Guardar recuerdo'}
          </button>
          {existente && !confirmarBorrar && (
            <button
              onClick={() => setConfirmarBorrar(true)}
              className="text-xs font-semibold text-red-500/80 underline self-center"
            >
              Eliminar recuerdo
            </button>
          )}
          {confirmarBorrar && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
              <p className="text-xs text-red-700 mb-2">¿Seguro? La foto y la nota se borran del todo.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmarBorrar(false)}
                  className="flex-1 text-xs font-semibold border border-red-300 text-red-600 py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={borrar}
                  disabled={estado === 'guardando'}
                  className="flex-1 text-xs font-bold bg-red-500 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
          <button onClick={onClose} className="text-xs font-semibold text-cafe-accent/60 self-center">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
