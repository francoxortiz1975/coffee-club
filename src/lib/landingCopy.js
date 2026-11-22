export const LANGS = ['en']

// The playable loyalty card on the landing.
const beansPlay = {
  stage: 'Today’s box',
  card: 'Loyalty card',
  capBean: 'Scratch it off with your finger.',
  capCup: 'Ten. Scratch off your cup.',
  alt: 'Can’t scratch? Tap to reveal',
  padBean: 'Today’s box. Drag to scratch it off, or press Enter to reveal it.',
  padCup: 'Your cup. Drag to scratch it off, or press Enter to reveal it.',
  foilBean: ['Scratch', 'here!'],
  foilCup: ['Scratch', 'for your', 'cup!'],
  c0: 'Ten beans make a cup.',
  c1: '1 bean. 9 to a cup.',
  cN: '{n} beans. {r} to a cup.',
  c9: 'One more, and that’s a cup.',
  c10: 'Ten beans. That’s a cup.',
  doneTitle: 'Ten beans. That’s a cup.',
  join: 'Join the waitlist',
  again: 'Play again',
}

export const copy = {

  en: {
    metaDescription: 'Discover, decide and invite to the best coffee shops in Quito and Paris.',
    skip: 'Skip to content',
    navCta: 'Join the waitlist',
    betaTag: 'Beta',

    heroTitle: ['The club for good coffee.', 'Now in Paris.'],
    heroLead:
      'Find the best coffee shops in town, pick one in seconds and send the invite. Collect a bean every visit.',
    heroCta: 'Join the waitlist',
    heroSecondary: 'See how it works',
    heroPhotoAlt: 'Iced espresso in a stemmed glass on a wooden board, next to old books and coffee beans',
    heroPhoneAlt: 'Sumay app, Discover screen with nearby cafés',

    statement: {
      a: 'Your go-to friend for ',
      hl1: 'finding great coffee',
      b: ', collecting every cup and planning the next ',
      hl2: 'cafecito',
      c: ' without overthinking it.',
    },

    panels: {
      discover: {
        title: 'Discover',
        body: 'Hand-picked cafés by neighborhood, specialty and occasion. Filters, favorites and real reviews.',
      },
      decide: {
        title: 'Decide',
        body: 'A random pick for the indecisive, or an endless book to swipe and make a list of cafés to visit.',
        alt: 'App animation: the café book turns a page for every café you are interested in',
      },
      invite: {
        title: 'Invite',
        body: 'Create a beautiful invitation with a date and a name. Send it over WhatsApp in one tap.',
        alt: 'Sumay app: scratch the wax stamp on the envelope and the invitation letter comes out',
        replay: 'Play again',
      },
    },

    beans: {
      title: 'Every coffee is a bean. Ten beans make a cup.',
      note: 'Just like a loyalty card! But for every café in Paris.',
      play: beansPlay,
    },

    cafes: {
      bornIn: 'Born in Quito.',
      title: 'Paris is being built now.',
      body: 'Add your favorite coffee shop now:',
      cta: 'Add your favorite café',
      notes: {
        'republica-del-cacao': 'Hot chocolate made from fine origin cacao.',
        'coffee-factory': '100% Ecuadorian export-quality specialty coffee.',
        'quito-deli': 'Croissants and fresh bread, European style.',
      },
      alts: {
        'republica-del-cacao': 'República del Cacao: counter with pastries and chocolate under pendant lamps',
        'coffee-factory': 'Coffee Factory: wooden counter, brick wall and café tables',
        'quito-deli': 'Quito Deli: bright room with marble tables and a mural',
      },
    },

    invites: {
      titleA: 'No more ',
      titleEm: '“where should we meet?”',
      body: 'Pick the café, the date and the person. Sumay builds a beautifully animated invitation. They open it and know exactly where to go.',
      facts: ['Café', 'Date and time', 'Who invites', 'Unique link'],
      alt: 'App animation: an envelope opens and reveals Franco’s invitation to Maria at Coffee Factory',
    },

    waitlist: {
      title: 'Save your spot in the club.',
      sub: 'Drop your email for early access to the app. No spam.',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      city: 'City (optional)',
      cityNone: 'Choose one',
      cities: { quito: 'Quito', paris: 'Paris', other: 'Somewhere else' },
      message: 'Message (optional)',
      messageHelp: "Recommend a café, send a note, or tell us what you're looking for.",
      submit: 'Join the waitlist',
      submitting: 'Sending…',
      errorInvalid: 'Check your email, it looks incomplete.',
      errorGeneric: 'Something went wrong. Please try again in a moment.',
      successTitle: "You're in",
      successBody: "We'll write soon with your access to the app.",
      terms: 'By joining you agree to receive a single email with your access.',
    },

    footer: {
      made: 'Made with shungo in Quito & Paris',
      privacy: 'Privacy',
      contact: 'Contact',
      dark: 'Dark',
      light: 'Light',
      theme: 'Theme',
    },

    inApp: {
      title: 'Open Sumay in your browser',
      insideBefore: "You're inside ",
      insideAfter: '. Tap the ',
      topRight: ' at the top right → ',
      openExternal: '“Open in external browser”',
      openChrome: '“Open in Chrome”',
    },
  },
}
