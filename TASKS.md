# TASKS — Samay Coffee Club

> Sprint activo: **Fase 0 — Setup**
> Última actualización: 2026-05-13

---

## 🔴 En progreso

*(mover tareas aquí cuando las estés trabajando)*

---

## ⬜ Pendientes — Fase 0: Setup

- [ ] Crear repo en GitHub (`samay-coffee-club`)
- [ ] Correr setup inicial: `npm create vite@latest . -- --template react`
- [ ] Instalar dependencias: Tailwind CSS + vite-plugin-pwa
- [ ] Configurar `tailwind.config.js` y `index.css`
- [ ] Configurar `vite.config.js` con PWA manifest (nombre, colores, íconos)
- [ ] Crear estructura de carpetas: `src/pages/`, `src/components/`, `src/data/`
- [ ] Crear páginas vacías: `Descubrir.jsx`, `Shuffle.jsx`, `Perfil.jsx`
- [ ] Crear `BottomNav.jsx` con los 3 tabs
- [ ] Conectar routing en `App.jsx` (react-router-dom)
- [ ] Agregar íconos PWA: `public/icons/icon-192.png` y `icon-512.png`
- [ ] `npm run build && npm run preview` → verificar que aparece prompt de instalación
- [ ] Crear cuenta en Vercel (si no tienes)
- [ ] Conectar repo de GitHub con Vercel
- [ ] Primer deploy exitoso — obtener URL pública
- [ ] Instalar la app desde el celular con la URL de Vercel ✅ validación

---

## ⬜ Pendientes — Fase 1: Descubrir

- [ ] Diseñar schema final de `cafes.json`
- [ ] Visitar 3–5 cafeterías del Centro Histórico → sacar fotos + escribir fichas
- [ ] Crear `cafes.json` con las primeras 5 cafeterías
- [ ] Componente `CafeCard.jsx`
- [ ] Pantalla `Descubrir` con listado de cards
- [ ] Componente `FilterBar.jsx` con filtros por ocasión
- [ ] Lógica de filtrado
- [ ] Pantalla de detalle de cafetería
- [ ] Ampliar a 10 cafeterías

---

## ⬜ Pendientes — Fase 2: Shuffle + Polish

- [ ] Pantalla `Shuffle` con animación
- [ ] Pantalla `Perfil` (mockup V1 sin auth)
- [ ] Completar 20–25 cafeterías en `cafes.json`
- [ ] Optimización de imágenes
- [ ] Lighthouse PWA score > 90
- [ ] Lanzamiento V1

---

## ✅ Completadas

*(mover aquí cuando termines)*

---

## 📝 Ideas / Backlog

- Modo mapa para ver cafeterías por ubicación
- Búsqueda por nombre
- Compartir cafetería por link directo
- Notificaciones push (nuevo café agregado)
- Widget de café del día
- QR de verificación en cafetería
- Partnerships con cafeterías

---

## Notas de desarrollo

- El service worker **solo funciona** con `build + preview`, no en `dev`
- Todas las imágenes deben pesar < 200KB
- En V1 no hay persistencia local — todo se carga desde `cafes.json`
- Supabase recién entra en Fase 3 (día 22+)
