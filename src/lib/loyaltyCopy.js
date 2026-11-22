// Copy for the loyalty card.
export const loyaltyCopyEs = {
  c0: 'Ten beans make a cup.',
  c1: '1 bean. 9 to a cup.',
  cN: '{n} beans. {r} to a cup.',
  c9: 'One more, and that\u2019s a cup.',
  c10: 'Ten beans. That\u2019s a cup.',
  cups: (n) => (n === 1 ? '1 cup earned' : `${n} cups earned`),
  title: 'My card',
  aria: (shown, cups) => `Loyalty card: ${shown} of 10 beans${cups ? `, ${cups} cups earned` : ''}`,
}
