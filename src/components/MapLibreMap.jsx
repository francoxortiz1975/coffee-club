import { useCallback, useEffect, useRef, useState } from 'react'
import { Map as MapLibre, AttributionControl, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapPins from './MapPins'
import MapDecor from './MapDecor'
import { resolveStyle, PARIS_BOUNDS, MAX_BOUNDS } from '../lib/parchmentStyle'
import './parisMap.css'

/* The treasure map on MapLibre GL (WebGL, vector tiles from OpenFreeMap, repainted as parchment).
   Same props as ParisMap, so the Map tab can use either. Pins and decorations are the same React layers on top. */

// Vite has to be told where the map's worker script is
setWorkerUrl(workerUrl)

const PADDING = { top: 80, bottom: 230, left: 40, right: 60 }

export default function MapLibreMap({ cafes, stamped, mode, selectedId, onSelect, offline = false, badge }) {
  const boxRef = useRef(null)
  const canvasRef = useRef(null)
  const mapRef = useRef(null)
  const [items, setItems] = useState([])
  const [zoom, setZoom] = useState(10)
  const [ready, setReady] = useState(false)
  const [source, setSource] = useState('openfreemap')
  const cafesRef = useRef(cafes)

  const refresh = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    setItems(cafesRef.current.map((c) => { const p = map.project([c.lng, c.lat]); return { c, x: p.x, y: p.y } }))
    setZoom(map.getZoom())
  }, [])

  useEffect(() => {
    cafesRef.current = cafes
    refresh()
  }, [cafes, refresh])

  useEffect(() => {
    let cancelled = false
    let raf = 0
    ;(async () => {
      const { style, source: src } = await resolveStyle({ offline })
      if (cancelled) return
      setSource(src)
      const map = new MapLibre({
        container: canvasRef.current,
        style,
        bounds: PARIS_BOUNDS,
        fitBoundsOptions: { padding: 24 },
        maxBounds: MAX_BOUNDS,
        minZoom: 9,
        maxZoom: 18,
        dragRotate: false,
        pitchWithRotate: false,
        attributionControl: false,
        fadeDuration: 150,
      })
      map.touchZoomRotate.disableRotation()
      map.addControl(new AttributionControl({ compact: true, customAttribution: src === 'fallback' ? 'Paris boundary: IGN' : undefined }), 'top-left')
      // The credits stay (the map data licences ask for them) but start folded into a small "i" you can tap.
      setTimeout(() => { const a = canvasRef.current?.parentElement?.querySelector('.maplibregl-ctrl-attrib'); a?.classList.remove('maplibregl-compact-show'); a?.removeAttribute('open') }, 0)
      const schedule = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; refresh() }) }
      map.on('move', schedule)
      map.on('load', () => { setReady(true); refresh() })
      mapRef.current = map
    })()
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [offline, refresh])

  const fitTo = (list, opts = {}) => {
    const map = mapRef.current
    if (!map || list.length === 0) return
    const lngs = list.map((c) => c.lng), lats = list.map((c) => c.lat)
    map.fitBounds([[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]], { padding: PADDING, maxZoom: 16.5, duration: 600, ...opts })
  }

  // choosing a café nudges the map so the pin is not hidden behind the card at the bottom
  const select = (id, it) => {
    const map = mapRef.current
    const h = boxRef.current.clientHeight, w = boxRef.current.clientWidth
    if (map && id !== selectedId && (it.y < 70 || it.y > h - 230 || it.x < 24 || it.x > w - 24)) {
      const targetY = (70 + (h - 230)) / 2
      map.easeTo({ center: [it.c.lng, it.c.lat], offset: [0, -(h / 2 - targetY)], duration: 450 })
    }
    onSelect(id)
  }

  return (
    <div ref={boxRef} className="pm-box pm-gl">
      <div ref={canvasRef} className="pm-gl-canvas" />
      <div className="pm-paper" style={{ zIndex: 1 }} />
      {!ready && <p className="pm-loading">Drawing the map…</p>}
      {ready && source === 'fallback' && <p className="pm-note">Streets unavailable right now</p>}
      <MapPins
        items={items}
        stamped={stamped}
        mode={mode}
        selectedId={selectedId}
        showLabels={zoom > 15.5}
        onCluster={(members) => fitTo(members.map((m) => m.c))}
        onSelect={select}
      />
      <MapDecor
        onZoomIn={() => mapRef.current?.zoomIn({ duration: 250 })}
        onZoomOut={() => mapRef.current?.zoomOut({ duration: 250 })}
        onFit={() => fitTo(cafes)}
        onAll={() => mapRef.current?.fitBounds(PARIS_BOUNDS, { padding: 24, duration: 600 })}
        badge={badge}
      />
    </div>
  )
}
