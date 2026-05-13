# Samay Coffee Club — Roadmap 35 días

> Objetivo: 100 usuarios reales en 30 días.
> Estrategia paralela: desarrollo + contenido TikTok + fichas de cafeterías.

---

## FASE 0 — Setup (Días 1–5)

Objetivo: repo listo, PWA instalable, deploy en Vercel funcionando.

| Día | Tarea | Estado |
|-----|-------|--------|
| 1 | Crear repo en GitHub | ⬜ |
| 1 | Setup React + Vite + Tailwind + vite-plugin-pwa | ⬜ |
| 2 | Estructura de carpetas (`pages/`, `components/`, `data/`) | ⬜ |
| 2 | Bottom navigation (3 tabs: Descubrir, Shuffle, Perfil) | ⬜ |
| 3 | `cafes.json` con 3–5 cafeterías reales del Centro Histórico | ⬜ |
| 3 | Íconos PWA (icon-192, icon-512) + manifest validado | ⬜ |
| 4 | Deploy inicial en Vercel | ⬜ |
| 4 | Validar que la app es instalable desde el celular | ⬜ |
| 5 | Buffer / ajustes / primer TikTok del proceso | ⬜ |

---

## FASE 1 — Core V1: Descubrir (Días 6–14)

Objetivo: pantalla principal funcional con cards reales y filtros.

| Día | Tarea | Estado |
|-----|-------|--------|
| 6 | Componente `CafeCard` (foto, nombre, ocasión, especialidad) | ⬜ |
| 7 | Pantalla `Descubrir` — grid de cards | ⬜ |
| 8 | `FilterBar` — filtros por ocasión (pareja, amigos, reunión, turístico, work) | ⬜ |
| 9 | Lógica de filtrado en `cafes.json` | ⬜ |
| 10 | Pantalla de detalle de cafetería (foto grande, historia, info) | ⬜ |
| 11 | Visita real a 3 cafeterías → fotos + texto para fichas | ⬜ |
| 12 | Ampliar `cafes.json` a 10 cafeterías | ⬜ |
| 13 | Ajustes de diseño — paleta, tipografía, spacing | ⬜ |
| 14 | TikTok: "así se ve la app en este punto" | ⬜ |

---

## FASE 2 — Shuffle + Polish V1 (Días 15–21)

Objetivo: experiencia completa V1 publicada y compartible.

| Día | Tarea | Estado |
|-----|-------|--------|
| 15 | Pantalla `Shuffle` — botón + animación + cafetería aleatoria | ⬜ |
| 16 | Lógica de shuffle con filtro opcional por ocasión | ⬜ |
| 17 | Pantalla `Perfil` — versión V1 (mockup, sin auth) | ⬜ |
| 18 | Completar `cafes.json` a 20–25 cafeterías | ⬜ |
| 19 | Optimización de imágenes + carga lazy | ⬜ |
| 20 | Validación PWA completa (Lighthouse score > 90) | ⬜ |
| 21 | **Lanzamiento V1** — compartir link, primeros usuarios reales | ⬜ |

---

## FASE 3 — Auth + Perfiles V2 (Días 22–26)

Objetivo: usuarios pueden crear cuenta y guardar su historial.

| Día | Tarea | Estado |
|-----|-------|--------|
| 22 | Configurar Supabase (proyecto, tablas: `users`, `visits`) | ⬜ |
| 23 | Google OAuth con Supabase Auth | ⬜ |
| 24 | Pantalla `Perfil` real — foto, nombre, cafeterías visitadas | ⬜ |
| 25 | Botón "Marcar como visitada" en ficha de cafetería | ⬜ |
| 26 | Deploy V2 con auth funcionando | ⬜ |

---

## FASE 4 — Coleccionables (Días 27–30+)

Objetivo: sistema gamificado que engancha y genera contenido viral.

| Día | Tarea | Estado |
|-----|-------|--------|
| 27 | Lógica de coffee beans (1 bean = 1 cafetería visitada) | ⬜ |
| 28 | Progreso por sector del Centro Histórico (mapa/lista) | ⬜ |
| 29 | Comparación entre amigos (leaderboard simple) | ⬜ |
| 30 | **Lanzamiento V2** + TikTok final del build-in-public | ⬜ |
| 30+ | QR de verificación en cafeterías (futuro) | ⬜ |
| 30+ | Partnerships con cafeterías (descuentos al completar sector) | ⬜ |

---

## Estrategia de contenido paralela

Cada visita a una cafetería = doble propósito:
1. **Material para la app** — fotos, texto histórico, datos de la ficha
2. **Contenido para TikTok** — apareces en cámara, muestras el lugar, muestras cómo se ve en la app

### Tipos de video TikTok sugeridos
- "Construyendo la app más ecuatoriana de cafés — Día X"
- "Fui a [cafetería] del Centro Histórico y esto encontré"
- "Así se ve el Shuffle mode de la app"
- "¿Cuál es tu cafetería favorita de Quito?"

---

## Modelo de monetización (progresión)

```
V1 (gratis)
  → Validar 100 usuarios
    → B2C: $1/mes por perfil + coleccionables premium
      → B2B: cafeterías pagan por visibilidad destacada + analytics
        → Grants culturales / turismo Ecuador
```

---

## Stack de referencia rápida

```
React + Vite → Tailwind CSS → vite-plugin-pwa → Vercel
                                                     ↓
                                              Supabase (V2)
                                         Auth + PostgreSQL
```
