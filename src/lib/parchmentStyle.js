import { PARIS_OUTLINE_LNGLAT } from '../data/parisOutline'
import { SEINE_LATLNG } from './parisMap'

/* The parchment treasure-map style for MapLibre.
   OpenFreeMap serves a normal map style (OpenMapTiles schema). We fetch it at runtime and repaint every layer
   in parchment and ink, so we do not have to know its layer names. If the tiles cannot be reached, we fall back
   to a tiny style that draws only the Paris boundary and the Seine (so the map is never empty). */

const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'

export const PARIS_BOUNDS = [[2.2242, 48.8160], [2.4697, 48.9020]]
export const MAX_BOUNDS = [[2.00, 48.60], [2.70, 49.12]]

const C = {
  bg: '#ecd9a8', land: '#efdcad', park: '#d8d3a0', water: '#a9c1c4', waterLine: '#8fb0b6',
  building: '#e3cc94', buildingEdge: '#b08a52', road: '#8a6a3c', roadCasing: '#cdb079', ink: '#3b2410',
  label: '#4a2f17', halo: '#efdcad', waterLabel: '#4f7782',
}

const DROP_SOURCE_LAYERS = new Set(['poi', 'housenumber', 'aeroway', 'mountain_peak', 'aerodrome_label'])

export function parchmentize(style) {
  const layers = []
  for (const L of style.layers || []) {
    const sl = L['source-layer']
    if (DROP_SOURCE_LAYERS.has(sl)) continue
    if (L.type === 'raster' || L.type === 'hillshade' || L.type === 'heatmap' || L.type === 'color-relief') continue
    if (L.type === 'symbol' && L.layout?.['icon-image'] && !L.layout?.['text-field']) continue
    const l = JSON.parse(JSON.stringify(L))
    l.paint = l.paint || {}
    l.layout = l.layout || {}
    const id = String(l.id || '')

    if (l.type === 'background') {
      l.paint['background-color'] = C.bg
    } else if (l.type === 'fill') {
      delete l.paint['fill-pattern']
      l.paint['fill-color'] = sl === 'water' ? C.water : sl === 'park' || sl === 'landcover' ? C.park : sl === 'building' ? C.building : C.land
      if (sl === 'building') l.paint['fill-outline-color'] = C.buildingEdge
      else delete l.paint['fill-outline-color']
    } else if (l.type === 'fill-extrusion') {
      delete l.paint['fill-extrusion-pattern']
      l.paint['fill-extrusion-color'] = C.building
      l.paint['fill-extrusion-opacity'] = 0.5
    } else if (l.type === 'line') {
      delete l.paint['line-pattern']
      const casing = id.includes('casing') || id.includes('outline')
      l.paint['line-color'] = sl === 'waterway' || id.includes('water') ? C.waterLine : sl === 'boundary' ? '#6b4a26' : sl === 'building' ? C.buildingEdge : casing ? C.roadCasing : C.road
      l.paint['line-opacity'] = casing ? 0.55 : 0.85
    } else if (l.type === 'symbol') {
      delete l.layout['icon-image']
      l.paint['text-color'] = sl === 'water_name' || sl === 'waterway' ? C.waterLabel : C.label
      l.paint['text-halo-color'] = C.halo
      l.paint['text-halo-width'] = 1.5
      l.paint['text-halo-blur'] = 0.4
    }
    layers.push(l)
  }
  const out = { ...style, layers }
  delete out.light; delete out.sky; delete out.terrain
  return out
}

// Boundary + Seine only. No tiles, no fonts: always works, even offline.
export function fallbackStyle() {
  const ring = PARIS_OUTLINE_LNGLAT
  const seine = SEINE_LATLNG.map(([lat, lng]) => [lng, lat])
  return {
    version: 8,
    name: 'parchment-fallback',
    sources: {
      paris: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] } } },
      seine: { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: seine } } },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': C.bg } },
      { id: 'paris-fill', type: 'fill', source: 'paris', paint: { 'fill-color': C.land } },
      { id: 'seine-wide', type: 'line', source: 'seine', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#6d8a93', 'line-width': ['interpolate', ['linear'], ['zoom'], 9, 5, 14, 18], 'line-opacity': 0.85 } },
      { id: 'seine-core', type: 'line', source: 'seine', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': '#a9c1c4', 'line-width': ['interpolate', ['linear'], ['zoom'], 9, 2, 14, 7] } },
      { id: 'paris-line', type: 'line', source: 'paris', layout: { 'line-join': 'round' }, paint: { 'line-color': C.ink, 'line-width': 2.2 } },
    ],
  }
}

// Fetch OpenFreeMap and repaint it; fall back to the boundary-only style if that fails.
export async function resolveStyle({ offline = false } = {}) {
  if (!offline) {
    try {
      const ctrl = new AbortController()
      const timer = setTimeout(() => ctrl.abort(), 7000)
      const r = await fetch(STYLE_URL, { signal: ctrl.signal })
      clearTimeout(timer)
      if (!r.ok) throw new Error(`style ${r.status}`)
      return { style: parchmentize(await r.json()), source: 'openfreemap' }
    } catch (e) {
      console.warn('OpenFreeMap style unavailable, using the fallback map:', e)
    }
  }
  return { style: fallbackStyle(), source: 'fallback' }
}
