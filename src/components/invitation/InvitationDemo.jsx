import { useMemo, useState } from 'react'
import InvitationReveal from './InvitationReveal'
import cafes from '../../data/cafes.json'
import './invitation.css'

// The playable invitation inside the landing phone: scratch the wax stamp, the letter comes out.
// Sample data only; the date is always the coming Saturday so the demo never looks stale.
function nextSaturday() {
  const d = new Date()
  d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function InvitationDemo({ replay = 'Play again' }) {
  const cafe = useMemo(() => cafes.find((c) => c.id === 'coffee-factory') || cafes[0], [])
  const [fecha] = useState(nextSaturday)
  const [run, setRun] = useState(0)
  const [estado, setEstado] = useState('cerrada')
  const sealed = estado !== 'abierta'

  return (
    <div className="ivd">
      <div className="ivd-bg" style={{ backgroundImage: `url(${cafe.fotos?.[0]})`, filter: `blur(${sealed ? 5 : 2}px)` }} />
      <div className="ivd-ov" />
      <InvitationReveal
        key={run}
        contained
        reserve={150}
        cafe={cafe}
        nombre="Camila"
        receptor="Valentina"
        fecha={fecha}
        hora="16:30"
        onPhase={setEstado}
      />
      {estado === 'abierta' && (
        <button
          type="button"
          className="ivd-replay"
          onClick={() => { setEstado('cerrada'); setRun((r) => r + 1) }}
        >
          {replay}
        </button>
      )}
    </div>
  )
}
