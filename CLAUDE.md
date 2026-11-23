# Sumay Coffee Club — developer context for Claude Code

Sumay is a mobile-first PWA to discover cafés, decide where to go, send a café invitation to a friend, and collect a bean for every visit (ten beans = a cup). Born in Quito, expanding to Paris. Live at www.sumayclub.app. Currently in beta with a waitlist.
Product/marketing context lives in `docs/PRODUCT.md`. Read that first for the "why".

## Stack
- React 19 + Vite 8, React Router 7, Tailwind CSS 4 (`@tailwindcss/vite`), vite-plugin-pwa
- Supabase (auth via email magic link / 6-digit OTP; tables: `profiles`, `visitas`, `favoritos`, `recuerdos`, `cafeteros`, `invitaciones`, `waitlist`)
- Libraries: `page-flip` (swipe book), `canvas-confetti`, `html-to-image` (share image), `@phosphor-icons/react`
- Deploy: Vercel, auto-deploys on push to `main`. SPA rewrite in `vercel.json`.

## Run
- `npm run dev` (needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`; without them the app crashes on boot. For UI-only work, dummy values like `http://127.0.0.1:9` / `dummy` are enough)
- `npm run build`, `npm run lint`. No test suite. Verify UI with Playwright/screenshots.
- Lint has older errors in files you did not touch (set-state-in-effect rules); do not treat them as regressions, but do not add new ones.

## Layout
- `src/App.jsx`: two worlds. Standalone pages `/landing`, `/quiz`, `/privacy` (own CSS, light/dark theme, no app shell) and `AppShell` for everything else (bottom nav, textured background per route).
- App navigation is four tabs: **Discover** (one feed at `/` for the installed app; in a browser `/` redirects to `/landing`, and `/?app=1` opens the app for testing — `HomeGate` in App.jsx: filters and curated shelves from `lib/shelves.js` with "See all" at `/shelf/:id`, then a "Can't decide?" card with Swipe (`/decidir/swipe`, the book) and Random (`/decidir/aleatorio`), then the endless Journey: `components/JourneyFeed.jsx`, slurp cards from `data/journey.js` joined by a dashed line, reader at `/journey/:id` that types itself line by line; `/decidir` and `/journey` redirect to `/`), **Map** (`/map`, full-screen map with a round chip showing stamped/total that toggles My Paris (`?mode=mine`); credits fold into a small i: `components/ParisMap.jsx` is the older drag/pinch hand-drawn parchment map of Paris with an X for every Paris café in `cafes.json`, an olive wax stamp for visited ones, pins that cluster into a numbered badge when too close, a café card with Invite / Been here / Details / Directions; no scratch fog; geometry in `lib/parisMap.js` from the real Paris boundary in `data/parisOutline.js`, with a hand-placed Seine; the default map is MapLibre GL (`components/MapLibreMap.jsx`), OpenFreeMap vector tiles repainted as parchment at runtime by `lib/parchmentStyle.js`, falls back to a boundary+Seine style, `&offline=1` forces the fallback; the hand-drawn SVG map (`components/ParisMap.jsx`) is used when the device has no WebGL or with `/map?engine=classic`; pins/decor are shared via `MapPins.jsx` and `MapDecor.jsx`; maplibre is lazy-loaded and its worker URL is set with `setWorkerUrl` for Vite), **Collect** (`/collect`: the card, the souvenirs collage under it, a My Paris preview and the by-neighborhood list; no sub-switch) and **Invite** (`/invite`: next plan, New invitation → `/invite/new` → `/invitacion/:id/setup`, then Received / Sent / Past, unread badge on the tab). Profile (`/perfil`) is not a tab: it opens from the avatar top right on every screen.
- City: `lib/city.js` (`useCity`, `useCityCafes`) + `context/CityContext.jsx` + `components/CitySwitch.jsx`; Paris is the default, choice kept in localStorage `sumay_city`. Discover, Swipe, Random, Shelves, Invite picker and Collect neighborhoods list only the chosen city's cafés; the Map tab is Paris only. Screens that look up a café by id still use all of `cafes.json`.
- Scratch-to-collect: `VisitasContext` sets `fresh` when a visit is added; `components/CollectReveal.jsx` (in AppShell) reuses the landing's playable card (`ScratchCard` + `lib/scratchCard.js`, `single` mode, styles in `components/scratchCollect.css` copied from landing.css under `.scx`): scratch the foil, the bean pops out and flies into its slot on the burlap card. If you change the card's CSS in landing.css, mirror it in scratchCollect.css.
- Other screens (`src/pages`): CafeDetalle, Seleccionados, Cafeteros, InvitacionSetup, InvitacionPage (the receiver's scratch-the-stamp reveal), Login.
- Data: `src/data/cafes.json` (3 Quito + 3 Paris cafés; each has `ciudad`, and Paris ones have `lat`/`lng`, `direccion`, and `coordsApprox: true` where the coordinates were estimated from the street number), contexts in `src/context` (Visitas, Invitaciones, Usuario, Auth, Cafeteros, Recuerdos, Favoritos). Anonymous users use localStorage; signed-in users use Supabase.
- Key components: `components/invitation/` (envelope reveal + landing demo), `components/LoyaltyCard.jsx` (+ `lib/beanArt.js` 3D bean/cup SVG), `components/ScratchCard.jsx` + `lib/scratchCard.js` (landing's playable card), `components/BottomNav.jsx` (4 tabs), `components/AppHeader.jsx` + `AvatarButton.jsx` + `Segmented.jsx` (shared header, profile avatar, iOS-style switch), `lib/parisMap.js` (placeholder Paris outline), `lib/plans.js` (next plan / past helpers).

## Design system
- Fonts (bundled via `@fontsource`, no CDN): Bricolage Grotesque = headings (`font-display`), Geist = body/UI (`font-sans`, default), Parisienne = rare handwritten note (`font-hand`). Scoped exceptions: Cormorant Garamond + Pinyon Script only inside the invitation letter, Finger Paint only on the landing card's crayon label. Do not add new families.
- Rule: text under ~14px uses Geist, not Bricolage.
- Colors: espresso browns (`#2a1a10`, `#3d2b1f`, `#6b4c3b`), cream/beige (`#f5f0e8`), single brand accent lime `#b8d04a`. Invitation letter is dark green with gold hairlines; envelope is cream silk with an olive wax stamp.
- Touch targets: 44px minimum (use `min-h-11`, or a `before:` pseudo-element to extend the hit area without changing the look). Respect `env(safe-area-inset-*)`.
- Always honor `prefers-reduced-motion`.

## Language
- Landing, quiz, privacy and the invitation flow are English. The rest of the app UI is still Spanish (Ecuadorian tone: "cafecito", "Pa trabajar"). Translating the app is an open decision, not done.

## Things that bite
- Invitation page locks body scroll (position fixed). It must stay a fixed scene; scratch uses a larger invisible touch pad.
- The share image captures only `.iv-letter`; the letter carries its own SVG `<defs>` so the export keeps the gold frame and stamp. Keep that when editing it.
- Landing CSS (`.sl h1/h2/p`) can leak into embedded components. Use `div`s and class selectors in anything embedded in the landing.
- The invitation reveal sizes itself to its container (`contained` prop) so it works full screen and in the landing phone.

## Git
- Develop on the branch you are told to use; pushing to `main` deploys to production, so only do it when the owner says so.

## Open items
Paris cafés still need photos, descriptions, price and occasions (they show placeholders); verify `coordsApprox` coordinates (Cuvée Noire, BO&MIE) from their full Google Maps place URLs; decide how Discover handles Quito vs Paris cafés ("Near you" lists both); the Seine path is approximate; burlap photo texture; delete unused Spanish copy files; verify the quiz bean board; optional scratch-to-collect when marking a visit in Perfil; decide on translating the app to English.
