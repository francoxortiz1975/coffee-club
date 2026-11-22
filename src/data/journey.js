/* The Coffee Journey: short slurps grouped in chapters, in this order. DRAFT copy, mostly general coffee knowledge (about
   10% Paris and France), written so the feature has something to show. Review and edit before launch (quantities are typical starting points, not rules).
   Add a slurp by adding an object to a list below. `body` is a list of paragraphs. Optional `emoji` overrides the kind's. */

export const chapters = [
  { id: 'basics', title: 'Brewing basics' },
  { id: 'methods', title: 'Brewing methods' },
  { id: 'drinks', title: 'Coffee drinks' },
  { id: 'origins', title: 'Origins' },
  { id: 'tasting', title: 'Tasting' },
  { id: 'paris', title: 'Paris' },
]

// kind sets the look of the card: Technique, Method, Recipe, Origin, Story, Tasting, Paris, Tip
const L = (chapter, kind, id, minutes, title, body, emoji) => ({ id, chapter, kind, minutes, title, body, ...(emoji ? { emoji } : {}) })

const basics = [
  L('basics', 'Technique', 'four-things', 2, 'Four things decide your coffee', [
    'Every cup comes down to four things: how much coffee, how much water, how fine the grind, and how long they meet.',
    'A good starting ratio is about 1 gram of coffee to 16 grams of water. For one big mug, that is roughly 15 g of coffee and 240 g of water. Taste it, then nudge one thing at a time.',
    'A kitchen scale is the cheapest way to make your coffee better.',
  ], '⚖️'),
  L('basics', 'Technique', 'grind', 2, 'Grind size cheat sheet', [
    'Coarse, like sea salt: French press and cold brew. Medium-coarse to medium: most pour-over and drip machines. Medium-fine: AeroPress and moka pot. Fine: espresso. Extra fine, like powder: Turkish coffee.',
    'The longer the water touches the coffee, the coarser the grind should be. A fast method needs a finer one.',
    'If you can, buy whole beans and grind them just before brewing.',
  ], '🫘'),
  L('basics', 'Technique', 'water', 2, 'Water: temperature and taste', [
    'For most methods, use water at about 92 to 96 °C: just off the boil. Boiling water can scorch the coffee, and cooler water pulls out less.',
    'Coffee is mostly water, so use water that tastes good. Filtered water is a simple upgrade if your tap water has a strong taste.',
  ], '💧'),
  L('basics', 'Technique', 'fresh', 2, 'Fresh beans and how to keep them', [
    'Coffee is at its best in the weeks after roasting. Look for a roast date on the bag, not just a “best before”.',
    'Keep beans in an airtight container, away from light and heat. The fridge is not a good place: moisture and smells get in.',
  ], '🛍️'),
  L('basics', 'Technique', 'sour', 2, 'Why your espresso tastes sour', [
    'Sour and sharp usually means under-extraction: the water did not pull enough out of the coffee.',
    'Three dials can fix it. Grind a little finer, let the shot run a little longer, or use slightly hotter water. Change one thing at a time so you know what worked.',
    'A balanced shot has enough sweetness to match the acidity.',
  ]),
  L('basics', 'Technique', 'bitter', 2, 'Why your coffee tastes bitter', [
    'Harsh, dry or ashy bitterness usually means over-extraction: the water pulled out too much.',
    'Grind a little coarser, shorten the brew time, or use slightly cooler water.',
    'Also check the roast. Very dark roasts are naturally more bitter, whatever you do.',
  ]),
  L('basics', 'Technique', 'bloom', 2, 'The bloom: why you pour a little water first', [
    'Fresh coffee holds carbon dioxide. When hot water touches the grounds, they puff up and release it. That is the bloom.',
    'For pour-over, start with about twice the weight of the coffee in water, then wait 30 to 45 seconds before pouring the rest. The gas escapes, and the water extracts more evenly.',
    'A big bloom is a sign the coffee is fresh.',
  ]),
]

const methods = [
  L('methods', 'Method', 'french-press', 3, 'French press', [
    'A full-immersion method: coffee and water sit together, then a metal filter is pressed down. It gives a rich, full-bodied cup with a little sediment.',
    'Use a coarse grind and about 1 g of coffee to 15 g of water. Add water just off the boil, stir, put the lid on and wait about 4 minutes.',
    'Press down slowly, then pour it all out right away. If it sits on the grounds, it keeps extracting and turns bitter.',
  ], '🫖'),
  L('methods', 'Method', 'moka', 3, 'Moka pot (the Italian stovetop)', [
    'The moka pot makes strong, concentrated coffee on the stove. It is not true espresso, because it uses much less pressure, but it is close in spirit.',
    'Fill the bottom chamber with water just below the safety valve. Fill the basket with a medium-fine grind (finer than drip, coarser than espresso) and level it without tamping. Screw it together and heat gently.',
    'When the coffee starts to gurgle, take it off the heat and run the base under cold water to stop it. Serve right away.',
  ], '♨️'),
  L('methods', 'Method', 'pour-over', 3, 'Pour-over (V60 and friends)', [
    'A clean, bright, easy-to-taste method. Hot water is poured by hand over a bed of coffee in a paper filter.',
    'Try 15 g of medium-fine coffee and 250 g of water. Rinse the filter, add the coffee, bloom with about 30 g of water for 30 to 45 seconds, then pour slowly in circles until you reach 250 g. Aim for a total time of about 2:30 to 3:30.',
    'If it drains too fast, grind finer. If it is slow and bitter, grind coarser.',
  ], '💧'),
  L('methods', 'Method', 'aeropress', 3, 'AeroPress', [
    'Small, sturdy and forgiving, which makes it popular with travellers. It combines steeping with gentle pressure.',
    'One common recipe: 15 g of medium-fine coffee, 200 g of hot water, stir, steep for 1 to 2 minutes, then press slowly for about 30 seconds.',
    'It is also great for experimenting: change one thing and taste the difference.',
  ], '🧪'),
  L('methods', 'Method', 'espresso-machine', 3, 'The espresso machine', [
    'An espresso machine forces hot water through finely ground, tightly packed coffee at about 9 bar of pressure. That pressure is what makes crema and a concentrated shot.',
    'A common starting recipe: 18 g of finely ground coffee in, about 36 g of espresso out, in roughly 25 to 30 seconds. That is a 1:2 ratio.',
    'Grind size and tamping decide how fast the water flows. If it runs too fast, grind finer.',
  ], '☕'),
  L('methods', 'Method', 'cold-brew', 3, 'Cold brew', [
    'Cold brew steeps coarse coffee in cold water for a long time. It tastes smooth, sweet and low in sharpness.',
    'Mix about 1 part coffee to 8 parts cold water, leave it for 12 to 18 hours, then filter it. It makes a concentrate: dilute it with water, ice or milk.',
    'Keep it in the fridge and drink it within a few days.',
  ], '🧊'),
  L('methods', 'Method', 'turkish', 3, 'Turkish coffee (cezve)', [
    'Coffee ground to a powder is heated with water in a small pot called a cezve or ibrik. Sugar is added at the start, if you want it.',
    'Heat slowly. When the foam rises, take it off before it boils over. Pour gently without stirring.',
    'Let the grounds settle for a minute and sip slowly. Do not drink the last bit at the bottom.',
  ], '🏺'),
]

const drinks = [
  L('drinks', 'Recipe', 'drinks-overview', 3, 'Coffee drinks, side by side', [
    'Most café drinks start with espresso. What changes is how much water or milk is added, and what kind.',
    'Espresso and ristretto: just the shot. Americano: espresso with hot water. Macchiato: espresso with a spot of milk foam. Cortado: espresso with about the same amount of warm milk.',
    'Flat white, cappuccino and latte are all espresso with steamed milk, from the least milk to the most: a flat white is the smallest and strongest, a cappuccino has thick foam, and a latte is the biggest and mildest.',
    'Sizes and recipes vary from café to café. When in doubt, ask the barista.',
  ], '📋'),
  L('drinks', 'Recipe', 'espresso', 2, 'How to make an espresso', [
    'Espresso is the base of most café drinks: a small, concentrated shot with a layer of golden foam on top called crema.',
    '1. Grind about 18 g of coffee finely and tamp it level. 2. Run hot water through it at about 9 bar. 3. Stop at about 36 g in the cup, after 25 to 30 seconds.',
    'A single shot is about 30 ml. Many cafés serve a double by default.',
  ]),
  L('drinks', 'Recipe', 'ristretto', 2, 'How to make a ristretto', [
    'Ristretto means “restricted” in Italian: a shorter shot made with the same coffee but less water.',
    'Stop the shot early, at around 15 to 20 ml. It tastes sweeter, thicker and less bitter than a regular espresso.',
  ]),
  L('drinks', 'Recipe', 'doppio', 2, 'What is a doppio?', [
    'Doppio is Italian for “double”: two shots of espresso in one cup, about 60 ml.',
    'Use about twice the coffee. Many specialty cafés use a double as their standard shot, so a “flat white” often already has a doppio in it.',
  ]),
  L('drinks', 'Recipe', 'americano', 2, 'How to make an Americano', [
    'An Americano is espresso with hot water added. It is longer and milder than an espresso, but still has the espresso flavor.',
    '1. Pull a shot of espresso. 2. Add about two to three times its volume in hot water. It is said to come from American soldiers in Italy, who watered down espresso to match their drip coffee.',
    'If you pour the water first and the espresso on top, it is called a long black. It keeps more crema.',
  ], '🇺🇸'),
  L('drinks', 'Recipe', 'macchiato', 2, 'How to make a macchiato', [
    'Macchiato means “stained” or “marked” in Italian. A caffè macchiato is an espresso marked with a small spot of milk foam.',
    '1. Pull a shot of espresso. 2. Spoon about a teaspoon of milk foam on top.',
    'Careful: a latte macchiato is the other way around. It is a glass of steamed milk “marked” with a shot of espresso, so it is mostly milk.',
  ]),
  L('drinks', 'Recipe', 'cortado', 2, 'How to make a cortado', [
    'Cortado comes from the Spanish word for “cut”: the espresso is cut with warm milk to soften its acidity.',
    '1. Pull a double shot of espresso. 2. Add about the same amount of lightly steamed milk, with very little foam. The result is about 60 to 120 ml.',
  ], '✂️'),
  L('drinks', 'Recipe', 'flat-white', 2, 'How to make a flat white', [
    'The flat white is usually credited to Australia and New Zealand. It has a strong coffee flavor and a velvety texture.',
    '1. Pull a double shot of espresso in a small cup. 2. Steam milk to a smooth, glossy microfoam with no big bubbles. 3. Pour so the milk and coffee blend, ending with a thin layer on top. About 160 to 180 ml in total.',
  ], '🥛'),
  L('drinks', 'Recipe', 'cappuccino', 2, 'How to make a cappuccino', [
    'A cappuccino is classically one third espresso, one third steamed milk and one third thick foam.',
    '1. Pull a shot of espresso. 2. Steam milk with more air than for a latte, to make thick, creamy foam. 3. Pour the milk, then spoon the foam on top. About 150 to 180 ml.',
    'Some people dust it with cocoa. That is optional.',
  ]),
  L('drinks', 'Recipe', 'latte', 2, 'How to make a latte', [
    'Latte is short for caffè latte, which means “milk coffee” in Italian. It is the mildest of the milky drinks.',
    '1. Pull one or two shots of espresso in a tall glass or cup. 2. Add about 150 to 250 ml of steamed milk. 3. Finish with a thin layer of foam, about 1 cm. Total: roughly 240 to 350 ml.',
  ], '🥛'),
  L('drinks', 'Recipe', 'mocha', 2, 'How to make a mocha', [
    'A mocha is a latte with chocolate: coffee and hot chocolate in one cup.',
    '1. Put 1 to 2 tablespoons of chocolate syrup or cocoa in the cup. 2. Add a shot of espresso and stir. 3. Add steamed milk. Whipped cream on top is optional.',
  ], '🍫'),
  L('drinks', 'Recipe', 'affogato', 2, 'How to make an affogato', [
    'Affogato means “drowned” in Italian. It is a dessert and a coffee at the same time.',
    '1. Put a scoop of vanilla gelato or ice cream in a glass or small bowl. 2. Pour a hot shot of espresso over it, right before serving.',
    'Eat it fast, before it all melts.',
  ], '🍨'),
]

const origins = [
  L('origins', 'Origin', 'ethiopia', 3, 'Ethiopia: where coffee began', [
    'Arabica coffee is native to the highland forests of Ethiopia, and people there have been drinking it for centuries. The best-known story says a goatherd named Kaldi noticed his goats getting lively after eating red coffee cherries.',
    'Ethiopian coffees are often described as floral and fruity, with a light, tea-like body. Regions such as Yirgacheffe and Sidamo are famous for it.',
    'Next time a café lists an Ethiopian coffee, look for words like jasmine, bergamot or blueberry on the menu.',
  ]),
  L('origins', 'Origin', 'arabica-robusta', 2, 'Arabica vs robusta', [
    'Two species make almost all the coffee in the world. Arabica is sweeter and more aromatic, with more acidity. It grows at higher altitudes and is more delicate.',
    'Robusta is stronger and more bitter, with about twice the caffeine. It is hardier and grows at lower altitudes. You will find it in some espresso blends, where it adds body and crema, and in instant coffee.',
    'Most specialty coffee is arabica.',
  ], '🌿'),
  L('origins', 'Origin', 'bean-belt', 2, 'The bean belt', [
    'Coffee grows in a band around the Earth between the Tropic of Cancer and the Tropic of Capricorn, where it is warm, humid and rainy.',
    'Altitude matters too. On higher farms the cherries ripen more slowly, which often gives denser beans with more flavor.',
    'Brazil, Colombia, Ethiopia, Kenya, Vietnam, Indonesia and Guatemala are all in the belt.',
  ], '🌍'),
  L('origins', 'Origin', 'origin-trio', 3, 'Three famous origins: Brazil, Colombia, Kenya', [
    'Brazil is the world’s largest coffee producer. Its coffees are often nutty and chocolatey, with low acidity.',
    'Colombian coffees are known for being balanced, with notes of caramel and fruit.',
    'Kenyan coffees are famous for bright, juicy acidity, often compared to blackcurrant. These are typical descriptions: every farm and every harvest is a little different.',
  ], '🗺️'),
  L('origins', 'Origin', 'cherry-to-cup', 3, 'From cherry to cup', [
    'A coffee bean is the seed of a fruit called a cherry. After picking, the cherries are processed, dried, hulled, sorted and roasted.',
    'Processing changes flavor. Washed coffees have the fruit removed with water before drying, and taste clean and bright. Natural coffees dry inside the fruit, and taste fruity and heavy. Honey coffees keep some of the sticky fruit, and sit in between.',
  ], '🍒'),
]

const tasting = [
  L('tasting', 'Tasting', 'taste', 3, 'How to taste coffee like a barista', [
    'Start with the smell. Then take a small sip and slurp it, so the coffee spreads across your whole tongue.',
    'Ask four questions: how sweet is it, how bright is it, how heavy does it feel, and how long does the taste last?',
    'Then reach for simple words: fruity, nutty, chocolatey, floral. There are no wrong answers.',
  ]),
  L('tasting', 'Tasting', 'acidity', 2, 'Acidity is not a bad word', [
    'In coffee, acidity means brightness: a lively, juicy quality, like a green apple or a squeeze of citrus.',
    'It is different from sourness. Good acidity is pleasant and clean. Sourness is sharp and unpleasant, and often means under-extraction.',
  ]),
  L('tasting', 'Tasting', 'roast-levels', 2, 'Light, medium, dark: what roast means', [
    'Light roasts keep more of the coffee’s origin flavors, and often taste brighter and fruitier. Medium roasts are rounder and more balanced. Dark roasts are roasted longer and taste bold, smoky and more bitter, with less origin character.',
    'Roast level is about flavor, not strength. Choose the one you enjoy.',
  ], '🔥'),
]

const paris = [
  L('paris', 'Paris', 'order-paris', 2, 'How to order a coffee in Paris', [
    'Start with “Bonjour”. It matters.',
    '“Un café” is a small espresso. “Un allongé” is a longer espresso with more water. “Un noisette” is an espresso with a dash of milk. “Un café crème” is coffee with steamed milk.',
  ]),
  L('paris', 'Paris', 'paris-culture', 2, 'Café culture in Paris: bar, table, terrace', [
    'In a French café the same coffee can cost different amounts depending on where you sit. Standing at the bar (au comptoir) is usually cheapest, then a table inside, then the terrace. You are paying for the seat. Cafés have to display their prices.',
    'Service is included in the price by law (“service compris”), so tipping is a small optional extra: a few coins if you were happy.',
  ], '🪑'),
  L('paris', 'Paris', 'cafe-gourmand', 2, 'The café gourmand', [
    'A French favorite: a coffee, usually an espresso, served with a few small desserts on one plate. Think a mini tart, a spoonful of mousse and a macaron.',
    'It is a way to taste several sweets without ordering a whole dessert.',
  ], '🍰'),
]

export const slurps = [...basics, ...methods, ...drinks, ...origins, ...tasting, ...paris]

// A mix for the teaser shelf on Browse, one from several chapters
export const TEASER_IDS = ['four-things', 'french-press', 'macchiato', 'ethiopia', 'sour', 'order-paris']

export const KIND_STYLE = {
  Technique: { emoji: '☕', from: '#7a4a24', to: '#3d2412' },
  Method: { emoji: '🫖', from: '#2f4f5f', to: '#192c36' },
  Recipe: { emoji: '☕', from: '#6b3b2a', to: '#341a12' },
  Origin: { emoji: '🌱', from: '#3d5a40', to: '#1f3426' },
  Story: { emoji: '📖', from: '#5b6a2a', to: '#343d14' },
  Tasting: { emoji: '👃', from: '#7a2e1d', to: '#3b1710' },
  Paris: { emoji: '🥐', from: '#3b4a63', to: '#1e2736' },
  Tip: { emoji: '💡', from: '#626d27', to: '#3a4316' },
}
