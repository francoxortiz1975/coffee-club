// A little made-up barcode from a string. Decoration only.
export default function Barcode({ seed = '0', digits }) {
  let h = 7
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const bars = []
  let x = 0
  for (let i = 0; i < 84; i++) {
    h = (h * 1103515245 + 12345) >>> 0
    const w = 1 + ((h >> 8) % 2)
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y="0" width={w} height="38" fill="currentColor" />)
    x += w
  }
  const num = digits || String(h).padStart(13, '4').slice(0, 13)
  return (
    <div aria-hidden="true" className="inline-block">
      <svg viewBox={`0 0 ${x} 38`} width="150" height="38" preserveAspectRatio="none">{bars}</svg>
      <p className="text-[11px] font-sans tracking-[0.18em] mt-0.5">{num} SL</p>
    </div>
  )
}
