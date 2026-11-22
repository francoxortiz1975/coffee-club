// Textos del quiz "perfil cafetero". Las claves de opciones (new, work, start, rare...) son las
// mismas que se guardan en la waitlist, así que no se traducen: solo cambian las etiquetas.

export const quizCopy = {
  en: {
    docTitle: 'Build your coffee profile | Sumay Coffee Club',
    back: 'Back',
    skip: 'Skip',
    skipNow: 'Skip for now',
    next: 'Continue',

    intro: {
      title: 'Your coffee life,',
      hand: 'in one place.',
      nowIn: 'Now in Paris.',
      tabs: ['Discover', 'Collect', 'Share'],
      captions: [
        'Hand-picked cafés, with their story. Swipe through the book.',
        'A bean at every visit. Ten beans make a cup.',
        'Send a café to a friend with a beautiful invitation.',
      ],
      alts: [
        'App animation: the café book turns a page for every café you are interested in',
        'A loyalty card with ten boxes, one bean collected, and a cup as the tenth',
        'App animation: an envelope opens and reveals an invitation to a café',
      ],
      cta: 'Build my coffee profile',
      sub: '5 quick questions. About a minute.',
      more: 'Read the full story',
    },

    looking: {
      title: 'What are you looking for?',
      lede: 'Pick any that fit. We’ll lead with those.',
      options: {
        new: ['New places to try', 'Hand-picked cafés I’d never find alone'],
        learn: ['Learn about coffee', 'Origins, roasters, the story behind it'],
        rewards: ['Rewards', 'Beans for every visit, at every café'],
      },
    },
    mood: {
      title: 'What’s your coffee shop mood?',
      lede: 'Pick any that sound like you.',
      options: {
        work: ['Laptop-friendly', 'I go to work!'],
        date: ['With my date', 'Somewhere with a little magic'],
        friends: ['With friends', 'Easy to talk, easy to stay'],
        solo: ['Just me, with a book', 'A quiet corner and a good cup'],
      },
    },
    level: {
      title: 'How much of a coffee lover are you?',
      lede: 'No wrong answer. It decides how much story you see.',
      options: {
        start: ['I’m just starting', 'Discovering what I like'],
        getting: ['Getting there', 'I have a few favorites'],
        know: ['I know my stuff', 'Roasters, methods, tasting notes'],
        specialty: ['Specialty all the way', 'Single origin or nothing'],
      },
    },
    pace: {
      title: 'How many coffee shops a week?',
      lede: 'A rough guess is perfect.',
      options: {
        rare: ['Once in a while', 'A treat now and then'],
        low: ['1 or 2 a week', 'A steady habit'],
        mid: ['3 to 5 a week', 'Part of my routine'],
        high: ['6 or more', 'Practically a regular'],
      },
      idle: 'Pick one to see how fast you’ll earn your first cup.',
      result: 'At this pace, your first cup is {w} away.',
      resultSub: 'Every café in Paris counts toward it.',
      weeks: { rare: 'a few months', one: 'about a week', many: 'about {n} weeks' },
    },
    hoods: {
      title: 'Where are you most days?',
      lede: 'Pick up to three neighborhoods.',
      cta: 'See my profile',
      near: 'Near {x}',
    },

    tuning: { label: 'Building your profile', empty: 'Your profile will start to take shape here.' },
    tags: {
      look: { new: 'New places', learn: 'Coffee stories', rewards: 'Rewards' },
      mood: { work: 'Laptop-friendly', date: 'Date spots', friends: 'Good with friends', solo: 'Quiet corners' },
      level: { start: 'Friendly tips', getting: 'Local favorites', know: 'Roasters and methods', specialty: 'Single origin focus' },
    },
    levelLabel: { start: 'I’m just starting', getting: 'Getting there', know: 'I know my stuff', specialty: 'Specialty all the way' },
    freqLabel: { rare: 'Once in a while', low: '1 or 2 a week', mid: '3 to 5 a week', high: '6 or more a week' },

    building: {
      title: 'Building your',
      hand: 'coffee profile.',
      checks: ['Reading what you’re looking for', 'Matching your coffee shop mood', 'Tuning the stories to your level'],
    },

    profile: {
      title: 'Meet your coffee profile.',
      kicker: 'Coffee profile',
      traits: { look: 'Looking for', mood: 'Mood', level: 'Coffee lover', pace: 'Pace' },
      share: 'Share my profile',
      cta: 'Join the waitlist',
      archetypes: {
        remote: ['The Remote Worker', 'Laptop open, flat white close.'],
        romantic: ['The Romantic', 'Always knows the best table for two.'],
        social: ['The Social Sipper', 'Coffee is better with company.'],
        quiet: ['The Quiet Regular', 'A book, a corner and a perfect cup.'],
        explorer: ['The Explorer', 'Always looking for the next great café.'],
        connoisseur: ['The Connoisseur', 'Origins, roasters and brew methods.'],
        collector: ['The Collector', 'Every visit counts, every bean too.'],
        taster: ['The Coffee Lover', 'Good coffee, good company, good places.'],
      },
    },

    join: {
      title: 'Join the waitlist.',
      lede: 'Your first picks will be ready the day Sumay opens in Paris.',
      teaser: 'Your profile and a card with your first bean will be waiting for you.',
      email: 'Email',
      placeholder: 'you@email.com',
      submit: 'Join the waitlist',
      sending: 'Sending…',
      fine: 'We only use your email to tell you when Sumay opens.',
      privacy: 'Privacy',
      errInvalid: 'That email looks incomplete. Check it and try again.',
      errGeneric: 'Something went wrong. Please try again in a moment.',
    },

    done: {
      title: 'You’re in.',
      hand: 'Welcome to the club.',
      body: 'We’ll write the day Sumay opens in Paris. Until then, bring a friend.',
      share: 'Share my profile',
      invite: 'Invite a friend',
      story: 'Read the full story',
      privacy: 'Privacy',
    },

    shareText: 'I’m {name} on Sumay. What’s your coffee profile?',
    copied: 'Link copied. Paste it anywhere.',
    metaDescription: 'Build your coffee profile and join the waitlist for Sumay Coffee Club, now in Paris.',
  },


}

export const HOODS = ['Le Marais', 'Belleville', 'Saint-Germain', 'Montmartre', 'Canal Saint-Martin', 'Bastille', 'Latin Quarter', 'Oberkampf']
export const RATE = { rare: 0.5, low: 1.5, mid: 4, high: 7 }
