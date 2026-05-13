# Samay Coffee Club — Claude Code Context

> Este archivo es leído automáticamente por Claude Code al abrir el proyecto.
> Mantenlo actualizado conforme avanza el desarrollo.

---

## Qué es este proyecto

**Samay Coffee Club** es una Progressive Web App (PWA) que cura las mejores cafeterías del Ecuador, comenzando por el Centro Histórico de Quito. Combina identidad quichua, contexto histórico de cada lugar, y un sistema de coleccionables gamificado.

- **Usuario:** Ecuatoriano urbano, 18–24 años, universitario o trabajador joven
- **Canal de entrada:** TikTok e Instagram (build-in-public, 30 días)
- **Métrica de validación:** 100 usuarios reales en 30 días
- **Modelo:** Gratuito al inicio → B2C ($1/mes) → B2B (cafeterías pagan por visibilidad)

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite |
| Estilos | Tailwind CSS |
| PWA | vite-plugin-pwa (service worker + manifest) |
| Datos V1 | `cafes.json` (sin base de datos) |
| Auth V2 | Supabase (Google OAuth) |
| Base de datos V2 | Supabase (PostgreSQL) |
| Hosting | Vercel |

---

## Estructura del proyecto

```
samay-coffee-club/
├── public/
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── components/         # Componentes reutilizables (CafeCard, BottomNav, FilterBar...)
│   ├── pages/
│   │   ├── Descubrir.jsx   # Tab principal: listado + filtros
│   │   ├── Shuffle.jsx     # Modo ruleta / tinder
│   │   └── Perfil.jsx      # Perfil de usuario + coffee beans
│   ├── data/
│   │   └── cafes.json      # Fuente de datos V1
│   ├── App.jsx             # Routing + bottom nav
│   ├── main.jsx
│   └── index.css           # Tailwind base
├── CLAUDE.md               # ← este archivo
├── ROADMAP.md
├── TASKS.md
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Navegación de la app

La app tiene **3 tabs** en un bottom navigation bar:

1. **Descubrir** — Recomendaciones con filtros por ocasión: `pareja`, `amigos`, `reunión`, `turístico`, `work`
2. **Shuffle 🎲** — Modo ruleta/tinder: un botón, una cafetería aleatoria, animación. Viral para TikTok.
3. **Perfil** — Info del usuario, coffee beans acumulados (= número de cafeterías visitadas), historial

---

## Schema de cafes.json

```json
{
  "id": "tipico-cafe",
  "nombre": "Típico Café",
  "barrio": "Centro Histórico",
  "ocasiones": ["pareja", "turístico"],
  "especialidad": "Café de altura con panela",
  "historia": "Texto corto con contexto histórico del lugar...",
  "fotos": ["url1", "url2"],
  "coordenadas": { "lat": -0.22, "lng": -78.51 },
  "instagram": "@tipicacafe",
  "precio": "$$"
}
```

---

## Identidad visual

- **Estética:** Rústica latinoamericana con ejecución digital moderna
- **Paleta:** Beige / verde musgo o vino tinto oscuro
- **Colores base:**
  - Background: `#f5f0e8` (beige cálido)
  - Primary: `#3d2b1f` (café oscuro)
  - Accent: `#6b4c3b` (terracota)
- **Tipografía:** Con carácter — serif para títulos, sans para cuerpo
- **Tono de contenido:** Poético en marketing, documental en fichas, íntimo en redes

---

## Convenciones de código

- Componentes: PascalCase (`CafeCard.jsx`)
- Archivos de utilidades: camelCase (`filterCafes.js`)
- CSS: solo Tailwind utility classes, sin CSS custom salvo variables globales
- No usar `localStorage` en V1 (sin persistencia local por ahora)
- Imágenes: optimizadas, máximo 200KB por foto

---

## Variables de entorno

```env
# .env.local (no subir a git)
VITE_SUPABASE_URL=           # Solo en V2
VITE_SUPABASE_ANON_KEY=      # Solo en V2
```

---

## Fase actual

**FASE 0 — Setup** (días 1–5)
Ver `TASKS.md` para las tareas activas.

---

## Comandos frecuentes

```bash
npm run dev        # Desarrollo local (http://localhost:5173)
npm run build      # Build de producción
npm run preview    # Preview del build (aquí se activa el service worker)
vercel             # Deploy a producción
```

> ⚠️ El service worker solo funciona con `npm run build + npm run preview`, no en dev.

---

## Notas importantes

- V1 es completamente sin login. Todo el contenido es público.
- El sistema de coleccionables (coffee beans) es V2 con Supabase.
- Las visitas reales a cafeterías del Centro Histórico son tanto contenido para TikTok como material para las fichas de la app.
- El creador aparece en cámara con gafas cafés — esto es marca personal del proyecto.
