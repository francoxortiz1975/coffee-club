# Sumay Coffee Club — product brief

Written from the codebase, for the marketing and business-model conversations. Everything under "What exists" is built and live. Everything under "Not in the repo" is unknown to the developer side, so do not assume it.

## One line
Your go-to friend for finding great coffee, collecting every cup, and planning the next *cafecito* without overthinking it.

Landing headline: **"The club for good coffee. Now in Paris."** (beta)

## Who it is for
People who like good coffee and like going to cafés with other people. The app organises cafés by occasion: couple, work, friends, meeting, tourist. Born in **Quito, Ecuador**; **Paris** is being built now (visitors choose Quito / Paris / somewhere else on the waitlist).

## The product loop
1. **Discover.** Hand-picked cafés by neighbourhood, specialty and occasion, with filters, favourites and ratings. Today there are **3 cafés** in the app: República del Cacao (Centro Histórico, fine-origin hot chocolate), Coffee Factory (La Carolina, 100% Ecuadorian specialty coffee), Quito Deli (La Floresta, European-style croissants and bread).
2. **Decide.** Two ways to stop dithering: a random pick, or an endless "book" you swipe through, turning a page per café and ticking the ones you like.
3. **Invite.** Pick a café, a date, a time and a person. Sumay creates an animated invitation link: the friend sees a sealed cream-silk envelope with a wax stamp, scratches the stamp away, and a dark-green letter with confetti shows the café, date and who invited them. One tap shares it (as an image, or the link) over WhatsApp or anything else.
4. **Collect.** Every visited café earns a bean on a loyalty-style card on a burlap board. Ten beans make a cup. Each visit can also keep a photo and note (a "recuerdo").
5. **Cafeteros.** A light social layer: find and confirm friends ("cafeteros") and see the cafés they visited.

## What exists today
- A public landing page (`/landing`) with the story, a playable demo of the loyalty card and a playable invitation, a waitlist form, and light/dark theme. English.
- A short **coffee-profile quiz** (`/quiz`) that ends in the waitlist and stores the answers, so signups arrive with taste data.
- The installable app (PWA for iOS and Android, add to home screen), email sign-in (magic link or 6-digit code). Browsing works without an account.
- The app screens are still in **Spanish**; landing, quiz, privacy and invitation pages are English.
- Acquisition tracking in the code: any link can carry `?ref=ig`, `?ref=tiktok`, `?ref=ruta`, etc.; the channel is saved with each waitlist signup, together with city, language and the quiz profile.
- Waitlist consent line: one email with access, no spam.

## Brand
- **Name:** Sumay Coffee Club. Footer line: "Made with *shungo* in Quito and Paris" (*shungo* is the Ecuadorian/Kichwa word for heart).
- **Feel:** warm, handmade, playful, a little premium. Not corporate, not a review site.
- **Visual language:** espresso browns, cream, one lime-green accent (`#b8d04a`). Recurring motifs: coffee beans in 3D, burlap sack cloth, a wax stamp, a silk envelope, a latte-art cup as the reward, crayon-style handwriting.
- **Typography:** Bricolage Grotesque (headings), Geist (body), Parisienne (handwritten notes).
- **Voice:** friendly friend, light humour, local Ecuadorian words ("cafecito", "Pa trabajar", "Para turistear"). Short sentences. Photos of real cafés carry the product.
- **Signature moments for content:** scratching the wax stamp to open an invitation; the bean dropping onto the loyalty card; the café book turning a page.

## Not in the repo (the owner needs to fill these in)
Pricing or monetisation plan; whether cafés are partners and whether they pay; how a completed cup is redeemed and who funds it; user and waitlist numbers; target city launch dates; team and budget; competitors the owner cares about; legal entity. These are open questions, not decisions.

## Questions the other conversations will probably need answered
- **Marketing:** what is the first 100-user plan in Paris (Instagram, TikTok, café-door QR codes, `?ref=` links per channel)? Which of the three signature moments is the hero video? How is "Born in Quito, now Paris" told?
- **Business model:** who pays: users, cafés, or neither at first? Does a free cup cost a café money, and why would they join? Is the invitation the viral loop (every invite brings a new person into the app)? What does a café gain from being listed?

## Links and handles
- Live: www.sumayclub.app (landing at `/landing`, quiz at `/quiz`)
- Code: github.com/francoxortiz1975/coffee-club (see `CLAUDE.md` for the developer view)
