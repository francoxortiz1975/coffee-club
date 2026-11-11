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
- App screens (`src/pages`): Descubrir (`/`), CafeDetalle, Decidir → ShufflePage / SwipePage (page-flip book) / Seleccionados, Perfil, Cafeteros, InvitacionSetup, InvitacionPage, Login.
- Data: `src/data/cafes.json` (3 cafés today), contexts in `src/context` (Visitas, Invitaciones, Usuario, Auth, Cafeteros, Recuerdos, Favoritos). Anonymous users use localStorage; signed-in users use Supabase.
- Key components: `components/invitation/` (envelope reveal + landing demo), `components/LoyaltyCard.jsx` (+ `lib/beanArt.js` 3D bean/cup SVG), `components/ScratchCard.jsx` + `lib/scratchCard.js` (landing's playable card), `components/BottomNav.jsx`.

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
Burlap photo texture; delete unused Spanish copy files; verify the quiz bean board; optional scratch-to-collect when marking a visit in Perfil; decide on translating the app to English.
