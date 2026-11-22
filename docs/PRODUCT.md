# Sumay Coffee Club — product brief

Written from the codebase, for the marketing and business-model conversations. Everything under "What exists" is built and live. Everything under "Not in the repo" is unknown to the developer side, so do not assume it.

## One line
Your go-to friend for finding great coffee, collecting every cup, and planning the next *cafecito* without overthinking it.

Landing headline: **"The club for good coffee. Now in Paris."** (beta)

## Who it is for
People who like good coffee and like going to cafés with other people. The app organises cafés by occasion: couple, work, friends, meeting, tourist. Born in **Quito, Ecuador**; **Paris** is the focus now (visitors choose Quito / Paris / somewhere else on the waitlist).

## The product loop
The app has four tabs: **Discover, Map, Collect, Invite**. Profile opens from the avatar at the top right.

1. **Discover.** Three modes in one switch. *Browse*: curated shelves (for you, couple, work, friends, meeting, tourist) with "See all". *Swipe*: an endless "book" you turn page by page, ticking the cafés you like, plus a random pick. *Journey*: a road of short coffee lessons called **slurps** in chapters (brewing basics, brewing methods, coffee drinks, origins, tasting, Paris), read as a short conversation with a scene that changes as you travel. Today there are 37 slurps; the copy is a draft. A **city switch** (Paris by default, Quito) decides which cafés are shown.
2. **Map.** A hand-styled parchment treasure map of Paris (real streets, repainted in parchment colours). Every Paris café is an X; visited ones get an olive wax stamp. Tap a café to invite, mark "Been here", open details or directions. Two modes: Explore and My Paris (what you have stamped). The map is Paris only for now.
3. **Collect.** A loyalty card on a burlap board: every visited café earns a bean, ten beans make a cup. Marking a visit plays a short **scratch-to-reveal** moment over the new bean. Also Souvenirs (a photo and note per visit), a My Paris preview and a by-neighbourhood list.
4. **Invite.** Pick a café, a date, a time and a person. Sumay makes an animated invitation link: the friend sees a sealed cream-silk envelope with a wax stamp, scratches the stamp away, and a dark-green letter with confetti shows the café, date and who invited them. It shares as an image or a link (WhatsApp or anything else). The tab holds your next plan, then Received / Sent / Past, with an unread badge.
5. **Cafeteros.** A light social layer: find and confirm friends and see the cafés they visited.

## Cafés in the app
Paris is the focus. **3 Paris cafés** so far, all with cover photos but no descriptions or prices yet: Céramicafé Geneviève (Paris 11), Cuvée Noire (Paris 12), BO&MIE Bastille (Paris 11). **3 Quito cafés** from the first version: República del Cacao (Centro Histórico), Coffee Factory (La Carolina), Quito Deli (La Floresta); they show only when the city switch is set to Quito. More Paris cafés are the main content job.

## What exists today
- A public landing page (`/landing`) with the story, a playable demo of the loyalty card and a playable invitation, a waitlist form, and light/dark theme.
- A short **coffee-profile quiz** (`/quiz`) that ends in the waitlist and stores the answers, so signups arrive with taste data.
- The installable app (PWA for iOS and Android, add to home screen), email sign-in (magic link or 6-digit code). Browsing works without an account.
- **Everything is in English now**: landing, quiz, privacy and the app itself.
- Acquisition tracking in the code: any link can carry `?ref=ig`, `?ref=tiktok`, `?ref=ruta`, etc.; the channel is saved with each waitlist signup, together with city, language and the quiz profile.
- Waitlist consent line: one email with access, no spam.

## Brand
- **Name:** Sumay Coffee Club. Footer line: "Made with *shungo* in Quito and Paris" (*shungo* is the Ecuadorian/Kichwa word for heart).
- **Feel:** warm, handmade, playful, a little premium. Not corporate, not a review site.
- **Visual language:** espresso browns, cream, one lime-green accent (`#b8d04a`). Recurring motifs: coffee beans in 3D, burlap sack cloth, a wax stamp, a silk envelope, a latte-art cup as the reward, crayon-style handwriting.
- **Typography:** Bricolage Grotesque (headings), Geist (body), Parisienne (handwritten notes).
- **Voice:** friendly friend, light humour, English, short sentences. A little Ecuadorian flavour in the brand ("cafecito", *shungo*). Photos of real cafés carry the product.
- **Signature moments for content:** scratching the wax stamp to open an invitation; scratching the foil to reveal your bean; the café book turning a page; the Paris treasure map filling up with stamps.

## Not in the repo (the owner needs to fill these in)
Pricing or monetisation plan; whether cafés are partners and whether they pay; how a completed cup is redeemed and who funds it; user and waitlist numbers; target city launch dates; team and budget; competitors the owner cares about; legal entity. These are open questions, not decisions.

## Questions the other conversations will probably need answered
- **Marketing:** what is the first 100-user plan in Paris (Instagram, TikTok, café-door QR codes, `?ref=` links per channel)? Which of the three signature moments is the hero video? How is "Born in Quito, now Paris" told?
- **Business model:** who pays: users, cafés, or neither at first? Does a free cup cost a café money, and why would they join? Is the invitation the viral loop (every invite brings a new person into the app)? What does a café gain from being listed?

## Links and handles
- Live: www.sumayclub.app (landing at `/landing`, quiz at `/quiz`)
- Code: github.com/francoxortiz1975/coffee-club (see `CLAUDE.md` for the developer view)
