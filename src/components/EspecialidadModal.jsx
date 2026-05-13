export default function EspecialidadModal({ especialidades, activa, onChange, onClose }) {
  return (
    <>
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-beige rounded-t-3xl z-50 px-5 pt-5 pb-10">
        <div className="w-10 h-1 bg-cafe-dark/20 rounded-full mx-auto mb-5" />
        <h2 className="text-base font-serif font-bold text-cafe-dark mb-4">Especialidad de café</h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange(null)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              activa === null
                ? 'bg-cafe-dark text-beige border-cafe-dark'
                : 'bg-white text-cafe-accent border-cafe-accent/25'
            }`}
          >
            Todas
          </button>
          {especialidades.map((e) => (
            <button
              key={e}
              onClick={() => onChange(e)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
                activa === e
                  ? 'bg-cafe-dark text-beige border-cafe-dark'
                  : 'bg-white text-cafe-accent border-cafe-accent/25'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
