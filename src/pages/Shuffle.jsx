export default function Shuffle() {
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-serif font-bold text-cafe-dark mb-4">Shuffle</h1>
      <p className="text-cafe-accent text-sm mb-8">¿A dónde vamos hoy?</p>
      <button className="bg-cafe-dark text-beige text-lg font-bold py-4 px-10 rounded-full shadow-lg active:scale-95 transition-transform">
        🎲 Sorpréndeme
      </button>
    </div>
  )
}
