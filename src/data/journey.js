import historias from './historias.js'

/* The Coffee Journey: short lessons grouped in chapters. DRAFT copy, written to give the feature something to
   show. Review and edit before launch. Add a lesson by adding an object to `lessons` (body is a list of paragraphs). */

export const chapters = [
  { id: 'origins', title: 'Origins' },
  { id: 'brewing', title: 'Brewing' },
  { id: 'tasting', title: 'Tasting' },
  { id: 'paris', title: 'Paris' },
]

// kind sets the look of the card: Origin, Technique, Tasting, Paris, Story, Tip
const own = [
  {
    id: 'ethiopia', chapter: 'origins', kind: 'Origin', minutes: 3, title: 'Ethiopia: where coffee began',
    body: [
      'Arabica coffee is native to the highland forests of Ethiopia, and people there have been drinking it for centuries. The best-known story says a goatherd named Kaldi noticed his goats getting lively after eating red coffee cherries.',
      'Ethiopian coffees are often described as floral and fruity, with a light, tea-like body. Regions such as Yirgacheffe and Sidamo are famous for it.',
      'Next time a café lists an Ethiopian coffee, look for words like jasmine, bergamot or blueberry on the menu.',
    ],
  },
  {
    id: 'sour', chapter: 'brewing', kind: 'Technique', minutes: 2, title: 'Why your espresso tastes sour',
    body: [
      'Sour and sharp usually means under-extraction: the water did not pull enough out of the coffee.',
      'Three dials can fix it. Grind a little finer, let the shot run a little longer, or use slightly hotter water. Change one thing at a time so you know what worked.',
      'A balanced shot has enough sweetness to match the acidity.',
    ],
  },
  {
    id: 'bitter', chapter: 'brewing', kind: 'Technique', minutes: 2, title: 'Why your coffee tastes bitter',
    body: [
      'Harsh, dry or ashy bitterness usually means over-extraction: the water pulled out too much.',
      'Grind a little coarser, shorten the brew time, or use slightly cooler water.',
      'Also check the roast. Very dark roasts are naturally more bitter, whatever you do.',
    ],
  },
  {
    id: 'bloom', chapter: 'brewing', kind: 'Technique', minutes: 2, title: 'The bloom: why you pour a little water first',
    body: [
      'Fresh coffee holds carbon dioxide. When hot water touches the grounds, they puff up and release it. That is the bloom.',
      'For pour-over, start with about twice the weight of the coffee in water, then wait 30 to 45 seconds before pouring the rest. The gas escapes, and the water extracts more evenly.',
      'A big bloom is a sign the coffee is fresh.',
    ],
  },
  {
    id: 'menu', chapter: 'brewing', kind: 'Tip', minutes: 2, title: 'Espresso, cortado, flat white: what is what',
    body: [
      'Espresso: a small, concentrated shot. Americano: espresso with hot water added.',
      'Cortado: espresso cut with about the same amount of warm milk. Flat white: espresso with steamed milk and a thin layer of microfoam. Cappuccino: espresso, steamed milk and a thick layer of foam.',
      'Sizes and recipes change from café to café, so when in doubt, ask the barista.',
    ],
  },
  {
    id: 'taste', chapter: 'tasting', kind: 'Tasting', minutes: 3, title: 'How to taste coffee like a barista',
    body: [
      'Start with the smell. Then take a small sip and slurp it, so the coffee spreads across your whole tongue.',
      'Ask four questions: how sweet is it, how bright is it, how heavy does it feel, and how long does the taste last?',
      'Then reach for simple words: fruity, nutty, chocolatey, floral. There are no wrong answers.',
    ],
  },
  {
    id: 'acidity', chapter: 'tasting', kind: 'Tasting', minutes: 2, title: 'Acidity is not a bad word',
    body: [
      'In coffee, acidity means brightness: a lively, juicy quality, like a green apple or a squeeze of citrus.',
      'It is different from sourness. Good acidity is pleasant and clean. Sourness is sharp and unpleasant, and often means under-extraction.',
    ],
  },
  {
    id: 'order-paris', chapter: 'paris', kind: 'Paris', minutes: 2, title: 'How to order a coffee in Paris',
    body: [
      'Start with “Bonjour”. It matters.',
      '“Un café” is a small espresso. “Un allongé” is a longer espresso with more water. “Un noisette” is an espresso with a dash of milk. “Un café crème” is coffee with steamed milk.',
      'Standing at the bar (au comptoir) is often cheaper than sitting at a table.',
    ],
  },
]

// The Ecuadorian coffee history cards that already existed become the Origins chapter's stories.
const ecuador = historias.map((h) => ({
  id: `ec-${h.id}`, chapter: 'origins', kind: 'Story', minutes: 1, title: h.titulo, body: [h.texto],
}))

export const lessons = [own[0], ...ecuador, ...own.slice(1)]

export const KIND_STYLE = {
  Origin: { emoji: '🌱', from: '#3d5a40', to: '#1f3426' },
  Technique: { emoji: '☕', from: '#7a4a24', to: '#3d2412' },
  Tasting: { emoji: '👃', from: '#7a2e1d', to: '#3b1710' },
  Paris: { emoji: '🥐', from: '#3b4a63', to: '#1e2736' },
  Story: { emoji: '📖', from: '#5b6a2a', to: '#343d14' },
  Tip: { emoji: '💡', from: '#626d27', to: '#3a4316' },
}
